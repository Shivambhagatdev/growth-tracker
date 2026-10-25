
import { useEffect, useState } from "react";
import getTodayDate from "../utils/date";

function useTasks() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(getTodayDate());

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("growthTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editText, setEditText] = useState("");

  const [streak, setStreak] = useState(() => {
    const savedStreak = localStorage.getItem("growthStreak");
    return savedStreak ? Number(savedStreak) : 0;
  });

  const [lastCompletedDate, setLastCompletedDate] = useState(
    () => localStorage.getItem("lastCompletedDate") || ""
  );

  // Save tasks whenever they change.
  useEffect(() => {
    localStorage.setItem("growthTasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save streak information.
  useEffect(() => {
    localStorage.setItem("growthStreak", String(streak));
    localStorage.setItem("lastCompletedDate", lastCompletedDate);
  }, [streak, lastCompletedDate]);

  // Move unfinished tasks to the current day without changing
  // their original creation date or historical completion date.
  useEffect(() => {
    const checkNewDay = () => {
      const currentDate = getTodayDate();

      setTasks((previousTasks) => {
        let changed = false;

        const updatedTasks = previousTasks.map((item) => {
          // Backfill historical metadata for tasks created before this update.
          const createdDate = item.createdDate || item.date;

          const normalizedItem = {
            ...item,
            createdDate,
            completedDate:
              item.completedDate ??
              (item.completed ? item.date : null),
          };

          // Completed tasks should remain in their historical date.
          if (normalizedItem.completed) {
            if (
              normalizedItem.createdDate !== item.createdDate ||
              normalizedItem.completedDate !== item.completedDate
            ) {
              changed = true;
              return normalizedItem;
            }

            return item;
          }

          // An incomplete task already assigned to today needs no change.
          if (normalizedItem.date === currentDate) {
            if (
              normalizedItem.createdDate !== item.createdDate ||
              normalizedItem.completedDate !== item.completedDate
            ) {
              changed = true;
              return normalizedItem;
            }

            return item;
          }

          changed = true;

          return {
            ...normalizedItem,
            date: currentDate,
            dueDate:
              normalizedItem.dueDate &&
              normalizedItem.dueDate >= currentDate
                ? normalizedItem.dueDate
                : currentDate,
          };
        });

        return changed ? updatedTasks : previousTasks;
      });

      // Refresh the default due date for newly added tasks.
      setDueDate((previousDate) =>
        previousDate < currentDate ? currentDate : previousDate
      );
    };

    checkNewDay();

    const interval = setInterval(checkNewDay, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Add a new task.
  const addTask = () => {
    if (!task.trim()) return;

    const today = getTodayDate();

    const newTask = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
      date: today,
      createdDate: today,
      completedDate: null,
      priority,
      dueDate: dueDate || today,
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);

    setTask("");
    setPriority("Medium");
    setDueDate(today);
  };

  // Update the daily streak when a task is completed.
  const updateStreak = () => {
    const today = getTodayDate();

    if (lastCompletedDate === today) return;

    if (!lastCompletedDate) {
      setStreak(1);
      setLastCompletedDate(today);
      return;
    }

    const lastDate = new Date(`${lastCompletedDate}T00:00:00`);
    const currentDate = new Date(`${today}T00:00:00`);
    const difference = currentDate - lastDate;
    const daysDifference = Math.round(
      difference / (1000 * 60 * 60 * 24)
    );

    setStreak((previousStreak) =>
      daysDifference === 1 ? previousStreak + 1 : 1
    );

    setLastCompletedDate(today);
  };

  // Complete or reopen a task.
  const toggleTask = (id) => {
    const today = getTodayDate();

    setTasks((previousTasks) =>
      previousTasks.map((item) => {
        if (item.id !== id) return item;

        const newCompleted = !item.completed;

        if (newCompleted) {
          updateStreak();
        }

        return {
          ...item,
          createdDate: item.createdDate || item.date,
          completed: newCompleted,
          completedDate: newCompleted ? today : null,
        };
      })
    );
  };

  // Delete a task.
  const deleteTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.filter((item) => item.id !== id)
    );
  };

  // Start editing.
  const startEdit = (item) => {
    setEditingTaskId(item.id);
    setEditText(item.text);
  };

  // Save edited text.
  const saveEdit = (id) => {
    if (!editText.trim()) return;

    setTasks((previousTasks) =>
      previousTasks.map((item) =>
        item.id === id
          ? { ...item, text: editText.trim() }
          : item
      )
    );

    setEditingTaskId(null);
    setEditText("");
  };

  // Cancel editing.
  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditText("");
  };

  return {
    task,
    setTask,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    tasks,
    editingTaskId,
    editText,
    setEditText,
    streak,
    addTask,
    toggleTask,
    deleteTask,
    startEdit,
    saveEdit,
    cancelEdit,
  };
}

export default useTasks;
