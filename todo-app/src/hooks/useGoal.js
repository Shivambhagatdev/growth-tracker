import { useEffect, useState } from "react";
import getTodayDate from "../utils/date";

function useGoal() {

  // =========================
  // GOAL INPUT
  // =========================

  const [goalText, setGoalText] =
    useState("");


  // =========================
  // GOALS
  // =========================

  const [goals, setGoals] = useState(() => {

    const savedGoals =
      localStorage.getItem("growthGoals");

    const today =
      getTodayDate();

    if (savedGoals) {

      const parsedGoals =
        JSON.parse(savedGoals);

      return parsedGoals.map((goal) => {

        if (
          goal.completedDate !== today
        ) {

          return {

            ...goal,

            completed: false,

            completedDate: "",

          };

        }

        return goal;

      });

    }


    return [

      {
        id: 1,
        text: "Coding",
        icon: "💻",
        completed: false,
        completedDate: "",
      },

      {
        id: 2,
        text: "Study",
        icon: "📚",
        completed: false,
        completedDate: "",
      },

      {
        id: 3,
        text: "Exercise",
        icon: "🏋️",
        completed: false,
        completedDate: "",
      },

      {
        id: 4,
        text: "Reading",
        icon: "📖",
        completed: false,
        completedDate: "",
      },

    ];

  });


  // =========================
  // GOAL HISTORY
  // =========================

  const [goalHistory, setGoalHistory] =
    useState(() => {

      const savedHistory =
        localStorage.getItem(
          "growthGoalHistory"
        );

      return savedHistory
        ? JSON.parse(savedHistory)
        : {};

    });


  // =========================
  // SAVE GOALS
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "growthGoals",
      JSON.stringify(goals)
    );

  }, [goals]);


  // =========================
  // SAVE GOAL HISTORY
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "growthGoalHistory",
      JSON.stringify(goalHistory)
    );

  }, [goalHistory]);


  // =========================
  // NEW DAY HANDLING
  // =========================

  useEffect(() => {

    const checkNewDay = () => {

      const currentDate =
        getTodayDate();


      setGoals((prevGoals) => {

        let changed = false;


        const updatedGoals =
          prevGoals.map((goal) => {

            if (
              goal.completedDate !==
              currentDate
            ) {

              if (
                goal.completed ||
                goal.completedDate !== ""
              ) {

                changed = true;

              }


              return {

                ...goal,

                completed: false,

                completedDate: "",

              };

            }


            return goal;

          });


        return changed
          ? updatedGoals
          : prevGoals;

      });

    };


    checkNewDay();


    const interval =
      setInterval(
        checkNewDay,
        60 * 1000
      );


    return () => {

      clearInterval(interval);

    };

  }, []);


  // =========================
  // ADD GOAL
  // =========================

  const addGoal = (selectedIcon = "🎯") => {

    if (
      goalText.trim() === ""
    ) {

      return;

    }


    const currentDate =
      getTodayDate();


    const newGoal = {

      id: Date.now(),

      text:
        goalText.trim(),

      icon:
        selectedIcon,

      completed: false,

      completedDate: "",

    };


    setGoals((prevGoals) => {

      const newGoals = [

        ...prevGoals,

        newGoal,

      ];


      setGoalHistory(
        (prevHistory) => {

          const currentDay =
            prevHistory[currentDate] || {

              total:
                prevGoals.length,

              completed:
                prevGoals.filter(
                  (goal) =>
                    goal.completed
                ).length,

            };


          return {

            ...prevHistory,

            [currentDate]: {

              ...currentDay,

              total:
                newGoals.length,

            },

          };

        }
      );


      return newGoals;

    });


    setGoalText("");

  };


  // =========================
  // TOGGLE GOAL
  // =========================

  const toggleGoal = (id) => {

    const currentDate =
      getTodayDate();


    setGoals((prevGoals) => {

      const targetGoal =
        prevGoals.find(
          (goal) =>
            goal.id === id
        );


      if (!targetGoal) {

        return prevGoals;

      }


      const newCompleted =
        !targetGoal.completed;


      setGoalHistory(
        (prevHistory) => {

          const currentDay =
            prevHistory[currentDate] || {

              total:
                prevGoals.length,

              completed:
                prevGoals.filter(
                  (goal) =>
                    goal.completed
                ).length,

            };


          let newCompletedCount =
            currentDay.completed;


          if (newCompleted) {

            newCompletedCount =
              currentDay.completed + 1;

          } else {

            newCompletedCount =
              Math.max(
                0,
                currentDay.completed - 1
              );

          }


          return {

            ...prevHistory,

            [currentDate]: {

              total:
                currentDay.total,

              completed:
                newCompletedCount,

            },

          };

        }
      );


      return prevGoals.map((goal) => {

        if (
          goal.id === id
        ) {

          return {

            ...goal,

            completed:
              newCompleted,

            completedDate:
              newCompleted
                ? currentDate
                : "",

          };

        }


        return goal;

      });

    });

  };


  // =========================
  // DELETE GOAL
  // =========================

  const deleteGoal = (id) => {

    setGoals((prevGoals) =>

      prevGoals.filter(
        (goal) =>
          goal.id !== id
      )

    );

  };


  // =========================
  // COMPLETED GOALS
  // =========================

  const completedGoals =
    goals.filter(
      (goal) =>
        goal.completed
    ).length;


  // =========================
  // GOAL PROGRESS
  // =========================

  const goalProgress =
    goals.length === 0
      ? 0
      : Math.round(
          (completedGoals /
            goals.length) *
            100
        );


  // =========================
  // RETURN
  // =========================

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