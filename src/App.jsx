import "./App.css";
import { useState, useEffect } from "react";

Array.prototype.isEmptyProto = function (cb) {
  return cb(this.length === 0, this);
};

export default function App() {
  const [todoList, setTodoList] = useState(
    JSON.parse(localStorage.getItem("todolist")) || []
  );
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  const [edittingTaskId, setEdittingTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem("todolist", JSON.stringify(todoList));
  }, [todoList]);

  const submit = (e) => {
    e.preventDefault();
    if (input.length !== 0) {
      setTodoList([
        ...todoList,
        {
          id: generateId(),
          text: input,
          done: false,
          creationTime: new Date().getTime(),
          completionTime: null,
        },
      ]);
      setInput("");
    }
  };

  const edit = (e) => {
    e.preventDefault();
    if (input.length !== 0) {
      setTodoList(
        todoList.map((task) => {
          if (task.id === edittingTaskId) {
            task.text = input;
          }
          return task;
        })
      );
      setInput("");
      setEdittingTaskId(null);
    }
  };

  useEffect(() => {
    if (edittingTaskId) {
      setInput(todoList.find((task) => task.id === edittingTaskId).text);
    } else {
      setInput("");
    }
  }, [edittingTaskId]);

  const done = (id) => {
    setTodoList(
      todoList.map((task) => {
        if (task.id === id) {
          task.done = !task.done;
          task.completionTime = task.done ? new Date().getTime() : null;
        }
        return task;
      })
    );
  };

  const deleteTask = (id) => {
    setTodoList(
      todoList.filter((task) => {
        if (task.id !== id) return task;
      })
    );
  };

  const moveUp = (id) => {
    const currentIndexOfTask = todoList.findIndex((task) => task.id === id);
    const newIndexOfTask =
      currentIndexOfTask === 0 ? 0 : currentIndexOfTask - 1;

    let tempTodoList = [...todoList];
    const swappedItem = tempTodoList[newIndexOfTask];
    const swappingItem = tempTodoList[currentIndexOfTask];

    // doing the swap
    tempTodoList[newIndexOfTask] = swappingItem;
    tempTodoList[currentIndexOfTask] = swappedItem;

    setTodoList([...tempTodoList]);
  };

  const moveDown = (id) => {
    const currentIndexOfTask = todoList.findIndex((task) => task.id === id);
    const newIndexOfTask =
      currentIndexOfTask === todoList.length - 1
        ? todoList.length - 1
        : currentIndexOfTask + 1;

    let tempTodoList = [...todoList];
    const swappedItem = tempTodoList[newIndexOfTask];
    const swappingItem = tempTodoList[currentIndexOfTask];

    // doing the swap
    tempTodoList[newIndexOfTask] = swappingItem;
    tempTodoList[currentIndexOfTask] = swappedItem;

    setTodoList([...tempTodoList]);
  };

  return (
    <main>
      <section>
        <h1>Todo List</h1>
        <p>
          <a target="_blank" href="https://github.com/captainAyan/react-todo">
            Github Repo
          </a>
        </p>

        <form onSubmit={(e) => (edittingTaskId ? edit(e) : submit(e))}>
          <textarea
            placeholder="Type your task here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <br />
          <button type="submit">{edittingTaskId ? "💾" : "✔️"}</button>
          &nbsp;
          {edittingTaskId && (
            <button onClick={() => setEdittingTaskId(null)}>❌</button>
          )}
        </form>

        <p>[{filter.toUpperCase()}]</p>

        <nav>
          <button href="#" onClick={() => setFilter("all")}>
            All
          </button>
          <button href="#" onClick={() => setFilter("completed")}>
            Completed
          </button>
          <button href="#" onClick={() => setFilter("pending")}>
            Pending
          </button>
        </nav>

        <table width="100%">
          <thead>
            <tr>
              <th>Id</th>
              <th>Text</th>
              <th>Creation</th>
              <th>Completion</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {todoList
              .filter((task) => {
                if (filter === "completed") {
                  if (task.done) return task;
                } else if (filter === "pending") {
                  if (!task.done) return task;
                } else return task;
              })
              .isEmptyProto((isEmpty, arr) => {
                if (isEmpty) {
                  return (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center" }}>
                        {filter === "completed" ? (
                          <b>No completed tasks.</b>
                        ) : filter === "pending" ? (
                          <b>No pending tasks.</b>
                        ) : (
                          <b>No tasks.</b>
                        )}
                      </td>
                    </tr>
                  );
                } else
                  return arr.map((task) => (
                    <tr key={task.id}>
                      <td>{task.id}</td>
                      <td>
                        <span
                          style={
                            task.done
                              ? { textDecoration: "line-through" }
                              : null
                          }
                        >
                          {task.text}
                        </span>
                      </td>

                      <td>{getDateText(task.creationTime)}</td>

                      <td>{getDateText(task.completionTime)}</td>
                      <td>
                        <button
                          title={task.done ? "Undone" : "Done"}
                          onClick={() => done(task.id)}
                        >
                          {task.done ? "️❌" : "✅"}
                        </button>
                        &nbsp;
                        <button
                          title="Delete"
                          onClick={() => deleteTask(task.id)}
                        >
                          🗑️
                        </button>
                        &nbsp;
                        <button
                          title="Edit"
                          onClick={() => setEdittingTaskId(task.id)}
                        >
                          ✒️
                        </button>
                        &nbsp;
                        <button title="Move Up" onClick={() => moveUp(task.id)}>
                          ⬆️
                        </button>
                        &nbsp;
                        <button
                          title="Move Down"
                          onClick={() => moveDown(task.id)}
                        >
                          ⬇️
                        </button>
                      </td>
                    </tr>
                  ));
              })}
          </tbody>
        </table>
      </section>
    </main>
  );
}

function getDateText(t) {
  if (!t) return "-";

  const timestamp = new Date(t);
  const day = String(timestamp.getDate()).padStart(2, "0"); // Add leading zero if needed
  const month = String(timestamp.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed (0 = January)
  const year = timestamp.getFullYear();
  const hours = String(timestamp.getHours()).padStart(2, "0");
  const minutes = String(timestamp.getMinutes()).padStart(2, "0");

  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;

  return formattedDateTime;
}

function generateId() {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz"; // characters to use in the ID
  let id = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length); // pick a random index
    id += characters[randomIndex]; // append the character at the random index
  }
  return id;
}
