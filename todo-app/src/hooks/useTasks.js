import { useEffect, useState } from "react";
import getTodayDate from "../utils/date";

function useTasks() {

  const [task, setTask] = useState("");

  const [priority, setPriority] =
    useState("Medium");

  const [dueDate, setDueDate] =
    useState(getTodayDate());

  const [tasks, setTasks] = useState(() => {

    const savedTasks =
      localStorage.getItem("growthTasks");

    return savedTasks
      ? JSON.parse(savedTasks)
      : [];

  });

  const [editingTaskId, setEditingTaskId] =
    useState(null);

  const [editText, setEditText] =
    useState("");

  const [streak, setStreak] = useState(() => {

    const savedStreak =
      localStorage.getItem("growthStreak");

    return savedStreak
      ? Number(savedStreak)
      : 0;

  });

  const [
    lastCompletedDate,
    setLastCompletedDate
  ] = useState(() => {

    return (
      localStorage.getItem(
        "lastCompletedDate"
      ) || ""
    );

  });

  useEffect(() => {

    localStorage.setItem(
      "growthTasks",
      JSON.stringify(tasks)
    );

  }, [tasks]);

  useEffect(() => {

    localStorage.setItem(
      "growthStreak",
      streak
    );

    localStorage.setItem(
      "lastCompletedDate",
      lastCompletedDate
    );

  }, [
    streak,
    lastCompletedDate
  ]);

  const addTask = () => {

    if (task.trim() === "") {
      return;
    }

    const newTask = {

      id: Date.now(),

      text: task.trim(),

      completed: false,

      date: getTodayDate(),

      priority: priority,

      dueDate: dueDate,

    };

    setTasks((prevTasks) => [

      ...prevTasks,

      newTask

    ]);

    setTask("");

    setPriority("Medium");

    setDueDate(getTodayDate());

  };

  const updateStreak = () => {

    const today =
      getTodayDate();

    if (
      lastCompletedDate === today
    ) {

      return;

    }

    if (
      lastCompletedDate === ""
    ) {

      setStreak(1);

      setLastCompletedDate(today);

      return;

    }

    const lastDate =
      new Date(
        lastCompletedDate +
        "T00:00:00"
      );

    const currentDate =
      new Date(
        today +
        "T00:00:00"
      );

    const difference =
      currentDate - lastDate;

    const oneDay =
      1000 *
      60 *
      60 *
      24;

    const daysDifference =
      Math.round(
        difference / oneDay
      );

    if (
      daysDifference === 1
    ) {

      setStreak(
        (prevStreak) =>
          prevStreak + 1
      );

    } else {

      setStreak(1);

    }

    setLastCompletedDate(today);

  };

  const toggleTask = (id) => {

    setTasks((prevTasks) =>

      prevTasks.map((item) => {

        if (
          item.id === id
        ) {

          const newCompleted =
            !item.completed;

          if (
            newCompleted
          ) {

            updateStreak();

          }

          return {

            ...item,

            completed:
              newCompleted,

          };

        }

        return item;

      })

    );

  };

  const deleteTask = (id) => {

    setTasks((prevTasks) =>

      prevTasks.filter(
        (item) =>
          item.id !== id
      )

    );

  };

  const startEdit = (item) => {

    setEditingTaskId(
      item.id
    );

    setEditText(
      item.text
    );

  };

  const saveEdit = (id) => {

    if (
      editText.trim() === ""
    ) {

      return;

    }

    setTasks((prevTasks) =>

      prevTasks.map((item) => {

        if (
          item.id === id
        ) {

          return {

            ...item,

            text:
              editText.trim(),

          };

        }

        return item;

      })

    );

    setEditingTaskId(null);

    setEditText("");

  };

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