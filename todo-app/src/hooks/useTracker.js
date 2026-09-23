import getTodayDate from "../utils/date";

function useTracker(tasks, goals, goalHistory) {

  const today =
    getTodayDate();


  // =========================
  // TODAY'S TASKS
  // =========================

  const todayTasks =
    tasks.filter(
      (item) =>
        item.date === today
    );


  const completedTasks =
    todayTasks.filter(
      (item) =>
        item.completed
    ).length;


  const progress =
    todayTasks.length === 0
      ? 0
      : Math.round(
          (completedTasks /
            todayTasks.length) *
            100
        );


  // =========================
  // WEEKLY DATA
  // =========================

  const getWeekData = () => {

    const currentDate =
      new Date();

    const day =
      currentDate.getDay();


    const mondayOffset =
      day === 0
        ? -6
        : 1 - day;


    const monday =
      new Date(currentDate);


    monday.setDate(
      currentDate.getDate() +
        mondayOffset
    );


    const week = [];


    for (
      let i = 0;
      i < 7;
      i++
    ) {

      const date =
        new Date(monday);


      date.setDate(
        monday.getDate() +
          i
      );


      const year =
        date.getFullYear();


      const month =
        String(
          date.getMonth() + 1
        ).padStart(2, "0");


      const dayNumber =
        String(
          date.getDate()
        ).padStart(2, "0");


      const dateString =
        `${year}-${month}-${dayNumber}`;


      // =========================
      // TASK DATA
      // =========================

      const dayTasks =
        tasks.filter(
          (item) =>
            item.date ===
            dateString
        );


      const completedTaskCount =
        dayTasks.filter(
          (item) =>
            item.completed
        ).length;


      const taskProgress =
        dayTasks.length === 0
          ? 0
          : Math.round(
              (completedTaskCount /
                dayTasks.length) *
                100
            );


      // =========================
      // GOAL HISTORY
      // =========================

      const history =
        goalHistory[dateString];


      let totalGoals = 0;

      let completedGoalCount = 0;


      if (history) {

        totalGoals =
          history.total || 0;

        completedGoalCount =
          history.completed || 0;

      }


      // =========================
      // TODAY'S LIVE GOALS
      // =========================

      if (
        dateString === today
      ) {

        totalGoals =
          goals.length;


        completedGoalCount =
          goals.filter(
            (goal) =>
              goal.completed
          ).length;

      }


      // =========================
      // GOAL PROGRESS
      // =========================

      const goalProgress =
        totalGoals === 0
          ? 0
          : Math.round(
              (completedGoalCount /
                totalGoals) *
                100
            );


      // =========================
      // OVERALL PROGRESS
      // =========================

      let overallProgress = 0;


      if (
        dayTasks.length > 0 &&
        totalGoals > 0
      ) {

        overallProgress =
          Math.round(
            (taskProgress +
              goalProgress) /
              2
          );

      }

      else if (
        dayTasks.length > 0
      ) {

        overallProgress =
          taskProgress;

      }

      else if (
        totalGoals > 0
      ) {

        overallProgress =
          goalProgress;

      }


      // =========================
      // TOTAL ACTIVITIES
      // =========================

      const totalCompleted =
        completedTaskCount +
        completedGoalCount;


      const totalActivities =
        dayTasks.length +
        totalGoals;


      week.push({

        date:
          dateString,

        day:
          date.toLocaleDateString(
            "en-US",
            {
              weekday: "short",
            }
          ),

        progress:
          overallProgress,

        total:
          totalActivities,

        completed:
          totalCompleted,

      });

    }


    return week;

  };


  const weeklyData =
    getWeekData();


  // =========================
  // ACTIVITY HISTORY
  // =========================

  const getTaskHistory = () => {

    const history = {};


    // =========================
    // TASK HISTORY
    // =========================

    tasks.forEach((item) => {

      if (
        !history[item.date]
      ) {

        history[item.date] = {

          tasksTotal: 0,

          tasksCompleted: 0,

          goalsTotal: 0,

          goalsCompleted: 0,

        };

      }


      history[item.date]
        .tasksTotal++;


      if (
        item.completed
      ) {

        history[item.date]
          .tasksCompleted++;

      }

    });


    // =========================
    // GOAL HISTORY
    // =========================

    Object.entries(
      goalHistory
    ).forEach(
      ([date, data]) => {

        if (
          !history[date]
        ) {

          history[date] = {

            tasksTotal: 0,

            tasksCompleted: 0,

            goalsTotal: 0,

            goalsCompleted: 0,

          };

        }


        history[date]
          .goalsTotal =
            data.total || 0;


        history[date]
          .goalsCompleted =
            data.completed || 0;

      }
    );


    return Object.entries(history)

      .sort((a, b) =>
        b[0].localeCompare(a[0])
      )

      .slice(0, 7);

  };


  const taskHistory =
    getTaskHistory();


  // =========================
  // MONTHLY STATISTICS
  // =========================

  const getMonthlyStats = () => {

    const currentDate =
      new Date();


    const currentYear =
      currentDate.getFullYear();


    const currentMonth =
      currentDate.getMonth();


    // =========================
    // MONTH'S TASKS
    // =========================

    const monthlyTasks =
      tasks.filter((task) => {

        const taskDate =
          new Date(
            task.date + "T00:00:00"
          );


        return (
          taskDate.getFullYear() ===
            currentYear &&
          taskDate.getMonth() ===
            currentMonth
        );

      });


    const totalTasks =
      monthlyTasks.length;


    const completedMonthlyTasks =
      monthlyTasks.filter(
        (task) =>
          task.completed
      ).length;


    // =========================
    // MONTH'S GOALS
    // =========================

    let totalGoals = 0;

    let completedGoals = 0;


    Object.entries(
      goalHistory
    ).forEach(
      ([date, data]) => {

        const historyDate =
          new Date(
            date + "T00:00:00"
          );


        if (
          historyDate.getFullYear() ===
            currentYear &&
          historyDate.getMonth() ===
            currentMonth
        ) {

          totalGoals +=
            data.total || 0;


          completedGoals +=
            data.completed || 0;

        }

      }
    );


    // =========================
    // TODAY'S GOALS
    // =========================

    if (
      goalHistory[today] === undefined
    ) {

      totalGoals +=
        goals.length;


      completedGoals +=
        goals.filter(
          (goal) =>
            goal.completed
        ).length;

    }


    // =========================
    // OVERALL
    // =========================

    const totalActivities =
      totalTasks +
      totalGoals;


    const completedActivities =
      completedMonthlyTasks +
      completedGoals;


    const overallProgress =
      totalActivities === 0
        ? 0
        : Math.round(
            (completedActivities /
              totalActivities) *
              100
          );


    return {

      totalTasks,

      completedTasks:
        completedMonthlyTasks,

      totalGoals,

      completedGoals,

      totalActivities,

      completedActivities,

      overallProgress,

    };

  };


  const monthlyStats =
    getMonthlyStats();


  // =========================
  // RETURN
  // =========================

  return {

    today,

    todayTasks,

    completedTasks,

    progress,

    weeklyData,

    taskHistory,

    monthlyStats,

  };

}


export default useTracker;