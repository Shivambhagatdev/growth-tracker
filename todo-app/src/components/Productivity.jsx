function Productivity({
  productivityScore,
}) {
  return (
    <section className="productivity-card">

      <div>

        <h2>
          ⚡ Daily Productivity
        </h2>

        <p>
          Tasks + Daily Goals
        </p>

      </div>


      <div className="productivity-score">
        {productivityScore}%
      </div>

    </section>
  );
}

export default Productivity;