import { motion, AnimatePresence } from "framer-motion";

const CallStack = ({ items }) => {
  return (
    <div
      className="engine-panel p-2 h-100 stack-panel"
      style={{ background: "rgba(255,255,255,0.015)" }}
    >
      <div className="position-relative mb-2">
        <h3 className="engine-title mb-0 justify-content-center" style={{ color: "#e2e8f0" }}>
          CALL STACK
        </h3>
        <button 
          className="btn btn-link p-0 text-decoration-none position-absolute" 
          style={{ right: "0.2rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.65rem", color: "var(--accent-primary)", fontWeight: "600", letterSpacing: "0.05em" }}
        >
          ABOUT
        </button>
      </div>
      <div className="engine-scroll mt-2">
        <AnimatePresence>
          {items.length === 0 ? (
            <p
              className="text-slate-500 small mb-0 italic text-center"
              style={{ color: "#475569" }}
            >
              Stack is empty.
            </p>
          ) : (
            [...items].reverse().map((item, index) => (
              <motion.div
                layout
                key={item + index}
                className="engine-item stack-item"
                style={{
                  borderColor: "rgba(96, 165, 250, 0.25)",
                  background: "rgba(96, 165, 250, 0.05)",
                  color: "#93c5fd",
                }}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
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

export default CallStack;
