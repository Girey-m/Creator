import { useState, useEffect } from "react";

import { TaskI } from "../../interface/TaskI";

import styles from "./Search.module.scss";

export function Search({
  searchFunction,
}: {
  searchFunction: (searchTerm: string) => Promise<TaskI[]>;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<TaskI[]>([]);

  useEffect(() => {
    const delayDebouce = setTimeout(() => {
      if (searchValue || searchValue.length > 3) {
        searchFunction(searchValue).then((results) => {
          setSearchResults(results);
          console.log("Результаты поиска:", results);
        });
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebouce);
  }, [searchValue, searchFunction]);

  return (
    <div className={styles.search}>
      <input
        type="text"
        className={styles["search__input"]}
        placeholder="Поиск задач..."
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
      />

      <ul className={styles["search__results"]}>
        {searchResults.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong>: {task.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
