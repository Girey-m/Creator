import { useRef } from "react";

import styles from "./RemoveTaskBtn.module.scss";

export function RemoveTaskBtn({
  removeTaskInDb,
}: {
  removeTaskInDb: () => void;
}) {
  const removeBtnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <button
      type="button"
      className={styles["remove__btn"]}
      ref={removeBtnRef}
      onClick={() => removeTaskInDb()}
    >
      Удалить задачу
    </button>
  );
}
