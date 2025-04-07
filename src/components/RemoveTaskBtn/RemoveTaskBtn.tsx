import { useRef } from "react";

import styles from "./RemoveTaskBtn.module.scss";
import { Button } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export function RemoveTaskBtn({
  removeTaskInDb,
}: {
  removeTaskInDb: () => void;
}) {
  const removeBtnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Button
      type="button"
      className={styles["remove__btn"]}
      ref={removeBtnRef}
      onClick={() => removeTaskInDb()}
      variant="contained"
      color="primary"
      sx={{ width: "40px", height: "40px" }}
      startIcon={<HighlightOffIcon />}
      aria-label="Удалить задачу"
    >
    </Button>
  );
}
