import React, { useState } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false); // splitting state
  const [previewLoading, setPreviewLoading] = useState(false); // NEW: preview state
  const [fileName, setFileName] = useState("");

  // Handle PDF selection
  const handleFile = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setFileName(selected.name);
    setDownloadUrl(null);
    setPages([]);
    setPreviewLoading(true); // start preview loading
    await generatePreviews(selected);
    setPreviewLoading(false); // stop preview loading
  };

  // Generate all page previews
  const generatePreviews = async (pdfFile) => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const previews = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.25 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
      previews.push({ pageNumber: i, url: canvas.toDataURL() });
    }

    setPages(previews);
    setSelectedPages([]);
  };

  // Toggle page selection
  const togglePage = (pageNum) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum)
        ? prev.filter((p) => p !== pageNum)
        : [...prev, pageNum]
    );
  };

  // Split selected pages
  const handleSplit = async () => {
    if (!file || selectedPages.length === 0) {
      alert("Please select at least one page");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("pages", JSON.stringify(selectedPages));

    const res = await axios.post("https://own-your-pdf-backend.vercel.app/split", formData, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    setDownloadUrl(url);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-10">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
          ✂️ Split PDF
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Upload a PDF → Select pages → Download a new file.
        </p>

        {/* Upload */}
        {!file && (
          <div className="flex flex-col items-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFile}
                className="hidden"
              />
              <span className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition">
                📂 Choose PDF File
              </span>
            </label>
          </div>
        )}
        {fileName && !downloadUrl && (
          <p className="mt-2 text-sm text-gray-500 text-center">
            Selected: <span className="font-medium">{fileName}</span>
          </p>
        )}

        {/* Loading Preview */}
        {previewLoading && (
          <div className="mt-8 text-center text-lg font-medium text-blue-600 animate-pulse">
            ⏳ Loading pages...
          </div>
        )}

        {/* Page Selection */}
        {file && !downloadUrl && !previewLoading && pages.length > 0 && (
          <div className="mt-6">
            <p className="mb-4 text-gray-700 font-medium text-center">
              Click on pages you want to extract:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[420px] overflow-y-auto border rounded-xl p-4">
              {pages.map((page) => (
                <div
                  key={page.pageNumber}
                  className={`relative border-2 rounded-lg cursor-pointer transition ${
                    selectedPages.includes(page.pageNumber)
                      ? "border-green-600 shadow-lg"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                  onClick={() => togglePage(page.pageNumber)}
                >
                  <img
                    src={page.url}
                    alt={`Page ${page.pageNumber}`}
                    className="w-full rounded"
                  />
                  <p className="text-center text-sm mt-1 text-gray-600">
                    Page {page.pageNumber}
                  </p>
                  {selectedPages.includes(page.pageNumber) && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleSplit}
                disabled={loading}
                className={`px-8 py-3 rounded-xl text-lg font-medium shadow transition ${
                  loading
                    ? "bg-gray-400 text-gray-200"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {loading ? "⏳ Splitting..." : "✂️ Split Selected Pages"}
              </button>
            </div>
          </div>
        )}

        {/* Download */}
        {downloadUrl && (
          <div className="mt-10 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              ✅ Split Complete
            </h2>
            <a
              href={downloadUrl}
              download="split.pdf"
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl shadow hover:bg-green-700 transition"
            >
              ⬇️ Download PDF
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-gray-500 text-sm">
        Built with ❤️ | Fully browser-based
      </p>
    </div>
  );
}
