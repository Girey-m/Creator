import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { CallModalWindowI } from "../../interface/CallModalWindowI";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

import styles from "./CallModalWindow.module.scss";

export function CallModalWindow({
  isVisible,
  onClose,
  initialValue,
  onSave,
}: CallModalWindowI) {
  const [value, setValue] = useState(initialValue.title);
  const [description, setDescription] = useState(initialValue.description);
  const [priority, setPriority] = useState(initialValue.priority);
  useEffect(() => {
    if (isVisible) {
      setValue(initialValue.title);
      setDescription(initialValue.description);
      setPriority(initialValue.priority);
    }
  }, [initialValue, isVisible]);
  if (!isVisible) return null;

  const handleSave = () => {
    onSave(value, description, priority);
    setValue("");
    setDescription("");
    setPriority("");
  };

  const handleClose = () => {
    onClose();
    setValue("");
    setDescription("");
    setPriority("");
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    setPriority(event.target.value);
  };

  const commonStyles = {
    color: "black",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(0, 85, 255)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(0, 85, 255)",
    },
    "& .MuiSvgIcon-root": {
      color: "black",
    },
  };

  return createPortal(
    <div className={styles["modal"]}>
      <input
        type="text"
        className={styles["modal__input-title"]}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Введите новое значение"
      />
      <input
        type="text"
        className={styles["modal__input-description"]}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Введите новое значение"
      />
      <FormControl fullWidth sx={{ ...commonStyles }}>
        <InputLabel
          id="demo-simple-select-label"
          sx={{
            color: "black",
            "&.Mui-focused": {
              color: "black",
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
              color: "black", // Белая иконка выпадающего списка
            },
          }}
          value={priority}
          onChange={handleChange}
        >
          <MenuItem value="Низкий">Низкий</MenuItem>
          <MenuItem value="Средний">Средний</MenuItem>
          <MenuItem value="Высокий">Высокий</MenuItem>
        </Select>
      </FormControl>
      <button className={styles["modal__save-btn"]} onClick={handleSave}>
        Сохранить
      </button>
      <button className={styles["modal__close-btn"]} onClick={handleClose}>
        Закрыть
      </button>
    </div>,
    document.body
  );
}
