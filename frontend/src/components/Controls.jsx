const Controls = ({
  onRun,
  onRunAutomatically,
  onPause,
  onReset,
  speed,
  onSpeedChange,
  isPlaying,
  currentStep,
  totalSteps,
  disableRun,
}) => {
  return (
    <div className="w-100">
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-md-end">
        {/* Run Automatically Button */}
        <button
          className="btn btn-sm d-flex align-items-center gap-1 transition-all"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            padding: "0.4rem 0.8rem",
            fontWeight: "600",
            opacity: disableRun ? 0.5 : 1,
          }}
          onClick={onRunAutomatically}
          disabled={disableRun}
        >
          <span>▶</span> Auto Run
        </button>

        {/* Step Forward Button */}
        <button
          className="btn btn-sm d-flex align-items-center gap-1 transition-all"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            color: "#e2e8f0",
            border: "1px solid var(--panel-border)",
            borderRadius: "8px",
            padding: "0.4rem 0.8rem",
            fontWeight: "600",
            opacity: disableRun ? 0.5 : 1,
          }}
          onClick={onRun}
          disabled={disableRun}
        >
          <span>⏭</span> Step ({totalSteps === 0 ? 0 : currentStep + 1}/{totalSteps})
        </button>

        {/* Pause Button */}
        <button
          className="btn btn-sm d-flex align-items-center gap-1 transition-all"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            color: "#e2e8f0",
            border: "1px solid var(--panel-border)",
            borderRadius: "8px",
            padding: "0.4rem 0.8rem",
            fontWeight: "600",
            opacity: !isPlaying ? 0.5 : 1,
          }}
          onClick={onPause}
          disabled={!isPlaying}
        >
          <span>⏸</span> Pause
        </button>

        {/* Reset Button */}
        <button
          className="btn btn-sm d-flex align-items-center gap-1 transition-all"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            color: "#e2e8f0",
            border: "1px solid var(--panel-border)",
            borderRadius: "8px",
            padding: "0.4rem 0.8rem",
            fontWeight: "600",
          }}
          onClick={onReset}
        >
          Reset
        </button>

        {/* Speed Slider Group */}
        <div 
          className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-3"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--panel-border)",
            borderRadius: "8px"
          }}
        >
          <label htmlFor="speedRange" className="small m-0" style={{ color: "var(--text-muted)", fontWeight: "600", fontSize: "0.75rem" }}>
            SPEED
          </label>
          <input
            id="speedRange"
            type="range"
            min="1"
            max="10"
            style={{
              width: "80px",
              height: "4px",
              cursor: "pointer",
              accentColor: "#e2e8f0"
            }}
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
          />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#e2e8f0", fontWeight: "700" }}>
            {speed}x
          </span>
        </div>
      </div>
    </div>
  );
};

export default Controls;
