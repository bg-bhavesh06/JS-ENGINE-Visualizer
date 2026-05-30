class TaskManager {
  constructor() {
    this.callStack = [];
    this.webAPIs = [];
    this.heapMemory = [];
    this.microtaskQueue = [];
    this.callbackQueue = [];
    this.consoleOutput = [];
  }

  snapshot() {
    return {
      callStack: [...this.callStack],
      webAPIs: [...this.webAPIs],
      heapMemory: [...this.heapMemory],
      microtaskQueue: [...this.microtaskQueue],
      callbackQueue: [...this.callbackQueue],
      consoleOutput: [...this.consoleOutput],
    };
  }

  pushStack(frame) {
    this.callStack.push(frame);
  }

  popStack() {
    return this.callStack.pop();
  }

  addWebAPI(task) {
    this.webAPIs.push(task);
  }

  updateWebAPI(taskId, updates) {
    this.webAPIs = this.webAPIs.map((task) => {
      if (task.id !== taskId) {
        return task;
      }
      return { ...task, ...updates };
    });
  }

  removeWebAPI(taskId) {
    this.webAPIs = this.webAPIs.filter((task) => task.id !== taskId);
  }

  enqueueMicrotask(task) {
    this.microtaskQueue.push(task);
  }

  dequeueMicrotask() {
    return this.microtaskQueue.shift();
  }

  enqueueCallback(task) {
    this.callbackQueue.push(task);
  }

  dequeueCallback() {
    return this.callbackQueue.shift();
  }

  addHeapReference(reference) {
    if (!this.heapMemory.includes(reference)) {
      this.heapMemory.push(reference);
    }
  }

  writeConsole(value) {
    this.consoleOutput.push(String(value));
  }
}

module.exports = {
  TaskManager,
};
