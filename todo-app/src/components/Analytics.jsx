
import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import DailyGoalsLineChart from "./DailyGoalsLineChart";

import {
  exportAnalyticsCSV,
  exportAnalyticsPNG,
  exportAnalyticsJSON,
} from "../utils/exportAnalytics";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

function Analytics({
  tasks = [],
  monthlyStats = [],
  goals = [],
  goalHistory = [],
  streak = 0,
}) {
  const taskStats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    const pending = tasks.length - completed;

    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
    ];
  }, [tasks]);

  const goalStats = useMemo(() => {
    const completed = goals.filter(
      (goal) => goal.completed || goal.isCompleted
    ).length;

    const pending = goals.length - completed;

    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
    ];
  }, [goals]);

  const priorityStats = useMemo(() => {
    const priorities = ["High", "Medium", "Low"];

    return priorities.map((priority) => ({
      name: priority,
      value: tasks.filter(
        (task) =>
          String(task.priority || "Medium").toLowerCase() ===
          priority.toLowerCase()
      ).length,
    }));
  }, [tasks]);

  const handleCSVExport = () => {
    exportAnalyticsCSV({
      tasks,
      monthlyStats,
      goals,
      goalHistory,
      streak,
    });
  };

  const handleJSONExport = () => {
    exportAnalyticsJSON({
      tasks,
      monthlyStats,
      goals,
      goalHistory,
      streak,
    });
  };

  const handlePNGExport = () => {
    exportAnalyticsPNG({
      tasks,
      monthlyStats,
      goals,
      goalHistory,
      streak,
    });
  };

  const renderPieChart = (title, data) => (
    <div className="analytics-chart-card" key={title}>
      <h3>{title}</h3>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`${entry.name}-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <section className="analytics-section" id="analytics">
      <h2>Analytics Dashboard</h2>
      <p>Track your tasks, goals, and daily progress.</p>

      <div className="analytics-summary">
        <div className="analytics-summary-card">
          <h3>Total Tasks</h3>
          <p>{tasks.length}</p>
        </div>

        <div className="analytics-summary-card">
          <h3>Completed Tasks</h3>
          <p>{tasks.filter((task) => task.completed).length}</p>
        </div>

        <div className="analytics-summary-card">
          <h3>Total Goals</h3>
          <p>{goals.length}</p>
        </div>

        <div className="analytics-summary-card">
          <h3>Current Streak</h3>
          <p>{streak} days</p>
        </div>
      </div>

      <div className="analytics-pie-grid">
        {renderPieChart("Task Completion", taskStats)}
        {renderPieChart("Goal Completion", goalStats)}
        {renderPieChart("Task Priority", priorityStats)}
      </div>

      <div className="analytics-line-chart">
        <DailyGoalsLineChart goalHistory={goalHistory} />
      </div>

      <div className="analytics-export">
        <h3>Export Analytics</h3>

        <button type="button" onClick={handleCSVExport}>
          Export CSV
        </button>

        <button type="button" onClick={handlePNGExport}>
          Export PNG
        </button>

        <button type="button" onClick={handleJSONExport}>
          Export JSON
        </button>
      </div>
    </section>
  );
}

export default Analytics;
