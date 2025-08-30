import React, { useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import html2canvas from "html2canvas";

const CodePreviewer = () => {
  const [code, setCode] = useState(`function add(a, b) {
  return a + b;
}`);
  const [language, setLanguage] = useState("javascript");
  const previewRef = useRef();

  // 📸 Take screenshot
  const handleScreenshot = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { backgroundColor: "#1e1e1e" });
    const link = document.createElement("a");
    link.download = "code-snippet.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 space-y-6 text-white">
      {/* Title */}
      <h1 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
        Code Snippet Previewer
      </h1>
      <p className="text-gray-400 text-sm">Write → Preview → Save as Image</p>

      {/* Input Area */}
      <div className="w-full max-w-2xl space-y-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-40 p-4 border border-gray-700 rounded-xl font-mono text-sm bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          placeholder="Write your code here..."
        />

        {/* Controls */}
        <div className="flex justify-between items-center">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
          </select>

          <button
            onClick={handleScreenshot}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium shadow-lg hover:opacity-90 transition"
          >
            📸 Save as Image
          </button>
        </div>
      </div>

      {/* Preview Card */}
      <div
        ref={previewRef}
        className="rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-[#1e1e1e] w-full max-w-2xl transition transform hover:scale-[1.01]"
      >
        {/* Fake Editor Header */}
        <div className="flex items-center space-x-2 px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="ml-4 text-gray-400 text-sm">Snippet.{language}</span>
        </div>

        {/* Highlighted Code */}
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "20px",
            fontSize: "15px",
            lineHeight: "1.6",
            borderRadius: "0 0 12px 12px",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodePreviewer;
