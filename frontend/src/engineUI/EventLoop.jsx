import { useState } from "react";
import AboutModal from "./AboutModal";

const eventLoopPoints = [
  "Continuously checks whether the Call Stack is empty.",
  "Coordinates callbacks waiting in the Microtask Queue and Task Queue.",
  "Microtasks are processed before regular tasks.",
  "Moves a ready callback to the Call Stack when JavaScript can execute it.",
  "When there is nothing to process, the Event Loop remains idle."
];

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

      <AboutModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Event Loop"
        description="The Event Loop is a mechanism that allows JavaScript to handle asynchronous operations while keeping the main thread non-blocking."
        points={eventLoopPoints}
        onReadMore={onReadMore}
      />
    </div>
  );
};

export default EventLoop;
