function Stats({
  todayTasks,
  completedTasks,
  progress,
  streak,
  completedGoals,
  goalProgress,
  goals,
}) {

  // =========================
  // TASK PROGRESS
  // =========================

  const taskProgress =
    todayTasks.length === 0
      ? 0
      : Math.round(
          (completedTasks /
            todayTasks.length) *
            100
        );


  return (

    <>

      {/* =========================
          KPI CARDS
      ========================= */}

      <section className="stats">

        <div className="stat-card">

          <h3>Today's Tasks</h3>

          <h2>
            {todayTasks.length}
          </h2>

        </div>


        <div className="stat-card">

          <h3>Completed</h3>

          <h2>
            {completedTasks}
          </h2>

        </div>


        <div className="stat-card">

          <h3>Overall Progress</h3>

          <h2>
            {progress}%
          </h2>

        </div>


        <div className="stat-card">

          <h3>Current Streak</h3>

          <h2>
            {streak} 🔥
          </h2>

        </div>

      </section>


      {/* =========================
          PROGRESS BREAKDOWN
      ========================= */}

      <section className="progress-breakdown">

        <div className="breakdown-header">

          <div>

            <h2>
              📊 Today's Progress
            </h2>

            <p>
              Tasks + Daily Goals
            </p>

          </div>

          <strong>
            {progress}%
          </strong>

        </div>


        {/* =========================
            TASK PROGRESS
        ========================= */}

        <div className="breakdown-item">

          <div className="breakdown-info">

            <span>
              📝 Tasks
            </span>

            <span>
              {completedTasks} /{" "}
              {todayTasks.length}
            </span>

          </div>


          <div className="progress-bar">

            <div
              className="progress"
              style={{
                width:
                  `${taskProgress}%`,
              }}
            ></div>

          </div>

        </div>


        {/* =========================
            GOAL PROGRESS
        ========================= */}

        <div className="breakdown-item">

          <div className="breakdown-info">

            <span>
              🎯 Daily Goals
            </span>

            <span>
              {completedGoals} /{" "}
              {goals.length}
            </span>

          </div>


          <div className="progress-bar">

            <div
              className="progress"
              style={{
                width:
                  `${goalProgress}%`,
              }}
            ></div>

          </div>

        </div>


      </section>

    </>

  );

}


export default Stats;