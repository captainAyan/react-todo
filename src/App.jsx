import "./App.css";
import { useState, useEffect } from "react";

export default function App() {
  const [todoList, setTodoList] = useState(
    JSON.parse(localStorage.getItem("todolist")) || []
  );
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todolist", JSON.stringify(todoList));
  }, [todoList]);

  const submit = (e) => {
    e.preventDefault();
    if (input.length !== 0) {
      setTodoList([
        ...todoList,
        { id: new Date().getTime(), text: input, done: false },
      ]);
      setInput("");
    }
  };

  const done = (id) => {
    setTodoList(
      todoList.map((task) => {
        if (task.id === id) task.done = !task.done;
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

  return (
    <main>
      <section>
        <h1>Todo List</h1>

        <form onSubmit={submit}>
          <input value={input} onChange={(e) => setInput(e.target.value)} />
          &nbsp;
          <button type="submit">✔️</button>
        </form>
        <p>[{filter.toUpperCase()}]</p>

        <nav>
          <a href="#" onClick={() => setFilter("all")}>
            All
          </a>
          &nbsp;|&nbsp;
          <a href="#" onClick={() => setFilter("completed")}>
            Completed
          </a>
          &nbsp;|&nbsp;
          <a href="#" onClick={() => setFilter("pending")}>
            Pending
          </a>
        </nav>

        {todoList.length === 0 ? <p>No tasks.</p> : null}

        <ul>
          {todoList
            .filter((task) => {
              if (filter === "completed") {
                if (task.done) return task;
              } else if (filter === "pending") {
                if (!task.done) return task;
              } else return task;
            })
            .map((task) => (
              <li key={task.id}>
                <span
                  style={task.done ? { textDecoration: "line-through" } : null}
                >
                  {task.text}
                </span>
                &nbsp;
                <button onClick={() => done(task.id)}>❌</button>
                &nbsp;
                <button onClick={() => deleteTask(task.id)}>🗑️</button>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}
