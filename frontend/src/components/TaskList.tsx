import type { Task } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  tasks: Task[];
  isFetching: boolean;
  onComplete: (id: number) => void;
  onEdit: (task: Task) => void;
};

export default function TaskList({ tasks, isFetching, onComplete, onEdit }: Props) {
  if (isFetching) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg p-4 bg-white/60">
            <div className="h-4 bg-white/80 rounded w-1/3 mb-3" />
            <div className="h-3 bg-white/70 rounded w-2/3 mb-2" />
            <div className="h-3 bg-white/70 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-gray-600 text-lg text-center">No tasks yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="bg-white rounded-lg p-4 border border-white/20 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-600 text-md mb-3">{task.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(task.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onComplete(task.id)}
                  className="bg-success hover:bg-success-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
                >
                  Done
                </button>
                <button
                  onClick={() => onEdit(task)}
                  className="bg-primary-500 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
                >
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
