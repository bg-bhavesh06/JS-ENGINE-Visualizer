import { motion, AnimatePresence } from "framer-motion";

const isHighlighted = (label, highlightTasks) =>
  (highlightTasks || []).some(
    (task) => task === label || label.includes(task) || task.includes(label),
  );

const CallbackQueue = ({ items, highlightTasks = [] }) => {
  return (
    <div
      className="engine-panel p-2 h-100 callback-panel"
      style={{ background: "rgba(255,255,255,0.015)" }}
    >
      <h3 className="engine-title mb-2 justify-content-center" style={{ color: "#e2e8f0" }}>
        TASK QUEUE
      </h3>
      <div className="engine-scroll mt-2">
        <AnimatePresence>
          {items.length === 0 ? (
            <p
              className="text-slate-500 small mb-0 italic text-center"
              style={{ color: "#475569" }}
            >
              No callbacks queued.
            </p>
          ) : (
            items.map((task) => (
              <motion.div
                layout
                className={`engine-item ${
                  isHighlighted(task.label || task, highlightTasks)
                    ? "engine-item-highlight"
                    : ""
                }`}
                style={{
                  borderColor: "rgba(249, 115, 22, 0.25)",
                  background: "rgba(249, 115, 22, 0.05)",
                  color: "#fdba74",
                }}
                key={task.id || task.label || task}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {task.label || task}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CallbackQueue;
