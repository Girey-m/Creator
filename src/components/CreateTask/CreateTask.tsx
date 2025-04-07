import { useRef, useState } from "react";
import { CreateTaskBtn } from "../CreateTaskBtn/CreateTaskBtn";
import { addTask } from "../../services/indexedDBUtils";
import { CreateTaskPropsI } from "../../interface/CreateTaskPropsI";

import styles from "./CreateTask.module.scss";

export function CreateTask({ onTaskAdded }: CreateTaskPropsI) {
  const inputTitleRef = useRef<HTMLInputElement | null>(null);
  const inputDescriptionRef = useRef<HTMLInputElement | null>(null);
  const [inputValueTitle, setInputValueTitle] = useState("");
  const [inputValueDescription, setInputValueDescription] = useState("");

  const handleCreateTask = async () => {
    try {
      if (inputValueTitle.trim()) {
        await addTask({
          title: inputValueTitle,
          description: inputValueDescription,
        });
        onTaskAdded();
        console.log("Задача успешно добавлена:", inputValueTitle);
      } else {
        console.warn("Название задачи не может быть пустым");
      }
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
    }
  };

  return (
    <>
      <label htmlFor="task-title" className={styles["task__titel-label"]}>
        Введите название задачи:
      </label>
      <input
        type="text"
        id="task-title"
        placeholder="Почистить зубы..."
        className={styles["task__titel-input"]}
        ref={inputTitleRef}
        value={inputValueTitle}
        onChange={(e) => setInputValueTitle(e.target.value)}
      />
      <label
        htmlFor="task-description"
        className={styles["task__description-label"]}
      >
        Введите описанние задачи:
      </label>
      <input
        type="text"
        id="task-description"
        placeholder="Взять щетку..."
        className={styles["task__description-input"]}
        ref={inputDescriptionRef}
        value={inputValueDescription}
        onChange={(e) => setInputValueDescription(e.target.value)}
      />

      <CreateTaskBtn
        taskName={inputValueTitle}
        description={inputValueDescription}
        createTask={handleCreateTask}
      />
    </>
  );
}
