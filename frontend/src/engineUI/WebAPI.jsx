import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AboutModal from "./AboutModal";

const isHighlighted = (label, highlightTasks) =>
  (highlightTasks || []).some(
    (task) => task === label || label.includes(task) || task.includes(label),
  );

const webApiPoints = [
  "Web APIs are provided by the browser environment, not by the JavaScript engine itself.",
  "They handle operations that may take time to complete.",
  "Examples include setTimeout, fetch, DOM events, and geolocation.",
  "JavaScript starts the operation and continues executing other code.",
  "When the operation is completed, its callback or result can be scheduled for JavaScript to process."
];

const webApiExamples = [
  "setTimeout()",
  "fetch()",
  "DOM Events",
  "Geolocation"
];

const WebAPI = ({ items, highlightTasks = [], onReadMore }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const renderLabel = (item) => {
    const label = item.label || item;
    if (
      item &&
      typeof item === "object" &&
      typeof item.remainingMs === "number"
    ) {
      return (
        <div className="w-100 d-flex flex-column gap-1">
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-truncate" style={{ maxWidth: "70%" }}>
              {label}
            </span>
            <span
              className="badge font-mono"
              style={{
                background: "rgba(34, 211, 238, 0.15)",
                color: "#22d3ee",
                fontSize: "0.68rem",
              }}
            >
              {item.remainingMs}ms
            </span>
          </div>
        </div>
      );
    }
    return label;
  };

  return (
    <div
      className="engine-panel p-3 h-100 webapi-panel"
      style={{ background: "rgba(255,255,255,0.015)" }}
    >
      <div className="position-relative mb-2">
        <h3 className="engine-title mb-0 justify-content-center" style={{ color: "#e2e8f0" }}>
          WEB API'S
        </h3>
        <button 
          type="button"
          className="btn btn-link p-0 text-decoration-none position-absolute" 
          style={{ right: "0.2rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.65rem", color: "var(--accent-primary)", fontWeight: "600", letterSpacing: "0.05em" }}
          onClick={() => setIsAboutOpen(true)}
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
              No active Web API tasks.
            </p>
          ) : (
            items.map((item) => (
              <motion.div
                layout
                key={item.id || item}
                className={`engine-item ${
                  isHighlighted(item.label || item, highlightTasks)
                    ? "engine-item-highlight"
                    : ""
                }`}
                style={{
                  borderColor: "rgba(34, 211, 238, 0.25)",
                  background: "rgba(34, 211, 238, 0.05)",
                  color: "#67e8f9",
                  padding: "0.4rem 0.6rem",
                }}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
              >
                {renderLabel(item)}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        title="Web APIs"
        description="Web APIs are browser-provided features that allow JavaScript to perform asynchronous operations such as timers, network requests, and DOM events."
        points={webApiPoints}
        examples={webApiExamples}
        onReadMore={onReadMore}
      />
    </div>
  );
};

export default WebAPI;
