function Analytics({ weeklyData, monthlyStats }) {

  const averageWeeklyProgress =
    weeklyData.length === 0
      ? 0
      : Math.round(
          weeklyData.reduce(
            (sum, day) =>
              sum + day.progress,
            0
          ) / weeklyData.length
        );

  const highestDay =
    weeklyData.length === 0
      ? null
      : weeklyData.reduce(
          (highest, current) =>
            current.progress >
            highest.progress
              ? current
              : highest,
          weeklyData[0]
        );

  const taskCompletion =
    monthlyStats.totalTasks === 0
      ? 0
      : Math.round(
          (monthlyStats.completedTasks /
            monthlyStats.totalTasks) *
            100
        );

  const goalCompletion =
    monthlyStats.totalGoals === 0
      ? 0
      : Math.round(
          (monthlyStats.completedGoals /
            monthlyStats.totalGoals) *
            100
        );

  return (
    <section className="analytics-section">

      <div className="analytics-header">

        <div>
          <h2>📊 Analytics</h2>

          <p>
            Understand your productivity patterns
          </p>
        </div>

        <span className="analytics-label">
          Last 7 Days
        </span>

      </div>

      {/* ANALYTICS CARDS */}

      <div className="analytics-cards">

        <div className="analytics-card">

          <span className="analytics-icon">
            📈
          </span>

          <div>
            <p>Weekly Average</p>

            <h3>
              {averageWeeklyProgress}%
            </h3>
          </div>

        </div>

        <div className="analytics-card">

          <span className="analytics-icon">
            📝
          </span>

          <div>
            <p>Task Completion</p>

            <h3>
              {taskCompletion}%
            </h3>
          </div>

        </div>

        <div className="analytics-card">

          <span className="analytics-icon">
            🎯
          </span>

          <div>
            <p>Goal Completion</p>

            <h3>
              {goalCompletion}%
            </h3>
          </div>

        </div>

        <div className="analytics-card">

          <span className="analytics-icon">
            🏆
          </span>

          <div>
            <p>Best Day</p>

            <h3>
              {highestDay
                ? highestDay.day
                : "-"}
            </h3>

            <small>
              {highestDay
                ? `${highestDay.progress}%`
                : ""}
            </small>

          </div>

        </div>

      </div>

      {/* WEEKLY CHART */}

      <div className="analytics-chart">

        <div className="chart-header">

          <div>
            <h3>
              Weekly Completion
            </h3>

            <p>
              Tasks + Goals
            </p>
          </div>

          <strong>
            {averageWeeklyProgress}%
          </strong>

        </div>

        <div className="analytics-bars">

          {weeklyData.map((day) => (

            <div
              className="analytics-day"
              key={day.date}
            >

              <div className="analytics-bar-container">

                <div
                  className="analytics-bar"
                  style={{
                    height:
                      `${Math.max(
                        day.progress,
                        4
                      )}%`,
                  }}
                >

                  <span>
                    {day.progress}%
                  </span>

                </div>

              </div>

              <strong>
                {day.day}
              </strong>

              <small>
                {day.completed}/{day.total}
              </small>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Analytics;