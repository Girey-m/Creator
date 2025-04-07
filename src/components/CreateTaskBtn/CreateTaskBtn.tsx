import { useRef } from "react";
import "./CreateTaskBtn.module.scss";
import { Button } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';

export function CreateTaskBtn({
  taskName,
  description,
  createTask,
  iconSize
}: {
  taskName: string;
  description: string;
  createTask: (taskName: string, description: string) => Promise<void>;
  iconSize?: number
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  return (
    <Button
      type="button"
      ref={btnRef}
      onClick={() => createTask(taskName, description)}
      variant="contained"
      color="secondary"
      startIcon={<AddBoxIcon sx={{ fontSize: 60, transform: `scale(1 * ${iconSize})`, }} />}
      sx={{
        height: '50px',
        fontSize: '16px',
        backgroundColor: '#ff6f61',
        '&:hover': {
          backgroundColor: '#ff3d00',
        },
      }}
      aria-label="Создать задачу"
    >
    </Button>
  );
}
