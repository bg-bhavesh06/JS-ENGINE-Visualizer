import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 15,
  lineNumbers: "on",
  scrollBeyondLastLine: false,
  wordWrap: "on",
  automaticLayout: true,
};

const CodeEditor = ({ code, onChange, activeLine, onValidate }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationIds = useRef([]);

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) {
      return;
    }

    const monaco = monacoRef.current;
    if (!activeLine) {
      decorationIds.current = editorRef.current.deltaDecorations(
        decorationIds.current,
        [],
      );
      return;
    }

    decorationIds.current = editorRef.current.deltaDecorations(
      decorationIds.current,
      [
        {
          range: new monaco.Range(activeLine, 1, activeLine, 1),
          options: {
            isWholeLine: true,
            className: "active-line-decoration",
            glyphMarginClassName: "active-line-glyph",
          },
        },
      ],
    );
    editorRef.current.revealLineInCenter(activeLine);
  }, [activeLine]);

  return (
    <div
      className="engine-panel p-2 h-100 flex-grow-1"
      style={{ minHeight: 0 }}
    >
      <h3 className="engine-title px-2 pt-2 mb-2">Code Editor</h3>
      <div className="flex-grow-1" style={{ minHeight: 0 }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => onChange(value || "")}
          onValidate={onValidate}
          options={editorOptions}
          theme="vs-dark"
          onMount={handleMount}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
