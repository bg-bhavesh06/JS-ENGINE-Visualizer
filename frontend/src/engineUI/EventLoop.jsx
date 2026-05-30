const EventLoop = ({ active }) => {
  return (
    <div className="event-loop-container">
      <span 
        style={{ 
          fontSize: "0.68rem", 
          fontWeight: "700", 
          color: "var(--text-muted)", 
          textTransform: "uppercase", 
          letterSpacing: "0.08em",
          marginBottom: "0.5rem" 
        }}
      >
        Event Loop
      </span>
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
