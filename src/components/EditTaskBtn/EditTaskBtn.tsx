import { useRef } from "react";
import styles from "./EditTaskBtn.module.scss";

export function EditTaskBtn({
  callModalWindow,
}: {
  callModalWindow: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <button
      type="button"
      className={styles.EditTaskBtn}
      ref={btnRef}
      onClick={() => callModalWindow()}
      disabled={!callModalWindow}
    >
      Редактировать
    </button>
  );
}
