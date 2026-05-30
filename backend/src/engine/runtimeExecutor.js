const drainMicrotasks = async (onDrainTurn, maxTurns = 60) => {
  let idleTurns = 0;
  let previousSignal = 0;

  for (let turn = 0; turn < maxTurns; turn += 1) {
    await Promise.resolve();
    const currentSignal = onDrainTurn();
    if (currentSignal === previousSignal) {
      idleTurns += 1;
    } else {
      idleTurns = 0;
      previousSignal = currentSignal;
    }

    if (idleTurns >= 2) {
      break;
    }
  }
};

const executeCodeAndCaptureOutput = async (code) => {
  const consoleOutput = [];
  const runtimeEvents = [];
  const timers = [];
  let nextTimerId = 1;
  let virtualNowMs = 0;
  let phase = "sync";

  const runtimeConsole = {
    log: (...args) => {
      const rendered = args.map((item) => String(item)).join(" ");
      consoleOutput.push(rendered);
      runtimeEvents.push({ type: "console", phase, value: rendered });
    },
  };

  const runtimeSetTimeout = (callback, delay = 0, ...callbackArgs) => {
    if (typeof callback !== "function") {
      throw new TypeError("setTimeout callback must be a function.");
    }
    const safeDelay = Math.max(0, Number(delay) || 0);
    const timer = {
      id: nextTimerId,
      label: `setTimeout callback #${nextTimerId}`,
      dueAtMs: virtualNowMs + safeDelay,
      callback: () => callback(...callbackArgs),
      cleared: false,
    };
    timers.push(timer);
    runtimeEvents.push({
      type: "timer-scheduled",
      timerId: timer.id,
      label: timer.label,
      delayMs: safeDelay,
    });
    nextTimerId += 1;
    return timer.id;
  };

  const runtimeClearTimeout = (id) => {
    const timer = timers.find((item) => item.id === id);
    if (timer) {
      timer.cleared = true;
    }
  };

  const runner = new Function(
    "console",
    "setTimeout",
    "clearTimeout",
    `"use strict";\n${code}`
  );
  runner(runtimeConsole, runtimeSetTimeout, runtimeClearTimeout);

  phase = "microtask";
  await drainMicrotasks(() => consoleOutput.length + timers.filter((t) => !t.cleared).length);
  phase = "idle";

  while (timers.some((timer) => !timer.cleared)) {
    const pending = timers.filter((timer) => !timer.cleared);
    const nextDueAt = Math.min(...pending.map((timer) => timer.dueAtMs));
    virtualNowMs = nextDueAt;
    const nearestRemaining = Math.min(
      ...pending.map((timer) => Math.max(0, timer.dueAtMs - virtualNowMs))
    );
    runtimeEvents.push({
      type: "timer-wait",
      remainingMs: nearestRemaining,
    });

    const dueTimers = pending.filter((timer) => timer.dueAtMs <= virtualNowMs);
    dueTimers.forEach((timer) => {
      timer.cleared = true;
      runtimeEvents.push({
        type: "timer-enqueued",
        timerId: timer.id,
        label: timer.label,
      });
      phase = "callback";
      runtimeEvents.push({
        type: "callback-start",
        timerId: timer.id,
        label: timer.label,
      });
      timer.callback();
      runtimeEvents.push({
        type: "callback-end",
        timerId: timer.id,
        label: timer.label,
      });
      phase = "idle";
    });

    phase = "microtask";
    await drainMicrotasks(() => consoleOutput.length + timers.filter((t) => !t.cleared).length);
    phase = "idle";
  }

  phase = "microtask";
  await drainMicrotasks(() => consoleOutput.length + timers.filter((t) => !t.cleared).length);
  phase = "idle";

  return {
    consoleOutput,
    runtimeEvents,
  };
};

module.exports = {
  executeCodeAndCaptureOutput,
};
