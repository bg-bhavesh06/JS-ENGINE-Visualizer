import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EventLoop = ({ active, onReadMore }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="event-loop-container">
      <div className="position-relative mb-2 w-100 text-center">
        <span style={{ fontSize: "0.68rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Event Loop
        </span>
        <button 
          type="button"
          className="btn btn-link p-0 text-decoration-none position-absolute" 
          style={{ right: "0.2rem", top: "-15%", transform: "translateY(-50%)", fontSize: "0.65rem", color: "var(--accent-primary)", fontWeight: "600" }}
          onClick={() => setIsOpen(true)}
        >
          ABOUT
        </button>
      </div>

      <div className={`event-loop-orb ${active ? "active" : ""}`}>
        <div className="event-loop-orb-content">
          <span style={{ fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.08em" }}>
            {active ? "TICKING" : "IDLE"}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
            style={{ background: "rgba(3, 7, 18, 0.65)", backdropFilter: "blur(8px)", zIndex: 1050 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              className="engine-panel p-3.5 p-sm-4 w-100 text-start" 
              style={{ maxWidth: "400px", background: "rgba(20, 20, 24, 0.96)", border: "1px solid rgba(59, 130, 246, 0.35)", borderRadius: "12px" }}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom border-secondary border-opacity-25">
                <h5 className="mb-0 text-white fw-bold" style={{ fontSize: "1.05rem" }}>Event Loop</h5>
                <button type="button" onClick={() => setIsOpen(false)} className="btn btn-link p-0 text-decoration-none text-secondary fs-5 lh-1">
                  ✕
                </button>
              </div>

              <p className="mb-3 small text-slate-300" style={{ lineHeight: "1.5" }}>
                The Event Loop is a mechanism that allows JavaScript to handle asynchronous operations while keeping the main thread non-blocking.
              </p>

              <div 
                className="mb-3 p-3 rounded" 
                style={{ 
                  background: "#ffffff", 
                  color: "#0f172a", 
                  borderRadius: "8px" 
                }}
              >
                <ul 
                  className="mb-0 ps-3 small d-flex flex-column gap-1.5" 
                  style={{ 
                    color: "#0f172a", 
                    fontWeight: "500", 
                    lineHeight: "1.4" 
                  }}
                >
                  <li>Continuously checks whether the Call Stack is empty.</li>
                  <li>Coordinates callbacks waiting in the Microtask Queue and Task Queue.</li>
                  <li>Microtasks are processed before regular tasks.</li>
                  <li>Moves a ready callback to the Call Stack when JavaScript can execute it.</li>
                  <li>When there is nothing to process, the Event Loop remains idle.</li>
                </ul>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none small fw-bold"
                  style={{ color: "var(--accent-primary)" }}
                  onClick={onReadMore || (() => console.log("Read More clicked"))}
                >
                  Read More →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventLoop;
