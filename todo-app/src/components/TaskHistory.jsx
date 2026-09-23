function TaskHistory({ taskHistory }) {

  return (

    <section className="history-section">

      <div className="history-header">

        <div>

          <h2>📅 Daily Activity History</h2>

          <p>
            Your recent productivity history
          </p>

        </div>

        <span className="history-label">
          Last 7 Days
        </span>

      </div>


      {taskHistory.length === 0 ? (

        <div className="empty-history">

          <span>📭</span>

          <p>
            No activity history available.
          </p>

        </div>

      ) : (

        <div className="history-list">

          {taskHistory.map(
            ([date, data]) => {

              const totalActivities =
                data.tasksTotal +
                data.goalsTotal;


              const completedActivities =
                data.tasksCompleted +
                data.goalsCompleted;


              const progress =
                totalActivities === 0
                  ? 0
                  : Math.round(
                      (completedActivities /
                        totalActivities) *
                        100
                    );


              const formattedDate =
                new Date(
                  date + "T00:00:00"
                ).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  }
                );


              return (

                <div
                  className="history-item"
                  key={date}
                >

                  {/* DATE */}

                  <div className="history-date">

                    <div className="history-date-icon">
                      📅
                    </div>

                    <div>

                      <strong>
                        {formattedDate}
                      </strong>

                      <span>
                        {completedActivities} of{" "}
                        {totalActivities} completed
                      </span>

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="history-details">

                    <span>
                      📝 {data.tasksCompleted} /{" "}
                      {data.tasksTotal}
                    </span>

                    <span>
                      🎯 {data.goalsCompleted} /{" "}
                      {data.goalsTotal}
                    </span>

                  </div>


                  {/* PROGRESS */}

                  <div className="history-progress">

                    <div className="progress-bar">

                      <div
                        className="progress"
                        style={{
                          width:
                            `${progress}%`,
                        }}
                      ></div>

                    </div>

                  </div>


                  {/* PERCENTAGE */}

                  <div className="history-percent">

                    {progress}%

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}

    </section>

  );

}


export default TaskHistory;