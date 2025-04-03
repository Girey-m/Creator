import { useEffect, useState } from "react";
import { fetchAllTask, updateTask } from "../../services/indexedDBUtils";
import { EditTaskBtn } from "../EditTaskBtn/EditTaskBtn";
import { CallModalWindow } from "../CallModalWindow/CallModalWindow";

import { TaskI } from "../../interface/TaskI";

import {
  showLoadingAlert,
  showSuccessAlert,
  showErrorAlert,
} from "../../helpers/alerts";
import MySwal from "sweetalert2";

import styles from "./GetAllTask.module.scss";

export function GetAllTask() {
  const [objTask, setObjTask] = useState<TaskI[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  useEffect(() => {
    showLoadingAlert();

    fetchAllTask()
      .then((fetchedTasks: TaskI[]) => {
        setTimeout(() => {
          MySwal.hideLoading();
          showSuccessAlert(); // Показываем успешное сообщение
          setObjTask(fetchedTasks); // Обновляем состояние задач
        }, 2000);
      })
      .catch((error: Error) => {
        console.error("Ошибка при получении задач:", error);
        MySwal.hideLoading(); // Скрываем индикатор загрузки
        showErrorAlert("Не удалось получить задачи."); // Показываем сообщение об ошибке
      });
  }, []);

  const openModal = (taskId: number) => {
    setEditingTaskId(taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTaskId(null);
  };

  const saveChanges = (newTitle: string) => {
    if (editingTaskId === null) return;

    const updatedTask = objTask.find((task) => task.id === editingTaskId);
    if (!updatedTask) return;

    updateTask({ ...updatedTask, title: newTitle }) // Обновляем задачу в базе данных
      .then(() => {
        setObjTask((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTaskId ? { ...task, title: newTitle } : task
          )
        );
        closeModal();
        showSuccessAlert();
      })
      .catch((error) => {
        console.error("Ошибка при обновлении задачи:", error);
        showErrorAlert("Не удалось обновить задачу.");
      });
  };

  return (
    <div className={styles.tasks}>
      <h2 className={styles["tasks__tile"]}>Список задач:</h2>
      {objTask.length > 0 ? (
        <ul className={styles["tasks__list"]}>
          {objTask.map((task) => (
            <li
              key={task.id}
              id={`task-${task.id}`}
              className={styles["tasks__list-item"]}
            >
              <strong className={styles["tasks__list-title"]}>
                {task.title}
              </strong>
              <EditTaskBtn callModalWindow={() => openModal(task.id)} />
              {/* <input
                type="text"
                className="visually-hidden"
                id={`task-${task.title}`}
                value={task.title}
                readOnly
              /> */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет задач</p>
      )}
      <CallModalWindow
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialValue={
          objTask.find((task) => task.id === editingTaskId)?.title || ""
        }
        onSave={(newTitle: string) => saveChanges(newTitle)}
      />
    </div>
  );
}
