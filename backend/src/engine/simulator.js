const { parseCode } = require("./parser");
const { TaskManager } = require("./taskManager");
const { processEventLoop } = require("./eventLoop");
const { executeCodeAndCaptureOutput } = require("./runtimeExecutor");
const {
  refreshWebApiTimers,
  enqueueDueTimers,
} = require("./timers");
const vm = require("vm");
const SYNC_OPERATION_COST_MS = 1;

const validateCode = (code) => {
  try {
    const script = new vm.Script(code, { displayErrors: true });
    script.runInNewContext(
      {
        console: { log: () => {} },
        setTimeout: (callback) => {
          if (typeof callback !== "function") {
            throw new TypeError("setTimeout callback must be a function.");
          }
          return 1;
        },
        Promise,
      },
      { timeout: 80 },
    );
  } catch (error) {
    throw new Error(`Code validation failed: ${error.message}`);
  }
};

const isComplexRuntimeCase = (code) => {
  return /[{}]|\bfunction\b|\basync\b|\bawait\b/.test(code);
};

const buildRuntimeOnlySimulation = (runtime) => {
  const { runtimeEvents } = runtime;
  const taskManager = new TaskManager();
  const steps = [];
  let stepId = 1;
  let microtaskCounter = 1;

  const addStep = (type, message, metadata = {}) => {
    steps.push({
      id: stepId,
      type,
      lineNumber: metadata.lineNumber || null,
      activeLine: Object.prototype.hasOwnProperty.call(metadata, "activeLine")
        ? metadata.activeLine
        : null,
      message,
      state: taskManager.snapshot(),
      activeEventLoop: Boolean(metadata.activeEventLoop),
      transitions: metadata.transitions || [],
    });
    stepId += 1;
  };

  addStep("start", "Simulation started.");

  runtimeEvents.forEach((event) => {
    if (event.type === "timer-scheduled") {
      taskManager.addWebAPI({
        id: event.timerId,
        label: event.label,
        remainingMs: event.delayMs,
      });
      addStep("webapi-add", "Timer moved to Web APIs.", {
        transitions: [{ from: "callStack", to: "webAPIs", task: event.label }],
      });
      return;
    }

    if (event.type === "timer-wait") {
      addStep(
        "timer-wait",
        `Timers running in Web APIs: ${event.remainingMs}ms left.`,
        {
          activeLine: null,
        },
      );
      return;
    }

    if (event.type === "timer-enqueued") {
      taskManager.removeWebAPI(event.timerId);
      taskManager.enqueueCallback({ id: event.timerId, label: event.label });
      addStep(
        "callback-enqueue",
        "Timer finished and callback moved to Callback Queue.",
        {
          transitions: [
            { from: "webAPIs", to: "callbackQueue", task: event.label },
          ],
        },
      );
      return;
    }

    if (event.type === "callback-start") {
      const callbackTask = taskManager.dequeueCallback() || {
        label: event.label,
      };
      taskManager.pushStack(callbackTask.label);
      addStep("event-loop", `Executing callback: ${callbackTask.label}`, {
        activeEventLoop: true,
        transitions: [
          { from: "callbackQueue", to: "callStack", task: callbackTask.label },
        ],
      });
      return;
    }

    if (event.type === "callback-end") {
      taskManager.popStack();
      addStep("stack-pop", `Finished callback: ${event.label}`);
      return;
    }

    if (event.type === "console" && event.phase === "microtask") {
      const label = `Promise/Await Microtask #${microtaskCounter}`;
      microtaskCounter += 1;
      taskManager.enqueueMicrotask({
        id: label,
        label,
        consoleValue: event.value,
      });
      addStep("microtask-enqueue", "Microtask queued.", {
        transitions: [{ from: "callStack", to: "microtaskQueue", task: label }],
      });

      const microtask = taskManager.dequeueMicrotask();
      taskManager.pushStack(microtask.label);
      addStep("event-loop", `Executing microtask: ${microtask.label}`, {
        activeEventLoop: true,
        transitions: [
          { from: "microtaskQueue", to: "callStack", task: microtask.label },
        ],
      });

      taskManager.writeConsole(event.value);
      addStep("console", `console.log("${event.value}")`, {
        transitions: [
          { from: "callStack", to: "consoleOutput", task: microtask.label },
        ],
      });

      taskManager.popStack();
      addStep("stack-pop", `Finished microtask: ${microtask.label}`);
      return;
    }

    if (event.type === "console" && event.phase === "callback") {
      taskManager.writeConsole(event.value);
      const activeCallback =
        taskManager.callStack[taskManager.callStack.length - 1] || "callback";
      addStep("console", `console.log("${event.value}")`, {
        transitions: [
          { from: "callStack", to: "consoleOutput", task: activeCallback },
        ],
      });
      return;
    }

    if (event.type === "console") {
      taskManager.writeConsole(event.value);
      addStep("console", `console.log("${event.value}")`);
    }
  });

  addStep("idle", "Event loop idle.", { activeLine: null });
  addStep("complete", "Simulation completed.");

  return {
    steps,
    finalState: taskManager.snapshot(),
  };
};

const simulateCode = async (code) => {
  validateCode(code);

  if (isComplexRuntimeCase(code)) {
    const runtime = await executeCodeAndCaptureOutput(code);
    return buildRuntimeOnlySimulation(runtime);
  }

  const operations = parseCode(code);
  const taskManager = new TaskManager();
  const clock = { nowMs: 0 };
  const pendingTimers = [];
  const steps = [];
  let taskIdCounter = 1;

  const nextTaskId = () => {
    const id = taskIdCounter;
    taskIdCounter += 1;
    return id;
  };

  const addStep = (type, lineNumber, message, metadata = {}) => {
    const state = taskManager.snapshot();
    steps.push({
      id: metadata.taskId || nextTaskId(),
      type,
      lineNumber,
      activeLine: Object.prototype.hasOwnProperty.call(metadata, "activeLine")
        ? metadata.activeLine
        : lineNumber,
      message,
      state,
      activeEventLoop: Boolean(metadata.activeEventLoop),
      transitions: metadata.transitions || [],
    });
  };

  const tickTimersDuringSync = (elapsedMs, lineNumber) => {
    if (!pendingTimers.length) {
      return;
    }

    clock.nowMs += elapsedMs;
    refreshWebApiTimers({ taskManager, pendingTimers, nowMs: clock.nowMs });

    enqueueDueTimers({
      taskManager,
      addStep,
      pendingTimers,
      nowMs: clock.nowMs,
      lineNumber,
      message: "Timer finished and callback moved to Callback Queue.",
    });
  };

  addStep("start", null, "Simulation started.");

  operations.forEach((operation) => {
    taskManager.pushStack(`Line ${operation.lineNumber} executing`);
    addStep(
      "stack-push",
      operation.lineNumber,
      `Push line ${operation.lineNumber} onto Call Stack.`,
    );

    if (operation.type === "console") {
      taskManager.writeConsole(operation.value);
      addStep(
        "console",
        operation.lineNumber,
        `console.log("${operation.value}")`,
        {
          transitions: [
            { from: "callStack", to: "consoleOutput", task: "console.log" },
          ],
        },
      );
    } else if (operation.type === "setTimeout") {
      const callbackPreview =
        operation.callbackLogValue != null
          ? `console.log("${operation.callbackLogValue}")`
          : "anonymous callback";
      const timerTask = {
        id: `timeout-${nextTaskId()}`,
        label: `setTimeout callback: ${callbackPreview}`,
        lineNumber: operation.lineNumber,
        consoleValue: operation.callbackLogValue,
      };
      taskManager.addWebAPI({
        id: timerTask.id,
        label: timerTask.label,
        remainingMs: operation.delay,
      });
      addStep("webapi-add", operation.lineNumber, "Timer moved to Web APIs.", {
        transitions: [
          { from: "callStack", to: "webAPIs", task: timerTask.label },
        ],
      });

      pendingTimers.push({
        id: timerTask.id,
        task: timerTask,
        remainingMs: operation.delay,
        readyAtMs: clock.nowMs + operation.delay,
      });
      enqueueDueTimers({
        taskManager,
        addStep,
        pendingTimers,
        nowMs: clock.nowMs,
        lineNumber: operation.lineNumber,
        message: "Timer finished and callback moved to Callback Queue.",
      });
    } else if (operation.type === "promiseThen") {
      const callbackPreview =
        operation.callbackLogValue != null
          ? `console.log("${operation.callbackLogValue}")`
          : "anonymous callback";
      const microtask = {
        id: `promise-${nextTaskId()}`,
        label: `Promise.then callback: ${callbackPreview}`,
        lineNumber: operation.lineNumber,
        consoleValue: operation.callbackLogValue,
      };
      taskManager.enqueueMicrotask(microtask);
      addStep("microtask-enqueue", operation.lineNumber, "Microtask queued.", {
        transitions: [
          { from: "callStack", to: "microtaskQueue", task: microtask.label },
        ],
      });
    } else if (operation.type === "asyncFunctionDeclaration") {
      taskManager.addHeapReference(`async function ${operation.functionName}`);
      addStep(
        "heap-add",
        operation.lineNumber,
        `Registered async function ${operation.functionName}.`,
        {
          transitions: [
            {
              from: "callStack",
              to: "heapMemory",
              task: operation.functionName,
            },
          ],
        },
      );
    } else if (operation.type === "await") {
      const awaitedTask = {
        id: `await-${nextTaskId()}`,
        label: `await continuation (line ${operation.lineNumber})`,
        lineNumber: operation.lineNumber,
        consoleValue: null,
      };
      taskManager.enqueueMicrotask(awaitedTask);
      addStep(
        "microtask-enqueue",
        operation.lineNumber,
        "Await continuation queued.",
        {
          transitions: [
            {
              from: "callStack",
              to: "microtaskQueue",
              task: awaitedTask.label,
            },
          ],
        },
      );
    } else {
      addStep(
        "statement",
        operation.lineNumber,
        `Executed line ${operation.lineNumber}.`,
      );
    }

    taskManager.popStack();
    addStep(
      "stack-pop",
      operation.lineNumber,
      `Pop line ${operation.lineNumber} from Call Stack.`,
    );

    tickTimersDuringSync(SYNC_OPERATION_COST_MS, operation.lineNumber);
  });

  processEventLoop({
    taskManager,
    addStep,
    nextTaskId,
    pendingTimers,
    clock,
  });

  addStep("complete", null, "Simulation completed.");

  return {
    steps,
    finalState: taskManager.snapshot(),
  };
};

module.exports = {
  simulateCode,
};
