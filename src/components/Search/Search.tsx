import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { TaskI } from "../../interface/TaskI";

import styles from "./Search.module.scss";

import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

export function Search({
  searchFunction,
}: {
  searchFunction: (
    searchTerm: string,
    priorityValue: string
  ) => Promise<TaskI[]>;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [searchPriority, setSearchPriority] = useState("");
  const [searchResults, setSearchResults] = useState<TaskI[]>([]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSearchPriority(event.target.value);
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

  useEffect(() => {
    const delayDebouce = setTimeout(() => {
      if (searchValue || searchValue.length > 3) {
        searchFunction(searchValue, searchPriority).then((results) => {
          setSearchResults(results);
          console.log("Результаты поиска:", results);
        });
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebouce);
  }, [searchValue, searchPriority, searchFunction]);

  return (
    <div className={styles.search}>
      <input
        type="text"
        className={styles["search__input"]}
        placeholder="Поиск задач..."
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
      />

      <FormControl fullWidth sx={{ ...commonStyles, margin: "20px 0 0 0" }}>
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
          value={searchPriority}
          onChange={handleChange}
        >
          <MenuItem value="Низкий">Низкий</MenuItem>
          <MenuItem value="Средний">Средний</MenuItem>
          <MenuItem value="Высокий">Высокий</MenuItem>
        </Select>
      </FormControl>

      <ul className={styles["search__results"]}>
        {searchResults.map((task) => (
          <li key={task.id}>
            <Link to={`/task/${task.id}`}>
              <strong className={styles.listTitle}>{task.title}</strong>
              <p className={styles.listDescription}>{task.description}</p>
              <p className={styles.listPriority}>{task.priority}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
