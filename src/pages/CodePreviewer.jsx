import React, { useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import html2canvas from "html2canvas";
import { Helmet } from "react-helmet";

const CodePreviewer = () => {
  const [code, setCode] = useState(`function add(a, b) {
  return a + b;
}`);
  const [language, setLanguage] = useState("javascript");
  const previewRef = useRef();

  // 📸 Take screenshot
  const handleScreenshot = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, {
      backgroundColor: "#1e1e1e",
    });
    const link = document.createElement("a");
    link.download = "code-snippet.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 space-y-6 text-white">
      <Helmet>
        {/* Basic Meta */}
        <title>
          Code Snippet Previewer | Write, Highlight & Save Code as Image
        </title>
        <meta
          name="description"
          content="Write, preview, and save code snippets as high-quality PNG images. Supports JavaScript, Python, Java, C++, C#. 100% browser-based — no signup, no install."
        />
        <meta
          name="keywords"
          content="code previewer, save code as image, code snippet screenshot, syntax highlighter, code to image, snippet previewer online, code image generator"
        />
        <link rel="canonical" href="https://yourdomain.online/CodePreviewer" />

        {/* Open Graph (Social) */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Code Snippet Previewer — Save Code as Image"
        />
        <meta
          property="og:description"
          content="Instantly write and preview code with syntax highlighting, then export your snippet as a high-quality PNG. Supports multiple languages and mobile-friendly."
        />
        <meta
          property="og:url"
          content="https://www.ownyourpdf.online/CodePreviewer"
        />
        <meta
          property="og:image"
          content="https://www.ownyourpdf.online/assets/code-preview-og.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Code Snippet Previewer" />
        <meta
          name="twitter:description"
          content="Create beautiful images of your code snippets for docs, tutorials, and social media. Browser-based and free."
        />
        <meta
          name="twitter:image"
          content="https://www.ownyourpdf.online/CodePreviewerassets/code-preview-og.png"
        />

        {/* Mobile / Favicon */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* JSON-LD FAQ schema to improve chances of rich results */}
        <script type="application/ld+json">{`
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is the Code Snippet Previewer free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes — the previewer is free and works directly in your browser without signup."
          }
        },
        {
          "@type": "Question",
          "name": "Can I save my code as a high-quality image?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes — click 'Save as Image' to export your highlighted code snippet as a PNG."
          }
        },
        {
          "@type": "Question",
          "name": "Which languages does it support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It supports JavaScript, Python, Java, C++, C#, and other common languages supported by Prism syntax highlighting."
          }
        }
      ]
    }
  `}</script>
      </Helmet>

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

      {/* SEO Content */}
      <div className="max-w-3xl mx-auto mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Free Online Code Snippet Previewer — Save Code as Image
        </h2>

        <p className="mb-4 text-lg leading-relaxed text-white/90">
          Instantly preview and export beautiful images of your code with our{" "}
          <strong>Code Snippet Previewer</strong>. Write or paste your code,
          choose the language for syntax highlighting, and click{" "}
          <strong>Save as Image</strong> to download a high-quality PNG —
          perfect for documentation, tutorials, social posts, and slide decks.
        </p>

        <h3 className="text-xl font-semibold mb-2">Key Features</h3>
        <ul className="list-disc list-inside mb-4 text-white/90 space-y-1">
          <li>
            ✅ Syntax highlighting for JavaScript, Python, Java, C++, C#, and
            more
          </li>
          <li>✅ High-quality PNG export of your highlighted snippet</li>
          <li>✅ Lightweight, browser-based — no signup or backend uploads</li>
          <li>
            ✅ Customizable preview (language selector, monospace font, clean
            dark theme)
          </li>
          <li>
            ✅ Perfect for sharing code on social media, blogs, or documentation
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">How to Use</h3>
        <ol className="list-decimal list-inside mb-4 text-white/90 space-y-1">
          <li>Paste or type your code into the editor textarea.</li>
          <li>
            Select the correct programming language from the dropdown for proper
            highlighting.
          </li>
          <li>
            Click <strong>📸 Save as Image</strong> to generate and download a
            PNG of your snippet.
          </li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Why Developers Love It</h3>
        <p className="mb-4 text-white/90">
          This tool makes it fast to produce readable, attractive code images
          for tutorials, PRs, slides, or social posts. Because rendering happens
          locally in your browser, your code never leaves your device — keeping
          your snippets private and secure.
        </p>

        <h3 className="text-xl font-semibold mb-2">Common Use Cases</h3>
        <ul className="list-disc list-inside mb-4 text-white/90 space-y-1">
          <li>
            Share highlighted examples on Twitter, LinkedIn, or dev forums.
          </li>
          <li>
            Include code screenshots in tutorials, blog posts, and
            documentation.
          </li>
          <li>Create visual code cards for presentations and design assets.</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">FAQs</h3>
        <div className="space-y-4 text-white/90">
          <div>
            <h4 className="font-semibold">
              Is this Code Snippet Previewer free?
            </h4>
            <p>
              Yes — the previewer is completely free to use and runs fully in
              your browser.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Do I need to install anything?</h4>
            <p>
              No installation required. The tool is browser-based and works
              instantly without sign-up.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Which languages are supported?</h4>
            <p>
              We support popular languages like JavaScript, Python, Java, C++,
              and C#. The highlighter covers many more languages common in docs
              and tutorials.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">
              What format is the exported image?
            </h4>
            <p>
              Images are exported as high-quality PNG files suitable for web and
              print.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Is my code private?</h4>
            <p>
              Yes — conversion and rendering happen locally in your browser;
              nothing is uploaded to any server.
            </p>
          </div>
        </div>

        <p className="text-center text-white/80 mt-6">
          Try the Code Snippet Previewer now — create beautiful code images in
          seconds.
        </p>
      </div>
    </div>
  );
};

export default CodePreviewer;
