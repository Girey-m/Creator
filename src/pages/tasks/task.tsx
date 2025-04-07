// src/components/TaskPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTaskById } from "../../services/indexedDBUtils";
import { TaskI } from "../../interface/TaskI";

export function TaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<TaskI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      try {
        if (taskId) {
          const fetchedTask = await fetchTaskById(Number(taskId));
          setTask(fetchedTask);
        }
      } catch (error) {
        console.error("Ошибка при загрузке задачи:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!task) {
    return <p>Задача не найдена</p>;
  }

  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
    </div>
  );
}