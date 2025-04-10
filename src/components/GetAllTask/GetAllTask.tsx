import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllTask,
  updateTask,
  removeTask,
  fetchTaskBySearch,
} from "../../services/indexedDBUtils";
import { EditTaskBtn } from "../EditTaskBtn/EditTaskBtn";
import { CallModalWindow } from "../CallModalWindow/CallModalWindow";
import { RemoveTaskBtn } from "../RemoveTaskBtn/RemoveTaskBtn";
import { CreateTask } from "../CreateTask/CreateTask";
import { Search } from "../Search/Search";

// import { GivePureTask } from "../GivePureTask/GivePureTask";
import { TaskI } from "../../interface/TaskI";
import styles from "./GetAllTask.module.scss";
import { Box, Container } from "@mui/material";

export function GetAllTask() {
  const [objTask, setObjTask] = useState<TaskI[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const refreshTasks = async () => {
    try {
      const fetchedTasks = await fetchAllTask();
      setObjTask(fetchedTasks);
      setCurrentPage(1);
    } catch (error) {
      console.error("Ошибка при обновлении задач:", error);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

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

  const saveChanges = async (
    newTitle: string,
    newDescription: string,
    newPriority: string
  ) => {
    if (!editingTaskId) return;

    const updatedTask = objTask.find((task) => task.id === editingTaskId);
    if (!updatedTask) return;

    try {
      await updateTask({
        ...updatedTask,
        title: newTitle,
        description: newDescription,
        priority: newPriority,
      });
      await refreshTasks();
      closeModal();
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
    }
  };

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Search searchFunction={fetchTaskBySearch} />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <CreateTask onTaskAdded={refreshTasks} />
        <Box>
          <h2 className={styles.title}>Список задач:</h2>
          {objTask.length > 0 ? (
            <>
              <ul className={styles.list}>
                {objTask.map((task, index) => {
                  // Отображаем только задачи текущей страницы
                  if (index >= startIndex && index < endIndex) {
                    return (
                      <li key={task.id} className={styles.listItem}>
                        <Link to={`/task/${task.id}`}>
                          <strong className={styles.listTitle}>
                            {task.title}
                          </strong>
                          <p className={styles.listDescription}>
                            {task.description}
                          </p>
                          <p className={styles.listPriority}>{task.priority}</p>
                        </Link>
                        <Box sx={{ display: "flex", gap: "5px" }}>
                          <EditTaskBtn
                            callModalWindow={() => openModal(task.id)}
                            iconSize={1.2}
                          />
                          <RemoveTaskBtn
                            removeTaskInDb={async () => {
                              await removeTask(task.id);
                              await refreshTasks();
                            }}
                          />
                        </Box>
                      </li>
                    );
                  }
                  return null; // Пропускаем задачи за пределами текущей страницы
                })}
              </ul>

              {/* Пагинация */}
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Назад
                </button>
                <span>
                  Страница {currentPage} из{" "}
                  {Math.ceil(objTask.length / tasksPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={endIndex >= objTask.length}
                >
                  Вперед
                </button>
              </Box>
            </>
          ) : (
            <p>Нет задач</p>
          )}
          <CallModalWindow
            isVisible={isModalOpen}
            onClose={closeModal}
            initialValue={{
              title: objTask.find((t) => t.id === editingTaskId)?.title || "",
              description:
                objTask.find((t) => t.id === editingTaskId)?.description || "",
              priority:
                objTask.find((t) => t.id === editingTaskId)?.priority || "",
            }}
            onSave={saveChanges}
          />
        </Box>
      </Box>
    </Container>
  );
}
