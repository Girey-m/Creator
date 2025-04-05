import { useState } from "react";
import { createPortal } from "react-dom";

import { CallModalWindowInterface } from "../../interface/CallModalWindowInterface";

import styles from "./CallModalWindow.module.scss";

export function CallModalWindow({
  isVisible,
  onClose,
  initialValue,
  onSave,
}: CallModalWindowInterface) {
  const [value, setValue] = useState(initialValue);

  if (!isVisible) return null;

  const handleSave = () => {
    onSave(value);
    setValue("");
  };

  const handleClose = () => {
    onClose();
    setValue("");
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
