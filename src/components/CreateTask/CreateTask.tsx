import { useRef, useState } from "react";
import { CreateTaskBtn } from "../CreateTaskBtn/CreateTaskBtn";
import { addTask } from "../../services/indexedDBUtils";
import { CreateTaskPropsI } from "../../interface/CreateTaskPropsI";

import styles from "./CreateTask.module.scss";
import {
  Box,
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

export function CreateTask({ onTaskAdded }: CreateTaskPropsI) {
  const inputTitleRef = useRef<HTMLInputElement | null>(null);
  const inputDescriptionRef = useRef<HTMLInputElement | null>(null);
  const selectPriority = useRef<HTMLSelectElement | null>(null);
  const [inputValueTitle, setInputValueTitle] = useState("");
  const [inputValueDescription, setInputValueDescription] = useState("");
  const [priority, setPriority] = useState("Низкий"); // Начальное значение

  const handleChange = (event: SelectChangeEvent<string>) => {
    setPriority(event.target.value);
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

  const handleCreateTask = async () => {
    try {
      if (inputValueTitle.trim()) {
        await addTask({
          title: inputValueTitle,
          description: inputValueDescription,
          priority: priority,
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
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 300,
          maxWidth: 600,
        }}
      >
        <TextField
          type="text"
          id="task-title"
          label="Введите название задачи:"
          placeholder="Почистить зубы..."
          className={styles["task__title-input"]}
          sx={{
            input: { color: "white", border: "2px solid rgb(0, 85, 255)" },
            label: { color: "rgb(255, 255, 255)" },
          }}
          ref={inputTitleRef}
          value={inputValueTitle}
          onChange={(e) => setInputValueTitle(e.target.value)}
        />
        <TextField
          type="text"
          id="task-description"
          label="Введите описание задачи:"
          placeholder="Взять щетку..."
          sx={{
            input: { color: "white", border: "2px solid rgb(0, 85, 255)" },
            label: { color: "rgb(255, 255, 255)" },
          }}
          className={styles["task__title-input"]}
          ref={inputDescriptionRef}
          value={inputValueDescription}
          onChange={(e) => setInputValueDescription(e.target.value)}
        />
        <FormControl fullWidth sx={{ ...commonStyles }}>
          <InputLabel
            id="demo-simple-select-label"
            sx={{
              color: "white",
              "&.Mui-focused": {
                color: "white",
              },
            }}
          >
            Приоритет
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Приоритет"
            sx={{
              ...commonStyles,
              "& .MuiSelect-icon": {
                color: "white", // Белая иконка выпадающего списка
              },
            }}
            value={priority}
            ref={selectPriority}
            onChange={handleChange}
          >
            <MenuItem value="Низкий">Низкий</MenuItem>
            <MenuItem value="Средний">Средний</MenuItem>
            <MenuItem value="Высокий">Высокий</MenuItem>
          </Select>
        </FormControl>
        <CreateTaskBtn
          taskName={inputValueTitle}
          description={inputValueDescription}
          priority={priority}
          createTask={handleCreateTask}
        />
      </Box>
    </Container>
  );
}
