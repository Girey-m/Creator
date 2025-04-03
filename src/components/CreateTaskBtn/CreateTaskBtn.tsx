import { useRef } from "react";
import "./CreateTaskBtn.module.scss";

export function CreateTaskBtn({
  taskName,
  createTask,
}: {
  taskName: string;
  createTask: (taskName: string) => Promise<void>;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  return (
    <button type="button" ref={btnRef} onClick={() => createTask(taskName)}>
      Создать задачу
    </button>
  );
}
