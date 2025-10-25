import "./App.css";

function App() {

  return (
    <div className="h-dvh flex items-center justify-center">
      <div className="bg-[var(--color-surface)] border border-border p-4 rounded-xl shadow-2xl">
        <h2 className="text-[var(--color-text-primary)] font-semibold">
          Blog Title
        </h2>
        <p className="text-textSecondary">
          A modern minimal blog design.
        </p>
        <button className="bg-[var(--color-accent)] hover:bg-accentHover text-white px-4 py-2 rounded-lg">
          Read More
        </button>
      </div>
    </div>
  );
}

export default App;
