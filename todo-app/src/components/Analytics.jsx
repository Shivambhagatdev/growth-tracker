
import getTodayDate from "../utils/date";
import {
  exportAnalyticsCSV,
  exportAnalyticsJSON,
  exportAnalyticsPNG,
} from "../utils/exportAnalytics";

function getPreviousDates(count) {
  const dates = [];
  const current = new Date();

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(current);
    date.setDate(current.getDate() - offset);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    dates.push({
      date: `${year}-${month}-${day}`,
      label: date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
      }),
    });
  }

  return dates;
}

function Analytics({
  tasks = [],
  monthlyStats = {},
  goals = [],
  goalHistory = {},
  streak = 0,
}) {
  const today = getTodayDate();
  const lastThreeDays = getPreviousDates(3);
  const lastSevenDays = getPreviousDates(7);

  const dailyTaskData = lastSevenDays.map(({ date, label }) => {
    const completed = tasks.filter(
      (task) => (task.completedDate || "") === date
    ).length;

    return { date, label, completed };
  });

  const maxCompleted = Math.max(
    1,
    ...dailyTaskData.map((day) => day.completed)
  );

  const chartWidth = 700;
  const chartHeight = 240;
  const left = 42;
  const right = 18;
  const top = 24;
  const bottom = 42;
  const plotWidth = chartWidth - left - right;
  const plotHeight = chartHeight - top - bottom;

  const points = dailyTaskData.map((day, index) => ({
    ...day,
    x:
      left +
      (index / Math.max(1, dailyTaskData.length - 1)) *
        plotWidth,
    y:
      top +
      plotHeight -
      (day.completed / maxCompleted) * plotHeight,
  }));

  const linePoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const taskCompletion = monthlyStats.totalTasks
    ? Math.round(
        (monthlyStats.completedTasks / monthlyStats.totalTasks) * 100
      )
    : 0;

  const goalCompletion = monthlyStats.totalGoals
    ? Math.round(
        (monthlyStats.completedGoals / monthlyStats.totalGoals) * 100
      )
    : 0;

  const exportJSON = () => {
    exportAnalyticsJSON({ tasks, goals, goalHistory, streak });
  };

  const exportPNG = async () => {
    try {
      await exportAnalyticsPNG(tasks);
    } catch (error) {
      console.error("PNG export failed:", error);
      alert("Unable to export PNG. Please try again.");
    }
  };

  return (
    <section className="analytics-section">
      <div className="analytics-header">
        <div>
          <h2>📊 Analytics</h2>
          <p>Understand your daily task completion</p>
        </div>

        <span className="analytics-label">Last 7 Days</span>
      </div>

      <div className="analytics-export-panel">
        <div>
          <h3>Export Analytics</h3>
          <p>
            Save your historical records and graphs for future analysis.
          </p>
        </div>

        <div className="analytics-export-actions">
          <button
            type="button"
            className="analytics-export-button"
            onClick={() => exportAnalyticsCSV(tasks)}
          >
            <span aria-hidden="true">📄</span> Export CSV
          </button>

          <button
            type="button"
            className="analytics-export-button"
            onClick={exportPNG}
          >
            <span aria-hidden="true">📈</span> Export PNG
          </button>

          <button
            type="button"
            className="analytics-export-button"
            onClick={exportJSON}
          >
            <span aria-hidden="true">💾</span> Export JSON
          </button>
        </div>
      </div>

      <div className="analytics-cards">
        <div className="analytics-card">
          <span className="analytics-icon">✅</span>
          <div>
            <p>Tasks Completed Today</p>
            <h3>
              {dailyTaskData.find((day) => day.date === today)
                ?.completed ?? 0}
            </h3>
          </div>
        </div>

        <div className="analytics-card">
          <span className="analytics-icon">📝</span>
          <div>
            <p>Task Completion</p>
            <h3>{taskCompletion}%</h3>
          </div>
        </div>

        <div className="analytics-card">
          <span className="analytics-icon">🎯</span>
          <div>
            <p>Goal Completion</p>
            <h3>{goalCompletion}%</h3>
          </div>
        </div>

        <div className="analytics-card">
          <span className="analytics-icon">📅</span>
          <div>
            <p>Tasks Added Today</p>
            <h3>
              {
                tasks.filter(
                  (task) =>
                    (task.createdDate || task.date) === today
                ).length
              }
            </h3>
          </div>
        </div>
      </div>

      <div className="daily-pie-section">
        <div className="chart-header">
          <div>
            <h3>Daily Task Breakdown</h3>
            <p>Completed versus remaining tasks for each day</p>
          </div>
          <span className="chart-subtitle">Last 3 days</span>
        </div>

        <div className="daily-pie-grid">
          {lastThreeDays.map(({ date, label }) => {
            const dayTasks = tasks.filter(
              (task) => (task.createdDate || task.date) === date
            );

            const completed = dayTasks.filter(
              (task) => task.completed
            ).length;

            const remaining = dayTasks.length - completed;

            const percentage = dayTasks.length
              ? Math.round((completed / dayTasks.length) * 100)
              : 0;

            return (
              <div className="daily-pie-card" key={date}>
                <strong>{label}</strong>

                <div
                  className="daily-pie"
                  role="img"
                  aria-label={`${label}: ${percentage}% completed`}
                  style={{
                    background: `conic-gradient(
                      var(--chart-complete, #22c55e) 0% ${percentage}%,
                      var(--chart-pending, #e5e7eb) ${percentage}% 100%
                    )`,
                  }}
                >
                  <div className="daily-pie-center">
                    <strong>{percentage}%</strong>
                    <span>completed</span>
                  </div>
                </div>

                <div className="pie-legend">
                  <span>
                    <i className="legend-complete" />
                    {completed} completed
                  </span>
                  <span>
                    <i className="legend-pending" />
                    {remaining} remaining
                  </span>
                </div>

                {dayTasks.length === 0 && (
                  <small className="pie-empty">No tasks added</small>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="analytics-chart line-chart-card">
        <div className="chart-header">
          <div>
            <h3>Daily Task Completion</h3>
            <p>Number of tasks completed per day</p>
          </div>
          <strong>
            {dailyTaskData.find((day) => day.date === today)
              ?.completed ?? 0}{" "}
            today
          </strong>
        </div>

        <div className="task-line-chart-wrap">
          <svg
            className="task-line-chart"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            role="img"
            aria-label="Line chart showing completed tasks for the last seven days"
          >
            {[0, 1, 2, 3].map((step) => {
              const y = top + (plotHeight / 3) * step;
              const value = Math.round(
                maxCompleted * (1 - step / 3)
              );

              return (
                <g key={step}>
                  <line
                    x1={left}
                    y1={y}
                    x2={chartWidth - right}
                    y2={y}
                    className="chart-grid-line"
                  />
                  <text
                    x={left - 12}
                    y={y + 4}
                    textAnchor="end"
                    className="chart-axis-label"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            <polyline points={linePoints} className="task-line" />

            {points.map((point) => (
              <g key={point.date}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  className="task-line-point"
                >
                  <title>
                    {point.label}: {point.completed} completed
                  </title>
                </circle>

                <text
                  x={point.x}
                  y={chartHeight - 14}
                  textAnchor="middle"
                  className="chart-axis-label"
                >
                  {point.label}
                </text>

                <text
                  x={point.x}
                  y={point.y - 12}
                  textAnchor="middle"
                  className="chart-point-value"
                >
                  {point.completed}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}

export default Analytics;
