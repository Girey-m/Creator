import { useEffect, useState } from "react";
import { fetchAllTask } from "../../services/indexedDBUtils";
import { TaskI } from "../../interface/TaskI";
import { showLoadingAlert, showSuccessAlert, showErrorAlert } from "../../helpers/alerts";
import MySwal from 'sweetalert2';

import "./GetAllTask.module.scss";

export function GetAllTask() {
  const [objTask, setObjTask] = useState<TaskI[]>([]);

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

  return (
    <div className="tasks-container">
      <h2>Список задач:</h2>
      {objTask.length > 0 ? (
        <ul>
          {objTask.map((task) => (
            <li key={task.id} id={`task-${task.id}`}>
              <strong>{task.title}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет задач</p>
      )}
    </div>
  );
}
