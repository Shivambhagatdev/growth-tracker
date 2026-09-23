import { useState } from "react";
import getTodayDate from "../utils/date";

function TodoSection({
  task,
  setTask,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  addTask,
  todayTasks,
  editingTaskId,
  editText,
  setEditText,
  startEdit,
  saveEdit,
  cancelEdit,
  toggleTask,
  deleteTask,
}) {

  const [filter, setFilter] =
    useState("All");

  const [searchText, setSearchText] =
    useState("");

  const [sortBy, setSortBy] =
    useState("newest");

  const priorityValue = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const getPriorityClass = (
    taskPriority
  ) => {

    if (
      taskPriority === "High"
    ) {

      return "priority-high";

    }

    if (
      taskPriority === "Low"
    ) {

      return "priority-low";

    }

    return "priority-medium";

  };

  const getDueDateStatus = (taskItem) => {

    if (!taskItem.dueDate) {
      return "";
    }

    if (taskItem.completed) {
      return "completed";
    }

    const today =
      getTodayDate();

    if (
      taskItem.dueDate < today
    ) {

      return "overdue";

    }

    if (
      taskItem.dueDate === today
    ) {

      return "today";

    }

    return "upcoming";

  };

  const formatDueDate = (date) => {

    if (!date) {
      return "";
    }

    const dateObject =
      new Date(
        date + "T00:00:00"
      );

    return dateObject.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  };

  const filteredTasks =
    todayTasks.filter((item) => {

      const taskPriority =
        item.priority || "Medium";

      const matchesPriority =
        filter === "All" ||
        taskPriority === filter;

      const matchesSearch =
        item.text
          .toLowerCase()
          .includes(
            searchText
              .toLowerCase()
              .trim()
          );

      return (
        matchesPriority &&
        matchesSearch
      );

    });

  const sortedTasks =
    [...filteredTasks].sort(
      (a, b) => {

        if (
          sortBy === "newest"
        ) {

          return b.id - a.id;

        }

        if (
          sortBy === "oldest"
        ) {

          return a.id - b.id;

        }

        if (
          sortBy === "high"
        ) {

          return (
            (priorityValue[
              b.priority || "Medium"
            ] || 0) -
            (priorityValue[
              a.priority || "Medium"
            ] || 0)
          );

        }

        if (
          sortBy === "medium"
        ) {

          const aPriority =
            a.priority || "Medium";

          const bPriority =
            b.priority || "Medium";

          if (
            aPriority === "Medium" &&
            bPriority !== "Medium"
          ) {

            return -1;

          }

          if (
            bPriority === "Medium" &&
            aPriority !== "Medium"
          ) {

            return 1;

          }

          return b.id - a.id;

        }

        if (
          sortBy === "low"
        ) {

          return (
            (priorityValue[
              a.priority || "Medium"
            ] || 0) -
            (priorityValue[
              b.priority || "Medium"
            ] || 0)
          );

        }

        if (
          sortBy === "completed"
        ) {

          return (
            Number(b.completed) -
            Number(a.completed)
          );

        }

        if (
          sortBy === "pending"
        ) {

          return (
            Number(a.completed) -
            Number(b.completed)
          );

        }

        return 0;

      }
    );

  return (
    <section className="todo-section">

      <h2>Today's Tasks</h2>

      <div className="todo-input">

        <input
          type="text"
          placeholder="Enter a new task..."
          value={task}
          onChange={(e) =>
            setTask(e.target.value)
          }
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              addTask();

            }

          }}
        />

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
          className="priority-select"
        >

          <option value="High">
            🔴 High
          </option>

          <option value="Medium">
            🟡 Medium
          </option>

          <option value="Low">
            🟢 Low
          </option>

        </select>

        <input
          type="date"
          value={dueDate}
          min={getTodayDate()}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
          className="due-date-input"
        />

        <button
          onClick={addTask}
        >
          Add Task
        </button>

      </div>

      <div className="task-search">

        <input
          type="text"
          placeholder="🔎 Search tasks..."
          value={searchText}
          onChange={(e) =>
            setSearchText(
              e.target.value
            )
          }
        />

        {searchText && (

          <button
            className="clear-search"
            onClick={() =>
              setSearchText("")
            }
          >
            ✕
          </button>

        )}

      </div>

      <div className="task-controls">

        <div className="priority-filters">

          <button
            className={
              filter === "All"
                ? "filter-btn active"
                : "filter-btn"
            }
            onClick={() =>
              setFilter("All")
            }
          >
            All
          </button>

          <button
            className={
              filter === "High"
                ? "filter-btn active"
                : "filter-btn"
            }
            onClick={() =>
              setFilter("High")
            }
          >
            🔴 High
          </button>

          <button
            className={
              filter === "Medium"
                ? "filter-btn active"
                : "filter-btn"
            }
            onClick={() =>
              setFilter("Medium")
            }
          >
            🟡 Medium
          </button>

          <button
            className={
              filter === "Low"
                ? "filter-btn active"
                : "filter-btn"
            }
            onClick={() =>
              setFilter("Low")
            }
          >
            🟢 Low
          </button>

        </div>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
        >

          <option value="newest">
            🆕 Newest First
          </option>

          <option value="oldest">
            🕐 Oldest First
          </option>

          <option value="high">
            🔴 High Priority
          </option>

          <option value="medium">
            🟡 Medium Priority
          </option>

          <option value="low">
            🟢 Low Priority
          </option>

          <option value="completed">
            ✅ Completed First
          </option>

          <option value="pending">
            ⏳ Pending First
          </option>

        </select>

      </div>

      <div className="todo-list">

        {sortedTasks.length === 0 ? (

          <p>

            {todayTasks.length === 0

              ? "No tasks added today."

              : searchText

              ? "No tasks found for your search."

              : "No tasks found for this filter."

            }

          </p>

        ) : (

          sortedTasks.map((item) => {

            const dueStatus =
              getDueDateStatus(item);

            return (

              <div
                className="todo-item"
                key={item.id}
              >

                {editingTaskId === item.id ? (

                  <div className="edit-container">

                    <input
                      type="text"
                      value={editText}
                      onChange={(e) =>
                        setEditText(
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {

                        if (e.key === "Enter") {

                          saveEdit(item.id);

                        }

                      }}
                    />

                    <button
                      onClick={() =>
                        saveEdit(item.id)
                      }
                    >
                      Save
                    </button>

                    <button
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>

                  </div>

                ) : (

                  <>

                    <div className="task-content">

                      <input
                        type="checkbox"
                        checked={
                          item.completed
                        }
                        onChange={() =>
                          toggleTask(item.id)
                        }
                      />

                      <div className="task-info">

                        <span
                          className={
                            item.completed
                              ? "completed-task"
                              : ""
                          }
                        >
                          {item.text}
                        </span>

                        {item.dueDate && (

                          <small
                            className={
                              `due-date ${dueStatus}`
                            }
                          >

                            {dueStatus === "overdue"
                              ? "⚠️ Overdue: "
                              : dueStatus === "today"
                              ? "📅 Due Today: "
                              : "📅 Due: "
                            }

                            {formatDueDate(
                              item.dueDate
                            )}

                          </small>

                        )}

                      </div>

                    </div>

                    <span
                      className={
                        `priority-badge ${
                          getPriorityClass(
                            item.priority ||
                            "Medium"
                          )
                        }`
                      }
                    >
                      {item.priority ||
                        "Medium"}
                    </span>

                    <div className="task-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          startEdit(item)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteTask(item.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </>

                )}

              </div>

            );

          })

        )}

      </div>

    </section>
  );
}

export default TodoSection;