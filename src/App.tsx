import "./App.css";
import { CreateTask } from "./components/CreateTask/CreateTask";
import { GetAllTask } from "./components/GetAllTask/GetAllTask";

function App() {
  return (
    <>
      <CreateTask />
      <GetAllTask />
    </>
  );
}

export default App;
