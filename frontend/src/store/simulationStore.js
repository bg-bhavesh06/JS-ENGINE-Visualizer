export const defaultCode = `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`;

export const emptyEngineState = {
  callStack: [],
  webAPIs: [],
  heapMemory: [],
  microtaskQueue: [],
  callbackQueue: [],
  consoleOutput: [],
};

export const speedToInterval = (speed) => {
  const clamped = Math.max(1, Math.min(10, Number(speed) || 5));
  return 2400 - clamped * 200;
};
