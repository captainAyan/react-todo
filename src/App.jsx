import "./App.css";
import { useState, useEffect } from "react";

Array.prototype.isEmptyProto = function (cb) {
  return cb(this.length === 0, this);
};

Array.prototype.conditionalReversal = function (condition) {
  return condition ? this.reverse() : this;
};

export default function App() {
  const [todoList, setTodoList] = useState(
    JSON.parse(localStorage.getItem("todolist")) || []
  );
  const [isReversed, setIsReversed] = useState(
    localStorage.getItem("isReversed") === "true"
  );

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  const [edittingTaskId, setEdittingTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem("todolist", JSON.stringify(todoList));
    localStorage.setItem("isReversed", isReversed);
  }, [todoList, isReversed]);

  const addSubmit = (e) => {
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

  const editSubmit = (e, id, newText) => {
    e.preventDefault();
    if (newText.length !== 0) {
      edit(id, newText);
      setEdittingTaskId(null);
    }
  };

  const edit = (id, newText) => {
    setTodoList(
      todoList.map((task) => {
        if (task.id === id) {
          task.text = newText;
        }
        return task;
      })
    );
  };

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

  const handleReversalCheckboxChange = () => {
    setIsReversed((prevState) => !prevState);
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

        <form onSubmit={(e) => addSubmit(e)}>
          <textarea
            placeholder="Type your task here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="create"
          />
          <br />
          <button type="submit">💾</button>
        </form>

        <p>[{filter.toUpperCase()}]</p>
        <p>
          <progress
            value={todoList.filter((t) => t.done).length}
            max={todoList.length}
          />
        </p>

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

          <label>
            <input
              type="checkbox"
              checked={isReversed}
              onChange={handleReversalCheckboxChange}
            />
            Reverse
          </label>
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
              .conditionalReversal(isReversed)
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
                      <td className="task_text">
                        <span
                          style={
                            task.done
                              ? { textDecoration: "line-through" }
                              : null
                          }
                        >
                          {edittingTaskId === task.id ? (
                            <TaskTextEdit
                              taskId={task.id}
                              taskText={task.text}
                              editSubmit={editSubmit}
                              setEdittingTaskId={setEdittingTaskId}
                            />
                          ) : (
                            <TaskText
                              taskId={task.id}
                              lines={extractLines(task.text)}
                              edit={edit}
                            />
                          )}
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
                        {task.done ? (
                          <button
                            title="Delete"
                            onClick={() => deleteTask(task.id)}
                          >
                            🗑️
                          </button>
                        ) : (
                          <button
                            title="Edit"
                            onClick={() => setEdittingTaskId(task.id)}
                          >
                            ✒️
                          </button>
                        )}
                        <button
                          title="Move Up"
                          onClick={() =>
                            isReversed ? moveDown(task.id) : moveUp(task.id)
                          }
                        >
                          ⬆️
                        </button>
                        <button
                          title="Move Down"
                          onClick={() =>
                            isReversed ? moveUp(task.id) : moveDown(task.id)
                          }
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

function TaskText({ taskId, lines, edit }) {
  const setIsDone = (index) => {
    lines[index].isDone = !lines[index].isDone;

    let taskTextBuffer = "";
    lines.forEach((line, i) => {
      if (line.isSubTask) {
        if (line.isDone) taskTextBuffer += "[x]";
        else taskTextBuffer += "[]";
        taskTextBuffer += line.text;
      } else taskTextBuffer += line.text;

      if (i + 1 !== lines.length) taskTextBuffer += "\n";
    });
    edit(taskId, taskTextBuffer);
  };

  return lines.map((line, i) =>
    line.isSubTask ? (
      <span key={i}>
        <input
          type="checkbox"
          checked={line.isDone}
          onChange={() => setIsDone(i)}
        />
        <span style={line.isDone ? { textDecoration: "line-through" } : null}>
          {line.text}
        </span>
        <br />
      </span>
    ) : (
      <span key={i}>
        {line.text}
        <br />
      </span>
    )
  );
}

function extractLines(taskText) {
  const lines = taskText.split("\n");

  const result = lines.map((line) => {
    const isSubTask = /^\[\s?x?\s?\]/.test(line);
    const isDone = /^\[\s?x\s?\]/.test(line);

    return {
      text: line.replace(/^\[\s?x?\s?\]/, ""),
      isDone,
      isSubTask,
    };
  });

  return result;
}

function TaskTextEdit({ taskId, taskText, editSubmit, setEdittingTaskId }) {
  const [newTaskText, setNewTaskText] = useState(taskText);

  return (
    <>
      <form onSubmit={(e) => editSubmit(e, taskId, newTaskText)}>
        <textarea
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          rows={newTaskText.split("\n").length}
          className="edit"
        />
        <button type="submit">✔️</button>
        &nbsp;
        <button type="button" onClick={() => setEdittingTaskId(null)}>
          ❌
        </button>
      </form>
    </>
  );
}
