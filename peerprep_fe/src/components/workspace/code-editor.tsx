import { handleRunCode } from "../../app/actions/editor";
import { useAuth } from "../../contexts/auth-context";
import { Language, useEditor } from "../../contexts/editor-context";
import { Editor } from "@monaco-editor/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { MonacoBinding } from "y-monaco";

const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
};

type CodeEditorProps = {
  roomId: string;
};

const gatewayServiceURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_GATEWAY_SERVICE_URL
    : "localhost:5003";

const CodeEditor: React.FC<CodeEditorProps> = ({ roomId }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>();
  const [output, setOutput] = useState<string>("");
  const { token } = useAuth();
  const { code, setCode, language, setLanguage } = useEditor();
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] = useState<any | null>(null);
  const [binding, setBinding] = useState<MonacoBinding | null>(null);
  const [provider, setProvider] = useState<SocketIOProvider | null>(null);

  useEffect(() => {
    if (!!ydoc && !provider) {
      console.log("setting providers");
      const socketIOProvider = new SocketIOProvider(
        gatewayServiceURL,
        roomId,
        ydoc,
        {
          autoConnect: true,
          // disableBc: true,
          auth: { token: "valid-token" },
        }
      );
      socketIOProvider.awareness.setLocalState({
        id: Math.random(),
        name: "Perico",
      });
      socketIOProvider.on("sync", (isSync: boolean) =>
        console.log("websocket sync", isSync)
      );
      setProvider(socketIOProvider);
    }
  }, [ydoc, provider]);

  useEffect(() => {
    if (provider == null || editor == null) {
      return;
    }
    console.log("reached", provider);
    const binding = new MonacoBinding(
      ydoc.getText(),
      editor.getModel()!,
      new Set([editor]),
      provider?.awareness
    );
    setBinding(binding);
    return () => {
      binding.destroy();
    };
  }, [ydoc, provider, editor]);

  const onMount = (editor: any) => {
    setEditor(editor);
  };

  const onSelect = (language: Language) => {
    setLanguage(language);
    setCode(CODE_SNIPPETS[language]);
  };

  const runCode = async () => {
    const code = editorRef?.current?.getValue();
    try {
      const result = await handleRunCode(code, language, token);
      if (!result.error) {
        setOutput(result.output);
      } else {
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="inline-flex flex-col p-2 bg-slate-800 rounded-lg shadow-sm h-full w-full">
      <select
        name="language"
        className="bg-slate-200 dark:bg-slate-700 rounded-lg w-full py-2 px-4 mb-2 focus:outline-none"
        value={language}
        onChange={(e) => onSelect(e.target.value as Language)}
      >
        {Object.values(Language).map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>

      <Editor
        options={{ minimap: { enabled: false } }}
        theme="vs-dark"
        language={language}
        value={code}
        onMount={onMount}
      />

      <button
        onClick={runCode}
        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Run Code
      </button>

      {output && (
        <div className="mt-2 bg-gray-900 text-white p-2 rounded">
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
