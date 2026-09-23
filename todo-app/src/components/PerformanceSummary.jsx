function PerformanceSummary({ monthlyStats }) {

  return (
    <section className="performance-section">

      <div className="performance-header">

        <div>
          <h2>📊 Performance Summary</h2>

          <p>
            Your current month's overall performance
          </p>
        </div>

        <div className="performance-month">
          This Month
        </div>

      </div>


      {/* STAT CARDS */}

      <div className="performance-stats">

        <div className="performance-card">

          <div className="performance-icon">
            📝
          </div>

          <div>

            <span>
              Total Tasks
            </span>

            <strong>
              {monthlyStats.totalTasks}
            </strong>

          </div>

        </div>


        <div className="performance-card">

          <div className="performance-icon">
            ✅
          </div>

          <div>

            <span>
              Completed Tasks
            </span>

            <strong>
              {monthlyStats.completedTasks}
            </strong>

          </div>

        </div>


        <div className="performance-card">

          <div className="performance-icon">
            🎯
          </div>

          <div>

            <span>
              Total Goals
            </span>

            <strong>
              {monthlyStats.totalGoals}
            </strong>

          </div>

        </div>


        <div className="performance-card">

          <div className="performance-icon">
            🏆
          </div>

          <div>

            <span>
              Completed Goals
            </span>

            <strong>
              {monthlyStats.completedGoals}
            </strong>

          </div>

        </div>

      </div>


      {/* OVERALL PROGRESS */}

      <div className="monthly-progress">

        <div className="monthly-progress-header">

          <div>

            <span>
              Overall Completion
            </span>

            <small>
              Tasks + Daily Goals
            </small>

          </div>

          <strong>
            {monthlyStats.overallProgress}%
          </strong>

        </div>


        <div className="progress-bar">

          <div
            className="progress"
            style={{
              width:
                `${monthlyStats.overallProgress}%`,
            }}
          ></div>

        </div>


        <p>

          {monthlyStats.completedActivities} of{" "}
          {monthlyStats.totalActivities} activities completed

        </p>

      </div>

    </section>
  );
}

export default PerformanceSummary;