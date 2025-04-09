import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { CallModalWindowI } from "../../interface/CallModalWindowI";

import styles from "./CallModalWindow.module.scss";

export function CallModalWindow({
  isVisible,
  onClose,
  initialValue,
  onSave,
}: CallModalWindowI) {
  const [value, setValue] = useState(initialValue.title);
  const [description, setDescription] = useState(initialValue.description);
  useEffect(() => {
    if (isVisible) {
      setValue(initialValue.title);
      setDescription(initialValue.description);
    }
  }, [initialValue, isVisible]);
  if (!isVisible) return null;

  const handleSave = () => {
    onSave(value, description);
    setValue("");
    setDescription("");
  };

  const handleClose = () => {
    onClose();
    setValue("");
    setDescription("");
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
