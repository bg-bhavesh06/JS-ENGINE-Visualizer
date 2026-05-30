const cleanValue = (raw) => {
  const value = (raw || "").trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
};

const parseConsoleFromCallback = (callbackSource) => {
  const match = callbackSource.match(/console\.log\s*\(([\s\S]*?)\)\s*;?/);
  if (!match) {
    return null;
  }
  return cleanValue(match[1]);
};

const parseCode = (code) => {
  const lines = code.split(/\r?\n/);
  const operations = [];

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    const lineNumber = index + 1;

    if (!line || line.startsWith("//")) {
      return;
    }

    const consoleMatch = line.match(/^console\.log\s*\(([\s\S]*?)\)\s*;?$/);
    if (consoleMatch) {
      operations.push({
        type: "console",
        lineNumber,
        raw: line,
        value: cleanValue(consoleMatch[1]),
      });
      return;
    }

    const timeoutMatch = line.match(
      /^setTimeout\s*\(\s*(.+)\s*,\s*(\d+)\s*\)\s*;?$/
    );
    if (timeoutMatch) {
      operations.push({
        type: "setTimeout",
        lineNumber,
        raw: line,
        delay: Number(timeoutMatch[2]),
        callbackLogValue: parseConsoleFromCallback(timeoutMatch[1]),
      });
      return;
    }

    const promiseMatch = line.match(
      /^Promise(?:\.resolve\(\))?\.then\s*\(\s*(.+)\s*\)\s*;?$/
    );
    const resolvedThenMatch = line.match(
      /^Promise\.resolve\s*\([\s\S]*?\)\.then\s*\(\s*(.+)\s*\)\s*;?$/
    );
    const thenCallback = promiseMatch?.[1] || resolvedThenMatch?.[1];
    if (thenCallback) {
      operations.push({
        type: "promiseThen",
        lineNumber,
        raw: line,
        callbackLogValue: parseConsoleFromCallback(thenCallback),
      });
      return;
    }

    const awaitMatch = line.match(/^await\s+(.+)\s*;?$/);
    if (awaitMatch) {
      operations.push({
        type: "await",
        lineNumber,
        raw: line,
      });
      return;
    }

    const asyncFnMatch = line.match(/^async\s+function\s+([A-Za-z_$][\w$]*)/);
    if (asyncFnMatch) {
      operations.push({
        type: "asyncFunctionDeclaration",
        lineNumber,
        raw: line,
        functionName: asyncFnMatch[1],
      });
      return;
    }

    operations.push({
      type: "statement",
      lineNumber,
      raw: line,
    });
  });

  return operations;
};

module.exports = {
  parseCode,
};
