function WeeklyGrowth({ weeklyData }) {

  return (

    <section className="weekly-section">

      <div className="weekly-header">

        <div>
          <h2>📈 Weekly Growth</h2>

          <p>
            Your productivity throughout the week
          </p>
        </div>

        <span className="weekly-label">
          Mon - Sun
        </span>

      </div>


      <div className="weekly-growth">

        {weeklyData.map((item) => (

          <div
            className="day-progress"
            key={item.date}
          >

            <div className="day-top">

              <span className="day-name">
                {item.day}
              </span>

              <span className="day-percent">
                {item.progress}%
              </span>

            </div>


            <div className="weekly-bar">

              <div
                className="weekly-fill"
                style={{
                  height: `${item.progress}%`,
                }}
              ></div>

            </div>


            <div className="day-bottom">

              <span>
                {item.completed}
              </span>

              <span>
                / {item.total}
              </span>

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}

export default WeeklyGrowth;