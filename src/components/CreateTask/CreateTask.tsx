import { useRef, useState, useEffect } from "react";
import { CreateTaskBtn } from "../CreateTaskBtn/CreateTaskBtn";
import { addTask, fetchAllTask } from "../../services/indexedDBUtils";
import { TaskI } from "../../interface/TaskI";

import "./CreateTask.module.scss";

export function CreateTask() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState("");

  const handleCreateTask = async () => {
    try {
      if (inputValue.trim()) {
        await addTask({ title: inputValue }); // Используем состояние inputValue
        console.log("Задача успешно добавлена:", inputValue); // Логируем inputValue
      } else {
        console.warn("Название задачи не может быть пустым");
      }
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
    }
  };

  useEffect(() => {
    fetchAllTask().then((tasks: TaskI[]) => {
      tasks.forEach((task) => {
        console.log(task.id, task.title);
      });
    });
  }, []);

  return (
    <>
      <label htmlFor="task-title">Введите название задачи:</label>
      <input
        type="text"
        id="task-title"
        placeholder="Почистить зубы..."
        ref={inputRef}
        value={inputValue} // Двусторонняя привязка
        onChange={(e) => setInputValue(e.target.value)}
      />

      <CreateTaskBtn taskName={inputValue} createTask={handleCreateTask} />
    </>
  );
}
