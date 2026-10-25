
import { useEffect, useState } from "react";
import getTodayDate from "../utils/date";

const DEFAULT_GOALS = [
  { id: 1, text: "Coding", icon: "💻", completed: false, completedDate: "" },
  { id: 2, text: "Study", icon: "📚", completed: false, completedDate: "" },
  { id: 3, text: "Exercise", icon: "🏋️", completed: false, completedDate: "" },
  { id: 4, text: "Reading", icon: "📖", completed: false, completedDate: "" },
];

function useGoal() {
  const [goalText, setGoalText] = useState("");

  const [goals, setGoals] = useState(() => {
    try {
      const savedGoals = localStorage.getItem("growthGoals");

      if (!savedGoals) return DEFAULT_GOALS;

      const parsedGoals = JSON.parse(savedGoals);
      const today = getTodayDate();

      return parsedGoals.map((goal) => {
        if (goal.completedDate !== today) {
          return {
            ...goal,
            completed: false,
            completedDate: "",
          };
        }

        return goal;
      });
    } catch (error) {
      console.error("Error loading goals:", error);
      return DEFAULT_GOALS;
    }
  });

  const [goalHistory, setGoalHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem("growthGoalHistory");
      return savedHistory ? JSON.parse(savedHistory) : {};
    } catch (error) {
      console.error("Error loading goal history:", error);
      return {};
    }
  });

  // Save goals whenever they change
  useEffect(() => {
    localStorage.setItem("growthGoals", JSON.stringify(goals));
  }, [goals]);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "growthGoalHistory",
      JSON.stringify(goalHistory)
    );
  }, [goalHistory]);

  // Reset today's completion status when a new day begins
  useEffect(() => {
    const checkNewDay = () => {
      const today = getTodayDate();

      setGoals((previousGoals) => {
        const updatedGoals = previousGoals.map((goal) => {
          if (goal.completedDate !== today) {
            return {
              ...goal,
              completed: false,
              completedDate: "",
            };
          }

          return goal;
        });

        return updatedGoals;
      });
    };

    checkNewDay();

    const interval = setInterval(checkNewDay, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Add a new goal
  const addGoal = (selectedIcon = "🎯") => {
    const trimmedText = goalText.trim();

    if (!trimmedText) return;

    const today = getTodayDate();

    const newGoal = {
      id: Date.now(),
      text: trimmedText,
      icon: selectedIcon,
      completed: false,
      completedDate: "",
    };

    const updatedGoals = [...goals, newGoal];

    setGoals(updatedGoals);

    setGoalHistory((previousHistory) => {
      const previousRecord = previousHistory[today];

      return {
        ...previousHistory,
        [today]: {
          total: updatedGoals.length,
          completed: previousRecord
            ? updatedGoals.filter((goal) => goal.completed).length
            : updatedGoals.filter((goal) => goal.completed).length,
        },
      };
    });

    setGoalText("");
  };

  // Mark a goal complete or incomplete
  const toggleGoal = (id) => {
    const today = getTodayDate();

    const targetGoal = goals.find((goal) => goal.id === id);

    if (!targetGoal) return;

    const newCompleted = !targetGoal.completed;

    const updatedGoals = goals.map((goal) => {
      if (goal.id !== id) return goal;

      return {
        ...goal,
        completed: newCompleted,
        completedDate: newCompleted ? today : "",
      };
    });

    const completedCount = updatedGoals.filter(
      (goal) => goal.completed
    ).length;

    setGoals(updatedGoals);

    setGoalHistory((previousHistory) => ({
      ...previousHistory,
      [today]: {
        total: updatedGoals.length,
        completed: completedCount,
      },
    }));
  };

  // Delete a goal
  const deleteGoal = (id) => {
    const today = getTodayDate();

    const updatedGoals = goals.filter((goal) => goal.id !== id);

    setGoals(updatedGoals);

    setGoalHistory((previousHistory) => {
      const existingRecord = previousHistory[today];

      // Update today's record without deleting older history
      if (!existingRecord) {
        return previousHistory;
      }

      return {
        ...previousHistory,
        [today]: {
          total: updatedGoals.length,
          completed: updatedGoals.filter(
            (goal) => goal.completed
          ).length,
        },
      };
    });
  };

  const completedGoals = goals.filter(
    (goal) => goal.completed
  ).length;

  const goalProgress =
    goals.length === 0
      ? 0
      : Math.round((completedGoals / goals.length) * 100);

  return {
    goalText,
    setGoalText,
    goals,
    goalHistory,
    completedGoals,
    goalProgress,
    addGoal,
    toggleGoal,
    deleteGoal,
  };
}

export default useGoal;
