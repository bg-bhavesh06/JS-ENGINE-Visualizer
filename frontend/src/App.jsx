import { useEffect, useMemo, useState } from "react";
import CodeEditor from "./components/CodeEditor";
import Controls from "./components/Controls";
import ConsoleOutput from "./components/ConsoleOutput";
import CallStack from "./engineUI/CallStack";
import WebAPI from "./engineUI/WebAPI";
import HeapMemory from "./engineUI/HeapMemory";
import MicrotaskQueue from "./engineUI/MicrotaskQueue";
import CallbackQueue from "./engineUI/CallbackQueue";
import EventLoop from "./engineUI/EventLoop";
import {
  defaultCode,
  emptyEngineState,
  speedToInterval,
} from "./store/simulationStore";
import { simulateCode } from "./services/api";
import AuthModal from "./components/AuthModal";

const App = () => {
  const [code, setCode] = useState(defaultCode);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speed, setSpeed] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const [editorError, setEditorError] = useState("");

  // Auth state & localStorage sync
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("js_engine_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Failed to parse saved session:", e);
      return null;
    }
  });
  const handleAuthSuccess = (newToken, newUser) => {
    setUser(newUser);
    localStorage.setItem("js_engine_user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("js_engine_user");
  };
  const [hasEditorErrors, setHasEditorErrors] = useState(false);

  const hasSteps = steps.length > 0;
  const currentStep = hasSteps ? steps[currentStepIndex] : null;
  const currentState = currentStep?.state || emptyEngineState;
  const transitions = currentStep?.transitions || [];
  const incomingHighlights = {
    webAPIs: transitions
      .filter((transition) => transition.to === "webAPIs")
      .map((transition) => transition.task),
    heapMemory: transitions
      .filter((transition) => transition.to === "heapMemory")
      .map((transition) => transition.task),
    microtaskQueue: transitions
      .filter((transition) => transition.to === "microtaskQueue")
      .map((transition) => transition.task),
    callbackQueue: transitions
      .filter((transition) => transition.to === "callbackQueue")
      .map((transition) => transition.task),
  };

  const statusLabel = useMemo(() => {
    if (error) return `Error: ${error}`;
    if (editorError) return `Editor Error: ${editorError}`;
    if (!hasSteps) return "Engine Ready. Input script and click play.";
    return currentStep?.message || "Running step...";
  }, [error, editorError, hasSteps, currentStep]);

  const advanceStep = () => {
    setCurrentStepIndex((prev) => {
      if (prev >= steps.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  };

  useEffect(() => {
    if (!isPlaying || !hasSteps) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speedToInterval(speed));

    return () => clearInterval(interval);
  }, [isPlaying, hasSteps, speed, steps.length]);

  const fetchSimulation = async () => {
    if (hasEditorErrors) {
      setError("Fix editor errors before running simulation.");
      setIsPlaying(false);
      return false;
    }

    setError("");

    try {
      const payload = await simulateCode(code);
      setSteps(payload.steps || []);
      setCurrentStepIndex(0);
      return true;
    } catch (runError) {
      setError(runError.message);
      setSteps([]);
      setCurrentStepIndex(0);
      return false;
    }
  };

  const handleRunAutomatically = async () => {
    setIsPlaying(false);
    const ok = await fetchSimulation();
    if (ok) {
      setIsPlaying(true);
    }
  };

  const handleRun = async () => {
    setIsPlaying(false);
    if (!hasSteps) {
      await fetchSimulation();
      return;
    }
    advanceStep();
  };

  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSteps([]);
    setError("");
  };

  const handleEditorValidate = (markers) => {
    const errors = (markers || []).filter((marker) => marker.severity >= 8);
    setHasEditorErrors(errors.length > 0);
    setEditorError(errors.length > 0 ? errors[0].message : "");
    if (errors.length === 0) {
      setError("");
    }
  };

  return (
    <div className="container-fluid app-fit px-4 py-3">
      {/* Sleek Top Header Command Center */}
      <header className="engine-panel p-3 mb-3" style={{ flex: "0 0 auto" }}>
        <div className="row align-items-center">
          <div className="col-md-5 mb-2 mb-md-0">
            <h1 className="engine-heading mb-1" style={{ fontSize: "1.6rem" }}>
              JS Engine Visualizer
            </h1>
            <p className="engine-subtitle mb-0" style={{ fontSize: "0.85rem" }}>
              Interactive environment to explore call stacks, microtasks, and
              virtual browser timers.
            </p>
          </div>
          <div className="col-md-7 d-flex align-items-center gap-3 justify-content-md-end flex-wrap">
            {/* User Profile Widget */}
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span
                  className="badge px-3 py-2 font-mono"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--panel-border)",
                    color: "var(--text-muted)",
                    fontSize: "0.72rem",
                    borderRadius: "8px",
                  }}
                >
                  User: {user.username}
                </span>
                <button
                  className="btn btn-sm transition-all"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--panel-border)",
                    color: "var(--text-muted)",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "0.72rem",
                    padding: "0.4rem 0.75rem",
                  }}
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className="btn btn-sm px-3 py-2 text-white transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.72rem",
                }}
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In
              </button>
            )}
            {/* Divider */}
            <div
              className="d-none d-md-block"
              style={{
                width: "1px",
                height: "26px",
                background: "rgba(255,255,255,0.08)",
              }}
            ></div>
            <Controls
              onRun={handleRun}
              onRunAutomatically={handleRunAutomatically}
              onPause={handlePause}
              onReset={handleReset}
              speed={speed}
              onSpeedChange={setSpeed}
              isPlaying={isPlaying}
              currentStep={currentStepIndex}
              totalSteps={steps.length}
              disableRun={hasEditorErrors}
            />
          </div>
        </div>
        {/* Glow Status Ribbon */}
        <div
          className="mt-2 p-1.5 px-3 rounded-pill d-inline-flex align-items-center gap-2"
          style={{
            background: "rgba(31, 77, 203, 0.06)",
            border: "1px solid rgba(59, 130, 246, 0.15)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "1rem",
            color: error ? "var(--accent-danger)" : "var(--accent-primary)",
          }}
        >
          <span className="position-relative d-flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{
                background: error
                  ? "var(--accent-danger)"
                  : "var(--accent-primary)",
              }}
            ></span>
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: error
                  ? "var(--accent-danger)"
                  : "var(--accent-primary)",
              }}
            ></span>
          </span>
          {statusLabel}
        </div>
      </header>

      {/* Main Grid Workspace */}
      <div className="row g-3 flex-grow-1" style={{ minHeight: 0 }}>
        {/* Left Arena: Coding and Printing */}
        <div
          className="col-xl-6 d-flex flex-column gap-3 h-100"
          style={{ minHeight: 0 }}
        >
          <div
            className="flex-grow-1 d-flex flex-column"
            style={{ flex: "1 1 50%", minHeight: 0 }}
          >
            <CodeEditor
              code={code}
              onChange={setCode}
              activeLine={currentStep?.activeLine || null}
              onValidate={handleEditorValidate}
            />
          </div>
          <div
            className="flex-grow-1 d-flex flex-column"
            style={{ flex: "1 1 50%", minHeight: 0 }}
          >
            <ConsoleOutput output={currentState.consoleOutput} />
          </div>
        </div>

        {/* Right Arena: Javascript Engine Internals */}
        <div
          className="col-xl-6 d-flex flex-column h-100"
          style={{ minHeight: 0 }}
        >
          <div
            className="engine-panel border p-3 flex-grow-1 d-flex flex-column gap-3 h-100"
            style={{
              borderColor: "rgba(59, 130, 246, 0.3)",
              minHeight: 0,
            }}
          >
            {/* Top Row: JS Memory and Web APIs */}
            <div className="row gx-3" style={{ flex: "1 1 50%", minHeight: 0 }}>
              {/* JS MEMORY Box */}
              <div className="col-8 h-100">
                <div
                  className="border rounded p-2 pt-3 h-100 d-flex flex-column position-relative"
                  style={{
                    borderColor: "var(--panel-border)",
                    background: "rgba(255,255,255,0.015)",
                  }}
                >
                  <div
                    className="engine-title position-absolute px-2"
                    style={{
                      top: "-0.5rem",
                      left: "1rem",
                      background: "var(--panel-bg)",
                      color: "#e2e8f0",
                      margin: 0,
                    }}
                  >
                    JS MEMORY
                  </div>
                  <div
                    className="row gx-3 flex-grow-1"
                    style={{ minHeight: 0 }}
                  >
                    <div className="col-6 h-100">
                      <HeapMemory
                        items={currentState.heapMemory}
                        highlightTasks={incomingHighlights.heapMemory}
                      />
                    </div>
                    <div className="col-6 h-100">
                      <CallStack items={currentState.callStack} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Web API Box */}
              <div className="col-4 h-100">
                <WebAPI
                  items={currentState.webAPIs}
                  highlightTasks={incomingHighlights.webAPIs}
                />
              </div>
            </div>

            {/* Bottom Row: Microtask, Event Loop, Task Queue */}
            <div
              className="row gx-3 align-items-center"
              style={{ flex: "1 1 50%", minHeight: 0 }}
            >
              <div className="col-md-5 h-100">
                <MicrotaskQueue
                  items={currentState.microtaskQueue}
                  highlightTasks={incomingHighlights.microtaskQueue}
                />
              </div>
              <div className="col-md-2 d-flex justify-content-center my-2 my-md-0 h-100 align-items-center">
                <EventLoop active={Boolean(currentStep?.activeEventLoop)} />
              </div>
              <div className="col-md-5 h-100">
                <CallbackQueue
                  items={currentState.callbackQueue}
                  highlightTasks={incomingHighlights.callbackQueue}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default App;
