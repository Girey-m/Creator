import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllTask,
  updateTask,
  removeTask,
  fetchTaskBySearch,
} from "../../services/indexedDBUtils";
import { EditTaskBtn } from "../EditTaskBtn/EditTaskBtn";
import { CallModalWindow } from "../CallModalWindow/CallModalWindow";
import { RemoveTaskBtn } from "../RemoveTaskBtn/RemoveTaskBtn";
import { CreateTask } from "../CreateTask/CreateTask";
import { Search } from "../Search/Search";

// import { GivePureTask } from "../GivePureTask/GivePureTask";
import { Priority, TaskI } from "../../interface/TaskI";
import styles from "./GetAllTask.module.scss";
import {
  Box,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

export function GetAllTask() {
  const [objTask, setObjTask] = useState<TaskI[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [filter, setFilter] = useState(""); // Фильтр
  const [sortOrder, setSortOrder] = useState(""); // 'asc' или 'desc'

  // Обработчик изменения фильтра
  const handleChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value);
  };

  // Обработчик изменения сортировки
  const handleSortOrderChange = (event: SelectChangeEvent<string>) => {
    setSortOrder(event.target.value);
  };

  const commonStyles = {
    color: "white",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(0, 85, 255)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(0, 85, 255)",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  };

  const refreshTasks = async () => {
    try {
      const fetchedTasks = await fetchAllTask();

      // Применим сортировку
      if (filter === "По алфавиту") {
        fetchedTasks.sort((a, b) =>
          sortOrder === "desc"
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title)
        );
      } else if (filter === "По приоритету") {
        const priorityWeight = { Низкий: 1, Средний: 2, Высокий: 3 };
        fetchedTasks.sort((a, b) =>
          sortOrder === "desc"
            ? priorityWeight[b.priority] - priorityWeight[a.priority]
            : priorityWeight[a.priority] - priorityWeight[b.priority]
        );
      }

      setObjTask(fetchedTasks);
      setCurrentPage(1);
    } catch (error) {
      console.error("Ошибка при обновлении задач:", error);
    }
  };

  // При изменении фильтра или порядка сортировки перезапускаем задачу
  useEffect(() => {
    refreshTasks();
  }, [filter, sortOrder]);

  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;

  const openModal = (taskId: number) => {
    setEditingTaskId(taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTaskId(null);
  };

  const saveChanges = async (
    newTitle: string,
    newDescription: string,
    newPriority: Priority
  ) => {
    if (!editingTaskId) return;

    const updatedTask = objTask.find((task) => task.id === editingTaskId);
    if (!updatedTask) return;

    try {
      await updateTask({
        ...updatedTask,
        title: newTitle,
        description: newDescription,
        priority: newPriority,
      });
      await refreshTasks();
      closeModal();
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
    }
  };

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Search searchFunction={fetchTaskBySearch} />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <CreateTask onTaskAdded={refreshTasks} />
        <Box>
          <Box sx={{ display: "flex", gap: "5px" }}>
            <h2 className={styles.title}>Список задач:</h2>

            {/* Добавляем фильтр */}
            <FormControl fullWidth sx={{ ...commonStyles }}>
              <InputLabel
                id="filter-label"
                sx={{ color: "white", "&.Mui-focused": { color: "white" } }}
              >
                Фильтр
              </InputLabel>
              <Select
                labelId="filter-label"
                id="filter-select"
                value={filter}
                label="Фильтр"
                onChange={handleChange}
                sx={{
                  ...commonStyles,
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                }}
              >
                <MenuItem value="">Без фильтра</MenuItem>
                <MenuItem value="По алфавиту">По алфавиту</MenuItem>
                <MenuItem value="По приоритету">По приоритету</MenuItem>
              </Select>
            </FormControl>

            {/* Сортировка */}
            {filter && (
              <FormControl fullWidth sx={{ ...commonStyles }}>
                <InputLabel
                  id="sort-order-label"
                  sx={{ color: "white", "&.Mui-focused": { color: "white" } }}
                >
                  Сортировка
                </InputLabel>
                <Select
                  labelId="sort-order-label"
                  id="sort-order-select"
                  value={sortOrder}
                  label="Сортировка"
                  onChange={handleSortOrderChange}
                  sx={{
                    ...commonStyles,
                    "& .MuiSelect-icon": {
                      color: "white",
                    },
                  }}
                >
                  <MenuItem value="asc">По возрастанию</MenuItem>
                  <MenuItem value="desc">По убыванию</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>

          {objTask.length > 0 ? (
            <>
              <ul className={styles.list}>
                {objTask.map((task, index) => {
                  // Отображаем только задачи текущей страницы
                  if (index >= startIndex && index < endIndex) {
                    return (
                      <li key={task.id} className={styles.listItem}>
                        <Link to={`/task/${task.id}`}>
                          <strong className={styles.listTitle}>
                            {task.title}
                          </strong>
                          <p className={styles.listDescription}>
                            {task.description}
                          </p>
                          <p className={styles.listPriority}>{task.priority}</p>
                        </Link>
                        <Box sx={{ display: "flex", gap: "5px" }}>
                          <EditTaskBtn
                            callModalWindow={() => openModal(task.id)}
                            iconSize={1.2}
                          />
                          <RemoveTaskBtn
                            removeTaskInDb={async () => {
                              await removeTask(task.id);
                              await refreshTasks();
                            }}
                          />
                        </Box>
                      </li>
                    );
                  }
                  return null; // Пропускаем задачи за пределами текущей страницы
                })}
              </ul>

              {/* Пагинация */}
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Назад
                </button>
                <span>
                  Страница {currentPage} из{" "}
                  {Math.ceil(objTask.length / tasksPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={endIndex >= objTask.length}
                >
                  Вперед
                </button>
              </Box>
            </>
          ) : (
            <p>Нет задач</p>
          )}
          <CallModalWindow
            isVisible={isModalOpen}
            onClose={closeModal}
            initialValue={{
              title: objTask.find((t) => t.id === editingTaskId)?.title || "",
              description:
                objTask.find((t) => t.id === editingTaskId)?.description || "",
              priority:
                (objTask.find((t) => t.id === editingTaskId)
                  ?.priority as Priority) || "",
            }}
            onSave={saveChanges}
          />
        </Box>
      </Box>
    </Container>
  );
}
