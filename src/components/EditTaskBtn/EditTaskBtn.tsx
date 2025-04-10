import { useRef } from "react";
import styles from "./EditTaskBtn.module.scss";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export function EditTaskBtn({
  callModalWindow,
  iconSize,
}: {
  callModalWindow: () => void;
  iconSize: number;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Button
      type="button"
      className={styles.EditTaskBtn}
      ref={btnRef}
      onClick={() => callModalWindow()}
      disabled={!callModalWindow}
      variant="contained"
      color="primary"
      sx={{ width: "40px", height: "40px" }}
      startIcon={<EditIcon sx={{ transform: `scale(${iconSize})` }} />}
      aria-label="Редактировать задачу"
    ></Button>
  );
}
