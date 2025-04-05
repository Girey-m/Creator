import { useRef } from "react";
import "./CreateTaskBtn.module.scss";

export function CreateTaskBtn({
  taskName,
  description,
  createTask,
}: {
  taskName: string;
  description: string;
  createTask: (taskName: string, description: string) => Promise<void>;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  return (
    <button
      type="button"
      ref={btnRef}
      onClick={() => createTask(taskName, description)}
    >
      Создать задачу
    </button>
  );
}
