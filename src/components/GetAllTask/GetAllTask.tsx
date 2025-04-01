import { useEffect, useState } from "react";
import { fetchAllTask } from "../../services/indexedDBUtils";
import { TaskI } from "../../interface/TaskI";

import "./GetAllTask.module.scss";

export function GetAllTask() {
  const [objTask, setObjTask] = useState<TaskI[]>([]);

  useEffect(() => {
    fetchAllTask()
      .then((fetchedTasks: TaskI[]) => {
        setObjTask(fetchedTasks);
      })
      .catch((error) => {
        console.error("Ошибка при получении задач:", error);
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
