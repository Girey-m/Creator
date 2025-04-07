// src/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GetAllTask } from "./components/GetAllTask/GetAllTask";
import { TaskPage } from "./pages/tasks/task";

export function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Главная страница с списком задач */}
        <Route path="/" element={<GetAllTask />} />
        {/* Страница для отдельной задачи */}
        <Route path="/task/:taskId" element={<TaskPage />} />
      </Routes>
    </Router>
  );
}