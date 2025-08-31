import React, { useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Helmet } from "react-helmet";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [step, setStep] = useState(1);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // File selection
  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    generatePreviews(selected);
  };

  // Generate preview images
  const generatePreviews = async (pdfFiles) => {
    const urls = [];
    for (let file of pdfFiles) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        urls.push(canvas.toDataURL());
      } catch {
        urls.push(null);
      }
    }
    setPreviews(urls);
  };

  // Drag + drop reorder
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedFiles = Array.from(files);
    const reorderedPreviews = Array.from(previews);

    const [movedFile] = reorderedFiles.splice(result.source.index, 1);
    const [movedPreview] = reorderedPreviews.splice(result.source.index, 1);

    reorderedFiles.splice(result.destination.index, 0, movedFile);
    reorderedPreviews.splice(result.destination.index, 0, movedPreview);

    setFiles(reorderedFiles);
    setPreviews(reorderedPreviews);
  };

  // Merge handler
  const handleMerge = async () => {
    if (files.length === 0) return;
    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("pdfs", file));

    const res = await axios.post(
      "https://own-your-pdf-backend.vercel.app/merge",
      formData,
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    setDownloadUrl(url);
    setStep(3);
    setLoading(false);
  };

  return (
    <main>
      <Helmet>
        <title>Merge PDF Online | Free PDF Combiner Tool</title>
        <meta
          name="description"
          content="Merge multiple PDF files into one document instantly. Free, secure, browser-based PDF combiner tool. Upload, reorder, and download merged PDFs online."
        />
        <meta
          name="keywords"
          content="merge pdf, pdf combiner, combine pdf online, free pdf merge, merge pdf files, join pdfs, pdf tools, online pdf merger"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ownyourpdf.online/merge-pdf" />
        <meta
          property="og:title"
          content="Merge PDF Online | Free PDF Combiner Tool"
        />
        <meta
          property="og:description"
          content="Easily merge multiple PDF files into a single document. 100% free, secure, and browser-based tool."
        />
        <meta
          property="og:url"
          content="https://www.ownyourpdf.online/merge-pdf"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.ownyourpdf.online/seo-merge-pdf.png"
        />

        <script type="application/ld+json">
          {`
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Merge PDF Online",
      "url": "https://www.ownyourpdf.online/merge-pdf",
      "applicationCategory": "Utility",
      "operatingSystem": "All",
      "description": "Free online tool to merge multiple PDF files securely in your browser. Upload, reorder, and download merged PDFs instantly.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      }
    }
    `}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-10">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
            🔄 Merge PDF Files
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Upload multiple PDF files, reorder them, and merge into a single
            file.
          </p>

          {/* STEP 1: Choose Files */}
          {step === 1 && (
            <div className="flex flex-col items-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={handleFiles}
                  className="hidden"
                />
                <span className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition">
                  📂 Choose PDF Files
                </span>
              </label>

              {files.length > 0 && (
                <button
                  onClick={() => setStep(2)}
                  className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
                >
                  Next ➡️
                </button>
              )}
            </div>
          )}

          {/* STEP 2: Reorder + Merge */}
          {step === 2 && (
            <div>
              <p className="mb-4 font-medium text-gray-700 text-center">
                {files.length} file(s) selected. Drag to reorder before merging:
              </p>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="pdfList" direction="horizontal">
                  {(provided) => (
                    <div
                      className="flex gap-4 overflow-x-auto pb-4 border rounded-xl p-4"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {files.map((file, index) => (
                        <Draggable
                          key={file.name}
                          draggableId={file.name}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="w-36 flex-shrink-0 bg-white shadow rounded-lg p-3 flex flex-col items-center border hover:shadow-lg transition"
                            >
                              {previews[index] ? (
                                <img
                                  src={previews[index]}
                                  alt="preview"
                                  className="w-full h-40 object-contain mb-2 rounded"
                                />
                              ) : (
                                <div className="w-full h-40 flex items-center justify-center bg-gray-100 text-gray-500 rounded">
                                  No Preview
                                </div>
                              )}
                              <p className="text-xs text-center truncate w-full">
                                {file.name}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handleMerge}
                  disabled={loading}
                  className={`px-8 py-3 rounded-xl text-lg font-medium shadow transition ${
                    loading
                      ? "bg-gray-400 text-gray-200"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {loading ? "⏳ Merging..." : "🔄 Merge PDFs"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Download */}
          {step === 3 && downloadUrl && (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                ✅ Merge Complete
              </h2>
              <a
                href={downloadUrl}
                download="merged.pdf"
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-xl shadow hover:bg-purple-700 transition"
              >
                ⬇️ Download Merged PDF
              </a>
            </div>
          )}
        </div>
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6 md:p-10 mt-12 text-gray-700">
          <h2 className="text-2xl font-bold text-center mb-4">
            Free Online PDF Merger
          </h2>
          <p className="text-center mb-6">
            Our <strong>Merge PDF Tool</strong> allows you to quickly combine
            multiple PDF files into a single document. 100% free, secure, and
            browser-based — no installation or sign-up required.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-disc list-inside max-w-2xl mx-auto text-left">
            <li>✅ Merge unlimited PDF files for free</li>
            <li>✅ Secure — files stay in your browser</li>
            <li>✅ Works on all devices (PC, Mac, iOS, Android)</li>
            <li>✅ Simple drag-and-drop interface</li>
          </ul>
          <p className="mt-6 text-center">
            Whether it’s reports, invoices, ebooks, or notes — merge your PDFs
            in seconds with our easy-to-use online PDF combiner.
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-gray-500 text-sm">
          Built with ❤️ | Fully browser-based
        </p>
      </div>
    </main>
  );
}
