
import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function DailyGoalsLineChart({ goalHistory = {} }) {
  const chartData = useMemo(() => {
    if (!goalHistory || typeof goalHistory !== "object") {
      return [];
    }

    return Object.entries(goalHistory)
      .filter(([date, record]) => {
        return (
          /^\d{4}-\d{2}-\d{2}$/.test(date) &&
          record !== null &&
          typeof record === "object"
        );
      })
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .slice(-30)
      .map(([date, record]) => ({
        date,
        label: new Date(`${date}T00:00:00`).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
          }
        ),
        completed: Number(record.completed) || 0,
        total: Number(record.total) || 0,
      }));
  }, [goalHistory]);

  return (
    <section className="daily-goals-chart">
      <h2>Daily Goals Completion</h2>

      <p>
        Track how many goals you complete each day.
      </p>

      {chartData.length === 0 ? (
        <p className="chart-empty">
          No goal history yet. Complete a goal to start tracking.
        </p>
      ) : (
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 15,
                right: 25,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                allowDecimals={false}
                domain={[0, "auto"]}
                label={{
                  value: "Number of Goals",
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <Tooltip
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.date || ""
                }
                formatter={(value, name) => [
                  value,
                  name === "completed"
                    ? "Goals Completed"
                    : "Total Goals",
                ]}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="completed"
                name="Goals Completed"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: "#6366f1",
                }}
                activeDot={{ r: 8 }}
              />

              <Line
                type="monotone"
                dataKey="total"
                name="Total Goals"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default DailyGoalsLineChart;
