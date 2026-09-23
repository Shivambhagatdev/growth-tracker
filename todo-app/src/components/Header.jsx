function Header({ darkMode, setDarkMode }) {
  return (
    <header className="header">

      <div>
        <h1>
          Growth Tracker 🚀
        </h1>

        <p>
          Build better habits, one day at a time.
        </p>
      </div>

      <button
        className="theme-btn"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode
          ? "☀️ Light Mode"
          : "🌙 Dark Mode"}
      </button>

    </header>
  );
}

export default Header;