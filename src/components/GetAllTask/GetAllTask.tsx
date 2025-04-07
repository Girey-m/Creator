import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllTask,
  updateTask,
  removeTask,
} from "../../services/indexedDBUtils";
import { EditTaskBtn } from "../EditTaskBtn/EditTaskBtn";
import { CallModalWindow } from "../CallModalWindow/CallModalWindow";
import { RemoveTaskBtn } from "../RemoveTaskBtn/RemoveTaskBtn";
import { CreateTask } from "../CreateTask/CreateTask";
import { GivePureTask } from "../GivePureTask/GivePureTask";
import {
  showLoadingAlert,
  showSuccessAlert,
  showErrorAlert,
} from "../../helpers/alerts";
import MySwal from "sweetalert2";
import { TaskI } from "../../interface/TaskI";
import styles from "./GetAllTask.module.scss";
import { Box, Container } from '@mui/material';

export function GetAllTask() {
  const [objTask, setObjTask] = useState<TaskI[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const refreshTasks = async () => {
    try {
      const fetchedTasks = await fetchAllTask();
      setObjTask(fetchedTasks);
    } catch (error) {
      console.error("Ошибка при обновлении задач:", error);
    }
  };

  useEffect(() => {
    refreshTasks();
    showLoadingAlert();

    fetchAllTask()
      .then((fetchedTasks: TaskI[]) => {
        setTimeout(() => {
          MySwal.hideLoading();
          showSuccessAlert(); // Показываем успешное сообщение
          setObjTask(fetchedTasks); // Обновляем состояние задач
          console.log(objTask);
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

  const saveChanges = (newTitle: string, newDescription: string) => {
    if (editingTaskId === null) return;

    const updatedTask = objTask.find((task) => task.id === editingTaskId);
    if (!updatedTask) return;

    updateTask({ ...updatedTask, title: newTitle, description: newDescription })
      .then(() => {
        refreshTasks();
        closeModal();
        showSuccessAlert();
      })
      .catch((error) => {
        console.error("Ошибка при обновлении задачи:", error);
        showErrorAlert("Не удалось обновить задачу.");
      });
  };

  return (
    <>
      <Container>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 300, maxWidth: 600 }}>
          <CreateTask onTaskAdded={refreshTasks} />
          <Box >
            <h2 className={styles.title}>Список задач:</h2>
            {objTask.length > 0 ? (
              <ul className={styles.list}>
                {objTask.map((task) => (
                  <li
                    key={task.id}
                    id={`task-${task.id}`}
                    className={styles.listItem}
                  >
                    <Link to={`/task/${task.id}`}>     <strong className={styles.listTitle}>
                      {task.title}
                    </strong>
                      <p className={styles.listDescription}>
                        {task.description}
                      </p>
                    </Link>
                    <Box sx={{ display: "flex", gap: "5px" }}>
                      <EditTaskBtn callModalWindow={() => openModal(task.id)} iconSize={1.2} />
                      <RemoveTaskBtn
                        removeTaskInDb={() =>
                          removeTask(task.id).then(() => refreshTasks())
                        }
                      />
                    </Box>

                  </li>
                ))}
              </ul>
            ) : (
              <p>Нет задач</p>
            )}
            <CallModalWindow
              isVisible={isModalOpen}
              onClose={closeModal}
              initialValue={
                objTask.find((task) => task.id === editingTaskId)?.title || ""
              }
              onSave={saveChanges}
            />
          </Box>
          <GivePureTask onTaskAdded={refreshTasks} />
        </Box>
      </Container>
    </>
  );
}
