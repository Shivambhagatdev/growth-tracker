import { useState } from "react";

function GoalsSection({
  goals,
  completedGoals,
  goalProgress,
  goalText,
  setGoalText,
  addGoal,
  toggleGoal,
  deleteGoal,
}) {

  const [goalIcon, setGoalIcon] =
    useState("🎯");


  return (

    <section className="growth-section">

      <h2>🎯 Daily Goals</h2>


      {/* =========================
          GOAL SUMMARY
      ========================= */}

      <div className="goal-summary">

        <div className="progress-bar">

          <div
            className="progress"
            style={{
              width: `${goalProgress}%`,
            }}
          ></div>

        </div>


        <p>
          {completedGoals} / {goals.length} goals completed
        </p>

      </div>


      {/* =========================
          GOALS LIST
      ========================= */}

      <div className="goals-list">

        {goals.map((goal) => (

          <div
            className="goal-item"
            key={goal.id}
          >

            <div>

              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() =>
                  toggleGoal(goal.id)
                }
              />


              <span>

                {goal.icon}{" "}

                <span
                  className={
                    goal.completed
                      ? "completed-task"
                      : ""
                  }
                >
                  {goal.text}
                </span>

              </span>

            </div>


            <button
              className="delete-btn"
              onClick={() =>
                deleteGoal(goal.id)
              }
            >
              Delete
            </button>

          </div>

        ))}

      </div>


      {/* =========================
          ADD CUSTOM GOAL
      ========================= */}

      <div className="goal-input">

        <input
          type="text"
          placeholder="Add custom goal..."
          value={goalText}
          onChange={(e) =>
            setGoalText(e.target.value)
          }
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              addGoal(goalIcon);

            }

          }}
        />


        <select
          value={goalIcon}
          onChange={(e) =>
            setGoalIcon(e.target.value)
          }
          className="goal-icon-select"
        >

          <option value="🎯">
            🎯 Other
          </option>

          <option value="💻">
            💻 Coding
          </option>

          <option value="📚">
            📚 Study
          </option>

          <option value="🏋️">
            🏋️ Exercise
          </option>

          <option value="📖">
            📖 Reading
          </option>

          <option value="💼">
            💼 Career
          </option>

          <option value="🧠">
            🧠 Learning
          </option>

          <option value="💰">
            💰 Finance
          </option>

        </select>


        <button
          onClick={() =>
            addGoal(goalIcon)
          }
        >
          Add
        </button>

      </div>

    </section>

  );

}

export default GoalsSection;