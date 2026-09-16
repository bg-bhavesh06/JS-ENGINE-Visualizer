import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EventLoop = ({ active, onReadMore }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleReadMoreClick = (e) => {
    if (onReadMore) {
      onReadMore(e);
    } else {
      console.log("Read More clicked - Event Loop documentation action trigger");
    }
  };

  return (
    <div className="event-loop-container">
      <div className="position-relative mb-2 w-100 text-center">
        <span 
          style={{ 
            fontSize: "0.68rem", 
            fontWeight: "700", 
            color: "var(--text-muted)", 
            textTransform: "uppercase", 
            letterSpacing: "0.08em"
          }}
        >
          Event Loop
        </span>
        <button 
          type="button"
          className="btn btn-link p-0 text-decoration-none position-absolute" 
          style={{ right: "0.2rem", top: "-15%", transform: "translateY(-50%)", fontSize: "0.65rem", color: "var(--accent-primary)", fontWeight: "600", letterSpacing: "0.05em" }}
          onClick={() => setIsAboutOpen(true)}
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
        {isAboutOpen && (
          <motion.div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
            style={{
              background: "rgba(3, 7, 18, 0.65)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 1050
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAboutOpen(false)}
          >
            <motion.div 
              className="engine-panel p-3.5 p-sm-4 w-100 position-relative" 
              style={{ 
                maxWidth: "400px", 
                background: "rgba(20, 20, 24, 0.96)",
                border: "1px solid rgba(59, 130, 246, 0.35)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)",
                borderRadius: "12px",
                textAlign: "left"
              }}
              initial={{ scale: 0.92, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Title and Close X button */}
              <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="d-flex align-items-center gap-2">
                  <div 
                    style={{ 
                      width: "8px", 
                      height: "8px", 
                      borderRadius: "50%", 
                      background: "var(--accent-primary)",
                      boxShadow: "0 0 8px var(--accent-primary)"
                    }} 
                  />
                  <h5 className="mb-0 text-white" style={{ fontSize: "1.05rem", fontWeight: "700", letterSpacing: "0.02em" }}>
                    Event Loop
                  </h5>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsAboutOpen(false)} 
                  className="btn btn-link p-0 text-decoration-none" 
                  style={{ color: "#94a3b8", fontSize: "1.1rem", fontWeight: "600", lineHeight: "1" }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Description */}
              <p className="mb-3" style={{ fontSize: "0.82rem", lineHeight: "1.5", color: "#cbd5e1" }}>
                The Event Loop is a mechanism that allows JavaScript to handle asynchronous operations while keeping the main thread non-blocking.
              </p>

              {/* Basic Points */}
              <div className="mb-3 p-2.5 rounded" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <ul className="mb-0 ps-3 d-flex flex-column gap-1.5" style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: "1.4" }}>
                  <li>Continuously checks whether the Call Stack is empty.</li>
                  <li>Coordinates callbacks waiting in the Microtask Queue and Task Queue.</li>
                  <li>Microtasks are processed before regular tasks.</li>
                  <li>Moves a ready callback to the Call Stack when JavaScript can execute it.</li>
                  <li>When there is nothing to process, the Event Loop remains idle.</li>
                </ul>
              </div>

              {/* Read More Button at Bottom Right */}
              <div className="d-flex justify-content-end pt-1">
                <button
                  type="button"
                  className="btn btn-sm btn-link p-0 text-decoration-none d-inline-flex align-items-center gap-1"
                  style={{ color: "var(--accent-primary)", fontWeight: "600", fontSize: "0.8rem" }}
                  onClick={handleReadMoreClick}
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
