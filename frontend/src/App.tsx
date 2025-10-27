import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import type { Task } from './types';
import Navbar from './components/Navbar';
import ErrorBanner from './components/ErrorBanner';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    setIsFetching(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Unable to load tasks. Please check if the backend is running.');
    } finally {
      setIsFetching(false);
    }
  };

  // Add new task
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const created: Task = await response.json();
        setTasks((prev) => [created, ...prev]);
        setTitle('');
        setDescription('');
        setError(null);
        toast.success('Task created');
      } else {
        const msg = await response.text();
        throw new Error(msg || 'Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Unable to add task. Please try again.');
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  // Mark task as complete

  const completeTask = async (id: number) => {
    try {
      const prevTasks = [...tasks];
      // Optimistic remove for smooth exit animation
      setTasks((prev) => prev.filter((t) => t.id !== id));
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        setError(null);
        toast.success('Task removed');
      } else {
        const msg = await response.text();
        // rollback
        setTasks(prevTasks);
        throw new Error(msg || 'Failed to remove task');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      setError('Unable to complete task. Please try again.');
      toast.error('Failed to delete task');
    }
  };

  // Editing support
  const openCreate = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setIsOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
    setIsOpen(true);
  };
  const updateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (response.ok) {
        const updated: Task = await response.json();
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        toast.success('Task updated');
        setIsOpen(false);
        setEditingId(null);
        setTitle('');
        setDescription('');
      } else {
        const msg = await response.text();
        throw new Error(msg || 'Failed to update task');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen w-full bg-light-300">
      {/* Navbar */}
      <Navbar onAddClick={openCreate} />

      {/* Toasts */}
      <Toaster position="top-center" />

      {/* Error banner */}
      <ErrorBanner message={error ?? ''} />

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-4">
        <div className="backdrop-blur-lg bg-surface-50 rounded-2xl p-6 shadow-xl border border-white/30 mt-20">
          <h2 className="text-2xl font-semibold text-primary mb-6">
            Recent Tasks ({tasks.length})
          </h2>

          <TaskList
            tasks={tasks}
            isFetching={isFetching}
            onComplete={completeTask}
            onEdit={openEdit}
          />
        </div>
      </main>

      {/* Modal for creating a task */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dimmed overlay with blur for stronger glass effect */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative z-10 w-full max-w-lg mx-auto p-6"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <div className="backdrop-blur-xl bg-surface-50 rounded-2xl p-6 shadow-2xl border border-white/40 ring-1 ring-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex-1 text-center text-xl font-bold text-primary-500">
                    {editingId ? 'Edit Task' : 'Create Task'}
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <form
                  onSubmit={async (e) => {
                    if (editingId) {
                      await updateTask(e);
                    } else {
                      await addTask(e);
                    }
                    setIsOpen(false);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter task title..."
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Enter task description..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {editingId ? (loading ? 'Saving...' : 'Save Changes') : (loading ? 'Adding Task...' : 'Add Task')}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
