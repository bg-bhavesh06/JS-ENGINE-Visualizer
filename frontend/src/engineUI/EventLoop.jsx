const EventLoop = ({ active }) => {
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
          className="btn btn-link p-0 text-decoration-none position-absolute" 
          style={{ right: "0.2rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.65rem", color: "var(--accent-primary)", fontWeight: "600", letterSpacing: "0.05em" }}
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
    </div>
  );
};

export default EventLoop;
