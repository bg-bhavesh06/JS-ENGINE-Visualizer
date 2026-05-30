const refreshWebApiTimers = ({ taskManager, pendingTimers, nowMs }) => {
  pendingTimers.forEach((timer) => {
    const remainingMs = Math.max(0, timer.readyAtMs - nowMs);
    timer.remainingMs = remainingMs;
    taskManager.updateWebAPI(timer.id, { remainingMs });
  });
};

const enqueueDueTimers = ({
  taskManager,
  addStep,
  pendingTimers,
  nowMs,
  message,
  lineNumber,
}) => {
  const dueTimers = pendingTimers.filter((timer) => timer.readyAtMs <= nowMs);
  dueTimers.forEach((timer) => {
    taskManager.removeWebAPI(timer.id);
    taskManager.enqueueCallback(timer.task);
    addStep(
      "callback-enqueue",
      lineNumber || timer.task.lineNumber,
      message || "Timer callback queued.",
      {
        activeLine: null,
        transitions: [{ from: "webAPIs", to: "callbackQueue", task: timer.task.label }],
      }
    );
  });

  for (let index = pendingTimers.length - 1; index >= 0; index -= 1) {
    if (pendingTimers[index].readyAtMs <= nowMs) {
      pendingTimers.splice(index, 1);
    }
  }

  return dueTimers.length;
};

const getNearestRemainingMs = (pendingTimers) => {
  if (!pendingTimers.length) {
    return 0;
  }
  return Math.min(...pendingTimers.map((timer) => timer.remainingMs));
};

const getNextReadyAtMs = (pendingTimers) => {
  if (!pendingTimers.length) {
    return 0;
  }
  return Math.min(...pendingTimers.map((timer) => timer.readyAtMs));
};

module.exports = {
  refreshWebApiTimers,
  enqueueDueTimers,
  getNearestRemainingMs,
  getNextReadyAtMs,
};
