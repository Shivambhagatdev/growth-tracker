import { useEffect, useState } from "react";

import Header from "./components/Header";
import Stats from "./components/Stats";
import Productivity from "./components/Productivity";
import TodoSection from "./components/TodoSection";
import GoalsSection from "./components/GoalsSection";
import WeeklyGrowth from "./components/WeeklyGrowth";
import PerformanceSummary from "./components/PerformanceSummary";
import TaskHistory from "./components/TaskHistory";
import Analytics from "./components/Analytics";
import Backup from "./components/Backup";

import useTasks from "./hooks/useTasks";
import useGoal from "./hooks/useGoal";
import useTracker from "./hooks/useTracker";

function App() {

  const [darkMode, setDarkMode] =
    useState(() => {

      const savedTheme =
        localStorage.getItem("darkMode");

      return savedTheme === "true";

    });

  const {
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

  } = useTasks();

  const {
    goalText,
    setGoalText,

    goals,

    goalHistory,

    completedGoals,
    goalProgress,

    addGoal,
    toggleGoal,
    deleteGoal,

  } = useGoal();

  const {
    todayTasks,
    completedTasks,
    progress,
    weeklyData,
    taskHistory,
    monthlyStats,

  } = useTracker(
    tasks,
    goals,
    goalHistory
  );

  useEffect(() => {

    localStorage.setItem(
      "darkMode",
      darkMode
    );

  }, [darkMode]);

  const overallProgress =
    Math.round(
      (progress +
        goalProgress) /
        2
    );

  return (

    <div
      className={
        darkMode
          ? "app dark"
          : "app"
      }
    >

      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <Stats

        todayTasks={
          todayTasks
        }

        completedTasks={
          completedTasks
        }

        progress={
          overallProgress
        }

        streak={
          streak
        }

        completedGoals={
          completedGoals
        }

        goalProgress={
          goalProgress
        }

        goals={
          goals
        }

      />

      <Productivity
        productivityScore={
          overallProgress
        }
      />

      <main className="main">

        <TodoSection

          task={
            task
          }

          setTask={
            setTask
          }

          priority={
            priority
          }

          setPriority={
            setPriority
          }

          dueDate={
            dueDate
          }

          setDueDate={
            setDueDate
          }

          addTask={
            addTask
          }

          todayTasks={
            todayTasks
          }

          editingTaskId={
            editingTaskId
          }

          editText={
            editText
          }

          setEditText={
            setEditText
          }

          startEdit={
            startEdit
          }

          saveEdit={
            saveEdit
          }

          cancelEdit={
            cancelEdit
          }

          toggleTask={
            toggleTask
          }

          deleteTask={
            deleteTask
          }

        />

        <GoalsSection

          goals={
            goals
          }

          completedGoals={
            completedGoals
          }

          goalProgress={
            goalProgress
          }

          goalText={
            goalText
          }

          setGoalText={
            setGoalText
          }

          addGoal={
            addGoal
          }

          toggleGoal={
            toggleGoal
          }

          deleteGoal={
            deleteGoal
          }

        />

      </main>

      <WeeklyGrowth
        weeklyData={
          weeklyData
        }
      />

      <Analytics
        weeklyData={
          weeklyData
        }

        monthlyStats={
          monthlyStats
        }
      />

      <PerformanceSummary
        monthlyStats={
          monthlyStats
        }
      />

      <TaskHistory
        taskHistory={
          taskHistory
        }
      />

      <Backup

        tasks={
          tasks
        }

        goals={
          goals
        }

        goalHistory={
          goalHistory
        }

        streak={
          streak
        }

      />

    </div>

  );

}

export default App;