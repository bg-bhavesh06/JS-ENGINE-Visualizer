const ConsoleOutput = ({ output }) => {
  return (
    <div className="engine-panel overflow-hidden h-100">
      {/* Sleek Unix Terminal Header */}
      <div className="terminal-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <div className="terminal-dots d-flex gap-1.5">
            <div className="terminal-dot red" style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }}></div>
            <div className="terminal-dot yellow" style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }}></div>
            <div className="terminal-dot green" style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }}></div>
          </div>
          <span className="small ms-2" style={{ color: "#94a3b8", fontWeight: "600", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace" }}>
            bash - js-engine@developer:~
          </span>
        </div>
        <span style={{ fontSize: "0.65rem", color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>UTF-8</span>
      </div>

      {/* Terminal logs body */}
      <div className="terminal-body flex-grow-1" style={{ minHeight: 0, overflowY: "auto" }}>
        {output.length === 0 ? (
          <div className="d-flex align-items-center gap-2 text-slate-500" style={{ color: "#475569", fontStyle: "italic", fontSize: "0.8rem" }}>
            <span>$</span> console is waiting for logs...
          </div>
        ) : (
          output.map((line, index) => (
            <div className="console-line animate-fade-in" key={`${line}-${index}`}>
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsoleOutput;
