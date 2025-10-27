type Props = {
  onAddClick: () => void;
};

export default function Navbar({ onAddClick }: Props) {
  return (
    <nav className="w-full fixed top-0 left-0 z-10 bg-primary-500 text-white shadow-md rounded-b-3xl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold">To-Do App</h1>
        <button
          onClick={onAddClick}
          className="bg-white text-primary hover:bg-white/90 font-semibold py-2 px-4 rounded-lg shadow transition"
        >
          + Add Task
        </button>
      </div>
    </nav>
  );
}
