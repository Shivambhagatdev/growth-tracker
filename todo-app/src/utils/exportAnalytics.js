
import getTodayDate from "./date";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadText(text, filename, mimeType) {
  downloadBlob(
    new Blob(["\uFEFF", text], { type: mimeType }),
    filename
  );
}

function formatDateLabel(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTaskCreatedDate(task) {
  return task.createdDate || task.date || "";
}

function getTaskCompletedDate(task) {
  return task.completedDate || "";
}

function getAllDailyAnalytics(tasks = []) {
  const today = getTodayDate();
  const dates = new Set([today]);

  tasks.forEach((task) => {
    const createdDate = getTaskCreatedDate(task);
    const completedDate = getTaskCompletedDate(task);

    if (createdDate && createdDate <= today) {
      dates.add(createdDate);
    }

    if (completedDate && completedDate <= today) {
      dates.add(completedDate);
    }
  });

  const sortedDates = [...dates].sort();

  if (sortedDates.length === 0) return [];

  const start = new Date(`${sortedDates[0]}T12:00:00`);
  const end = new Date(`${today}T12:00:00`);
  const allDates = [];

  // Include dates with zero activity too, so the trend is continuous.
  for (
    const current = new Date(start);
    current <= end;
    current.setDate(current.getDate() + 1)
  ) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");

    allDates.push(`${year}-${month}-${day}`);
  }

  return allDates.map((date) => {
    const createdTasks = tasks.filter(
      (task) => getTaskCreatedDate(task) === date
    );

    const completedToday = tasks.filter(
      (task) => getTaskCompletedDate(task) === date
    );

    const createdTasksEventuallyCompleted = createdTasks.filter(
      (task) =>
        task.completed === true ||
        Boolean(getTaskCompletedDate(task))
    );

    const pendingCreatedTasks = createdTasks.filter(
      (task) =>
        !task.completed &&
        !getTaskCompletedDate(task)
    );

    const cohortCompletionRate = createdTasks.length
      ? Math.round(
          (createdTasksEventuallyCompleted.length /
            createdTasks.length) *
            100
        )
      : 0;

    return {
      date,
      dateLabel: formatDateLabel(date),
      tasksCreated: createdTasks.length,
      tasksCompleted: completedToday.length,
      tasksPendingFromCreatedDay: pendingCreatedTasks.length,
      createdTaskCompletionRate: cohortCompletionRate,
    };
  });
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function exportAnalyticsCSV(tasks = []) {
  const rows = getAllDailyAnalytics(tasks);

  const headers = [
    "Date",
    "Tasks Created",
    "Tasks Completed On Date",
    "Pending Tasks From Created Date",
    "Created-Task Completion Rate (%)",
  ];

  const csv = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) =>
      [
        row.date,
        row.tasksCreated,
        row.tasksCompleted,
        row.tasksPendingFromCreatedDay,
        row.createdTaskCompletionRate,
      ]
        .map(csvEscape)
        .join(",")
    ),
  ].join("\r\n");

  downloadText(
    csv,
    `growth-tracker-analytics-${getTodayDate()}.csv`,
    "text/csv;charset=utf-8;"
  );
}

export function exportAnalyticsJSON({
  tasks = [],
  goals = [],
  goalHistory = {},
  streak = 0,
} = {}) {
  const backup = {
    app: "Growth Tracker",
    exportType: "full-analytics-backup",
    version: "1.1",
    exportedAt: new Date().toISOString(),
    dateRange: {
      from: getAllDailyAnalytics(tasks)[0]?.date ?? null,
      to: getTodayDate(),
    },
    analytics: getAllDailyAnalytics(tasks),
    tasks,
    goals,
    goalHistory,
    streak,
    lastCompletedDate:
      localStorage.getItem("lastCompletedDate") || "",
    localStorageData: {
      growthTasks: localStorage.getItem("growthTasks"),
      growthGoals: localStorage.getItem("growthGoals"),
      growthGoalHistory: localStorage.getItem("growthGoalHistory"),
      growthStreak: localStorage.getItem("growthStreak"),
      lastCompletedDate: localStorage.getItem("lastCompletedDate"),
      darkMode: localStorage.getItem("darkMode"),
    },
  };

  downloadText(
    JSON.stringify(backup, null, 2),
    `growth-tracker-full-backup-${getTodayDate()}.json`,
    "application/json;charset=utf-8;"
  );
}

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (character) => {
    const replacements = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };

    return replacements[character];
  });
}

function makePieChartSVG(tasks, date, x, y, width, height) {
  const dayTasks = tasks.filter(
    (task) => getTaskCreatedDate(task) === date
  );

  const completed = dayTasks.filter(
    (task) =>
      task.completed === true ||
      Boolean(getTaskCompletedDate(task))
  ).length;

  const pending = Math.max(0, dayTasks.length - completed);
  const percent = dayTasks.length
    ? Math.round((completed / dayTasks.length) * 100)
    : 0;

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const completedLength = circumference * (percent / 100);
  const centerX = x + width / 2;
  const centerY = y + 86;

  return `
    <g>
      <rect x="${x}" y="${y}" width="${width}" height="${height}"
        rx="16" fill="#ffffff" stroke="#e5e7eb"/>
      <text x="${centerX}" y="${y + 28}" text-anchor="middle"
        font-size="17" font-weight="700" fill="#111827">
        ${escapeXml(formatDateLabel(date))}
      </text>
      <circle cx="${centerX}" cy="${centerY}" r="${radius}"
        fill="none" stroke="#e5e7eb" stroke-width="18"/>
      <circle cx="${centerX}" cy="${centerY}" r="${radius}"
        fill="none" stroke="#22c55e" stroke-width="18"
        stroke-dasharray="${completedLength} ${circumference}"
        transform="rotate(-90 ${centerX} ${centerY})"
        stroke-linecap="butt"/>
      <circle cx="${centerX}" cy="${centerY}" r="31" fill="#ffffff"/>
      <text x="${centerX}" y="${centerY + 5}" text-anchor="middle"
        font-size="20" font-weight="700" fill="#111827">${percent}%</text>
      <text x="${centerX}" y="${y + 158}" text-anchor="middle"
        font-size="12" fill="#374151">
        ${completed} completed · ${pending} pending
      </text>
      <text x="${centerX}" y="${y + 179}" text-anchor="middle"
        font-size="11" fill="#6b7280">
        ${dayTasks.length} tasks created
      </text>
    </g>
  `;
}

export async function exportAnalyticsPNG(tasks = []) {
  const analytics = getAllDailyAnalytics(tasks);
  const width = 1200;
  const height = 900;

  const plot = {
    left: 85,
    top: 300,
    width: 1060,
    height: 390,
  };

  const maxValue = Math.max(
    1,
    ...analytics.map((day) => day.tasksCompleted)
  );

  const points = analytics.map((day, index) => {
    const x =
      plot.left +
      (analytics.length <= 1
        ? plot.width / 2
        : (index / (analytics.length - 1)) * plot.width);

    const y =
      plot.top +
      plot.height -
      (day.tasksCompleted / maxValue) * plot.height;

    return { ...day, x, y };
  });

  const linePoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const gridLines = Array.from({ length: 5 }, (_, index) => {
    const y = plot.top + (plot.height / 4) * index;
    const value = Math.round(maxValue * (1 - index / 4));

    return `
      <line x1="${plot.left}" y1="${y}"
        x2="${plot.left + plot.width}" y2="${y}"
        stroke="#e5e7eb" stroke-width="1"/>
      <text x="${plot.left - 18}" y="${y + 5}"
        text-anchor="end" font-size="13" fill="#64748b">
        ${value}
      </text>
    `;
  }).join("");

  const labelStep = Math.max(1, Math.ceil(points.length / 12));

  const lineDots = points.map((point, index) => {
    const label = index % labelStep === 0 ||
      index === points.length - 1;

    return `
      <circle cx="${point.x}" cy="${point.y}" r="4"
        fill="#6366f1" stroke="#ffffff" stroke-width="2"/>
      ${
        label
          ? `<text x="${point.x}" y="${plot.top + plot.height + 25}"
              text-anchor="middle" font-size="11" fill="#64748b">
              ${escapeXml(point.date.slice(5))}
            </text>`
          : ""
      }
    `;
  }).join("");

  const pieDates = [];
  const today = getTodayDate();
  const current = new Date(`${today}T12:00:00`);

  for (let offset = 2; offset >= 0; offset -= 1) {
    const date = new Date(current);
    date.setDate(current.getDate() - offset);

    pieDates.push(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    );
  }

  const pieCharts = pieDates.map((date, index) =>
    makePieChartSVG(tasks, date, 60 + index * 365, 75, 345, 195)
  ).join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
      width="${width}" height="${height}"
      viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f8fafc"/>
      <text x="60" y="42" font-size="27" font-weight="700"
        fill="#0f172a">Growth Tracker — Analytics Report</text>
      <text x="60" y="65" font-size="13" fill="#64748b">
        Exported ${escapeXml(new Date().toLocaleString())}
      </text>

      ${pieCharts}

      <text x="60" y="270" font-size="20" font-weight="700"
        fill="#0f172a">Historical Daily Task Completion</text>
      <text x="60" y="291" font-size="12" fill="#64748b">
        Tasks completed per date · All available history
      </text>

      ${gridLines}
      <polyline points="${linePoints}" fill="none"
        stroke="#6366f1" stroke-width="3"
        stroke-linejoin="round" stroke-linecap="round"/>
      ${lineDots}

      <text x="60" y="750" font-size="13" fill="#64748b">
        Historical dates depend on records saved by the app.
      </text>
      <text x="60" y="775" font-size="13" fill="#64748b">
        Missing historical completion dates cannot be reconstructed.
      </text>
    </svg>
  `;

  const svgBlob = new Blob([svg], {
    type: "image/svg+xml;charset=utf-8",
  });

  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = new Image();

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = svgUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not create image canvas.");
    }

    context.fillStyle = "#f8fafc";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const pngBlob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("PNG export failed."));
      }, "image/png");
    });

    downloadBlob(
      pngBlob,
      `growth-tracker-graphs-${getTodayDate()}.png`
    );
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
