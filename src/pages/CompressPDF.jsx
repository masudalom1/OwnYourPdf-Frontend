import React, { useState } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function CompressPDF() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file input
  const handleFile = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setDownloadUrl(null);

    // Generate preview of first page
    const arrayBuffer = await selected.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    setPreview(canvas.toDataURL());
  };

  // Compress PDF
  const handleCompress = async () => {
    if (!file) {
      alert("Please select a PDF first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await axios.post("https://own-your-pdf-backend.vercel.app/compress", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      setDownloadUrl(url);
    } catch (error) {
      alert("Compression failed, try again!");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 md:p-10">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          ⚡ Compress PDF
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Reduce the file size of your PDF while keeping quality intact.
        </p>

        {/* STEP 1: Upload PDF */}
        {!file && (
          <div className="flex justify-center">
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

        {/* STEP 2: Preview */}
        {file && preview && (
          <div className="flex flex-col items-center">
            <p className="font-medium mb-3 text-gray-700">
              Preview (First Page)
            </p>
            <img
              src={preview}
              alt="Preview"
              className="w-[300px] border rounded-lg shadow mb-4"
            />

            <button
              onClick={handleCompress}
              disabled={loading}
              className={`px-8 py-3 rounded-xl text-lg font-medium shadow transition ${
                loading
                  ? "bg-gray-400 text-gray-200"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? "⏳ Compressing..." : "⚡ Compress PDF"}
            </button>
          </div>
        )}

        {/* STEP 3: Download */}
        {downloadUrl && (
          <div className="text-center mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              ✅ Compression Complete
            </h2>
            <a
              href={downloadUrl}
              download="compressed.pdf"
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-xl shadow hover:bg-purple-700 transition"
            >
              ⬇️ Download Compressed PDF
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
