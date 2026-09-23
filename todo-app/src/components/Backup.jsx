import { useRef } from "react";

function Backup({ tasks, goals, goalHistory, streak }) {

  const fileInputRef = useRef(null);

  const exportBackup = () => {

    const backupData = {
      app: "Growth Tracker",
      version: "1.0",
      exportedAt: new Date().toISOString(),

      tasks: tasks,

      goals: goals,

      goalHistory: goalHistory,

      streak: streak,

      lastCompletedDate:
        localStorage.getItem(
          "lastCompletedDate"
        ) || "",

    };

    const jsonData =
      JSON.stringify(
        backupData,
        null,
        2
      );

    const blob =
      new Blob(
        [jsonData],
        {
          type: "application/json",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `growth-tracker-backup-${new Date()
        .toISOString()
        .split("T")[0]}.json`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  };

  const importBackup = (event) => {

    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = (e) => {

      try {

        const backupData =
          JSON.parse(
            e.target.result
          );

        if (
          backupData.app !==
          "Growth Tracker"
        ) {

          alert(
            "Invalid Growth Tracker backup file."
          );

          return;

        }

        if (
          !Array.isArray(
            backupData.tasks
          ) ||
          !Array.isArray(
            backupData.goals
          )
        ) {

          alert(
            "Backup file is incomplete."
          );

          return;

        }

        localStorage.setItem(
          "growthTasks",
          JSON.stringify(
            backupData.tasks
          )
        );

        localStorage.setItem(
          "growthGoals",
          JSON.stringify(
            backupData.goals
          )
        );

        localStorage.setItem(
          "growthGoalHistory",
          JSON.stringify(
            backupData.goalHistory || {}
          )
        );

        localStorage.setItem(
          "growthStreak",
          backupData.streak || 0
        );

        localStorage.setItem(
          "lastCompletedDate",
          backupData.lastCompletedDate || ""
        );

        alert(
          "Backup restored successfully! Please refresh the page."
        );

      } catch (error) {

        alert(
          "Unable to read backup file."
        );

      }

    };

    reader.readAsText(file);

    event.target.value = "";

  };

  return (
    <section className="backup-section">

      <div className="backup-header">

        <div>

          <h2>
            💾 Data Backup
          </h2>

          <p>
            Keep your Growth Tracker data safe
          </p>

        </div>

      </div>

      <div className="backup-actions">

        <div className="backup-card">

          <div className="backup-icon">
            📥
          </div>

          <div className="backup-info">

            <h3>
              Export Backup
            </h3>

            <p>
              Download all your tasks,
              goals and progress as a
              backup file.
            </p>

            <button
              className="backup-btn"
              onClick={exportBackup}
            >
              📥 Export Backup
            </button>

          </div>

        </div>

        <div className="backup-card">

          <div className="backup-icon">
            📤
          </div>

          <div className="backup-info">

            <h3>
              Import Backup
            </h3>

            <p>
              Restore your previous
              Growth Tracker data.
            </p>

            <button
              className="backup-btn"
              onClick={() =>
                fileInputRef.current.click()
              }
            >
              📤 Import Backup
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={importBackup}
              style={{
                display: "none",
              }}
            />

          </div>

        </div>

      </div>

    </section>
  );
}

export default Backup;