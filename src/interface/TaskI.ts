export type Priority = "Низкий" | "Средний" | "Высокий";

export interface TaskI {
  id: number;
  title: string;
  description: string;
  priority: Priority;
}
