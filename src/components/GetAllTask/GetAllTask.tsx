import { useEffect, useState } from "react";
import {
  fetchAllTask,
  updateTask,
  removeTask,
} from "../../services/indexedDBUtils";
import { EditTaskBtn } from "../EditTaskBtn/EditTaskBtn";
import { CallModalWindow } from "../CallModalWindow/CallModalWindow";
import { RemoveTaskBtn } from "../RemoveTaskBtn/RemoveTaskBtn";
import { CreateTask } from "../CreateTask/CreateTask";
// import { GivePureTask } from "../GivePureTask/GivePureTask";
import { TaskI } from "../../interface/TaskI";
import styles from "./GetAllTask.module.scss";

export function GetAllTask() {
  const [objTask, setObjTask] = useState<TaskI[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [tasksPerPage] = useState(5); // Задач на странице

  const refreshTasks = async () => {
    try {
      const fetchedTasks = await fetchAllTask();
      setObjTask(fetchedTasks);
      setCurrentPage(1); // Сбрасываем страницу при обновлении
    } catch (error) {
      console.error("Ошибка при обновлении задач:", error);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  // Рассчитываем начальный и конечный индексы для текущей страницы
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;

  const openModal = (taskId: number) => {
    setEditingTaskId(taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTaskId(null);
  };

  const saveChanges = (newTitle: string, newDescription: string) => {
    if (editingTaskId === null) return;

    const updatedTask = objTask.find((task) => task.id === editingTaskId);
    if (!updatedTask) return;

    updateTask({ ...updatedTask, title: newTitle, description: newDescription })
      .then(() => {
        refreshTasks();
        closeModal();
      })
      .catch((error) => {
        console.error("Ошибка при обновлении задачи:", error);
      });
  };

  return (
    <>
      <CreateTask onTaskAdded={refreshTasks} />
      <div className={styles.tasks}>
        <h2 className={styles["tasks__tile"]}>Список задач:</h2>
        {objTask.length > 0 ? (
          <ul className={styles["tasks__list"]}>
            {objTask.map((task, index) => {
              // Проверяем, попадает ли задача на текущую страницу
              if (index >= startIndex && index < endIndex) {
                return (
                  <li
                    key={task.id}
                    id={`task-${task.id}`}
                    className={styles["tasks__list-item"]}
                  >
                    <strong className={styles["tasks__list-title"]}>
                      {task.title}
                    </strong>
                    <p className={styles["tasks__list-description"]}>
                      {task.description}
                    </p>
                    <EditTaskBtn callModalWindow={() => openModal(task.id)} />
                    <RemoveTaskBtn
                      removeTaskInDb={() =>
                        removeTask(task.id).then(() => refreshTasks())
                      }
                    />
                  </li>
                );
              }
              return null; // Не рендерим задачи за пределами текущей страницы
            })}
          </ul>
        ) : (
          <p>Нет задач</p>
        )}

        {/* Пагинация */}
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Назад
          </button>
          <span>
            Страница {currentPage} из {Math.ceil(objTask.length / tasksPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={endIndex >= objTask.length}
          >
            Вперед
          </button>
        </div>

        <CallModalWindow
          isVisible={isModalOpen}
          onClose={closeModal}
          initialValue={{
            title:
              objTask.find((task) => task.id === editingTaskId)?.title || "",
            description:
              objTask.find((task) => task.id === editingTaskId)?.description ||
              "",
          }}
          onSave={saveChanges}
        />
      </div>
      {/* <GivePureTask onTaskAdded={refreshTasks} /> */}
    </>
  );
}
