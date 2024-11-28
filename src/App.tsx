import "./App.css";
import Board from "./components/Board";

function App() {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50 flex flex-col">
      <header className="bg-neutral-800 p-4 shadow-md">
        <h1 className="text-xl font-bold text-neutral-50">My Kanban Board</h1>
      </header>
      <main className="flex-grow p-4">
        <Board />
      </main>
    </div>
  );
}

export default App;