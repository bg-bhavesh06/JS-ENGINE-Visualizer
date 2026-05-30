const {
  refreshWebApiTimers,
  enqueueDueTimers,
  getNearestRemainingMs,
  getNextReadyAtMs,
} = require("./timers");
const BACKGROUND_TASK_COST_MS = 1;

const getCountdownFrames = (deltaMs) => {
  if (deltaMs <= 0) return [0];
  const frameCount = deltaMs >= 1000 ? Math.min(8, Math.ceil(deltaMs / 1000)) : 3;
  const frames = [];
  for (let index = 1; index <= frameCount; index += 1) {
    frames.push(Math.max(0, Math.round((deltaMs * index) / frameCount)));
  }
  if (frames[frames.length - 1] !== deltaMs) {
    frames.push(deltaMs);
  }
  return frames;
};

const tickBackgroundTimers = ({ taskManager, addStep, pendingTimers, clock, lineNumber }) => {
  if (!pendingTimers.length) {
    return;
  }

  clock.nowMs += BACKGROUND_TASK_COST_MS;
  refreshWebApiTimers({ taskManager, pendingTimers, nowMs: clock.nowMs });
  enqueueDueTimers({
    taskManager,
    addStep,
    pendingTimers,
    nowMs: clock.nowMs,
    message: "Timer finished and callback moved to Callback Queue.",
    lineNumber,
  });
};

const drainMicrotasks = ({ taskManager, addStep, pendingTimers, clock }) => {
  while (taskManager.microtaskQueue.length > 0) {
    const task = taskManager.dequeueMicrotask();
    taskManager.pushStack(task.label);
    addStep("event-loop", task.lineNumber, `Executing microtask: ${task.label}`, {
      activeEventLoop: true,
      transitions: [{ from: "microtaskQueue", to: "callStack", task: task.label }],
    });

    if (task.consoleValue != null) {
      taskManager.writeConsole(task.consoleValue);
      addStep("console", task.lineNumber, `console.log("${task.consoleValue}")`, {
        transitions: [{ from: "callStack", to: "consoleOutput", task: task.label }],
      });
    }

    taskManager.popStack();
    addStep("stack-pop", task.lineNumber, `Finished microtask: ${task.label}`);
    tickBackgroundTimers({
      taskManager,
      addStep,
      pendingTimers,
      clock,
      lineNumber: task.lineNumber,
    });
  }
};

const executeOneCallback = ({ taskManager, addStep, pendingTimers, clock }) => {
  if (taskManager.callbackQueue.length === 0) {
    return false;
  }

  const task = taskManager.dequeueCallback();
  taskManager.pushStack(task.label);
  addStep("event-loop", task.lineNumber, `Executing callback: ${task.label}`, {
    activeEventLoop: true,
    transitions: [{ from: "callbackQueue", to: "callStack", task: task.label }],
  });

  if (task.consoleValue != null) {
    taskManager.writeConsole(task.consoleValue);
    addStep("console", task.lineNumber, `console.log("${task.consoleValue}")`, {
      transitions: [{ from: "callStack", to: "consoleOutput", task: task.label }],
    });
  }

  taskManager.popStack();
  addStep("stack-pop", task.lineNumber, `Finished callback: ${task.label}`);
  tickBackgroundTimers({
    taskManager,
    addStep,
    pendingTimers,
    clock,
    lineNumber: task.lineNumber,
  });
  return true;
};

const advanceTimers = ({ taskManager, addStep, pendingTimers, clock }) => {
  if (!pendingTimers.length) {
    return;
  }

  const nextReadyAtMs = getNextReadyAtMs(pendingTimers);
  const deltaMs = Math.max(0, nextReadyAtMs - clock.nowMs);
  const frames = getCountdownFrames(deltaMs);
  let previousElapsed = 0;

  frames.forEach((elapsedAtFrame) => {
    const elapsedDelta = Math.max(0, elapsedAtFrame - previousElapsed);
    previousElapsed = elapsedAtFrame;
    clock.nowMs += elapsedDelta;

    refreshWebApiTimers({ taskManager, pendingTimers, nowMs: clock.nowMs });
    const nearestRemaining = getNearestRemainingMs(pendingTimers);

    addStep("timer-wait", null, `Timers waiting in Web APIs: ${nearestRemaining}ms`, {
      activeEventLoop: false,
    });
  });

  enqueueDueTimers({ taskManager, addStep, pendingTimers, nowMs: clock.nowMs });
};

const processEventLoop = ({
  taskManager,
  addStep,
  nextTaskId,
  pendingTimers = [],
  clock = { nowMs: 0 },
}) => {
  while (
    taskManager.microtaskQueue.length > 0 ||
    taskManager.callbackQueue.length > 0 ||
    pendingTimers.length > 0
  ) {
    drainMicrotasks({ taskManager, addStep, pendingTimers, clock });

    if (executeOneCallback({ taskManager, addStep, pendingTimers, clock })) {
      continue;
    }

    if (pendingTimers.length > 0) {
      advanceTimers({ taskManager, addStep, pendingTimers, clock });
    }
  }

  const idleTaskId = nextTaskId();
  addStep("idle", null, "Event loop idle.", {
    taskId: idleTaskId,
    activeEventLoop: false,
  });
};

module.exports = {
  processEventLoop,
};
