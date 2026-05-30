import { motion, AnimatePresence } from "framer-motion";

const isHighlighted = (label, highlightTasks) =>
  (highlightTasks || []).some(
    (task) => task === label || label.includes(task) || task.includes(label),
  );

const HeapMemory = ({ items, highlightTasks = [] }) => {
  return (
    <div
      className="engine-panel p-2 h-100 heap-panel"
      style={{ background: "rgba(255,255,255,0.015)" }}
    >
    <h3 className="engine-title mb-2 justify-content-center" style={{ color: "#e2e8f0" }}>
  HEAP MEMORY
</h3>
      <div className="engine-scroll mt-2">
        <AnimatePresence>
          {items.length === 0 ? (
            <p
              className="text-slate-500 small mb-0 italic text-center"
              style={{ color: "#475569" }}
            >
              Heap is empty.
            </p>
          ) : (
            items.map((item) => (
              <motion.div
                layout
                key={item}
                className={`engine-item ${
                  isHighlighted(item, highlightTasks)
                    ? "engine-item-highlight"
                    : ""
                }`}
                style={{
                  borderColor: "rgba(192, 132, 252, 0.25)",
                  background: "rgba(192, 132, 252, 0.05)",
                  color: "#d8b4fe",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {item}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeapMemory;
