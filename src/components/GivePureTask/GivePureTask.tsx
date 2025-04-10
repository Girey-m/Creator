import { useState, useEffect } from "react";
import { fetchAllTask } from "../../services/indexedDBUtils";

import { TaskI } from "../../interface/TaskI";
import { CreateTaskPropsI } from "../../interface/CreateTaskPropsI";

import styles from "./GivePureTask.module.scss";

export function GivePureTask({ onTaskAdded }: CreateTaskPropsI) {
  const [allTask, setAllTask] = useState<TaskI[]>([]);

  const getTask = async () => {
    try {
      const fetch = await fetchAllTask();
      setAllTask(fetch);
    } catch (error) {
      console.error("Ошибка при обновлении задач:", error);
    }
  };

  useEffect(() => {
    getTask();
  }, [onTaskAdded]);

  return (
    <div className={styles["All-task-container"]}>
      <ul className={styles["All-task-list"]}>
        {allTask.map((task) => (
          <li key={task.id} className={styles["All-task-item"]}>
            <strong className={styles["tasks__list-title"]}>
              {task.title}
            </strong>
            <p className={styles["tasks__list-description"]}>
              {task.description}
            </p>
            <p className={styles["tasks__list-priority"]}>{task.priority}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
