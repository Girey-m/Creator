import { TaskI } from "../interface/TaskI";

const DB_NAME = "TasksDB";
const DB_VERSION = 1;
const STORE_NAME = "Tasks";

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result as IDBDatabase);
    };

    request.onerror = () => {
      reject("Ошибка при открытии базы данных");
    };
  });
}

export function addTask(task: { title: string }): Promise<number> {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(task);

        request.onsuccess = () => resolve(request.result as number);
        request.onerror = () => reject("Ошибка при добавлении задачи");
      })
      .catch(reject);
  });
}

export function fetchAllTask(): Promise<TaskI[]> {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result as TaskI[]);
        };

        request.onerror = () => {
          reject("Ошибка при получении задач");
        };
      })
      .catch(reject);
  });
}

export async function updateTask(updatedTask: TaskI): Promise<void> {
  openDB();
  try {
    const db = await openDB();

    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.put(updatedTask);

      request.onsuccess = () => resolve();
      request.onerror = () => reject("Ошибка при обновления задачи");
    });

    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject("Ошибка при выполнении транзакции");
    });
  } catch (error) {
    console.error("Ошибка при обновлении задачи", error);
    throw new Error("Не удалось выполнить задачу");
  }
}
