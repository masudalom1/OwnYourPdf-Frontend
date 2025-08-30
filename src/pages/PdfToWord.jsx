import React, { useState } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle PDF upload + preview
  const handleFile = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setDownloadUrl(null);

    // Preview first page
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

  // Convert to Word
  const handleConvert = async () => {
    if (!file) {
      alert("Please select a PDF file first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await axios.post("http://localhost:5000/pdf-to-word", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      setDownloadUrl(url);
    } catch (error) {
      alert("Conversion failed, try again!");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">PDF → Word Converter</h1>

      {/* STEP 1: Upload PDF */}
      {!file && (
        <label className="cursor-pointer">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="hidden"
          />
          <span className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-700 transition">
            📂 Choose PDF File
          </span>
        </label>
      )}

         {/* STEP 3: Download */}
      {downloadUrl && (
        <div className="flex flex-col items-center mt-6">
          <p className="mb-4 text-green-600 font-medium">
            ✅ Conversion successful!
          </p>
          <a
            href={downloadUrl}
            download="converted.docx"
            className="px-8 py-3 bg-purple-600 text-white text-lg rounded-lg shadow hover:bg-purple-700 transition"
          >
            ⬇️ Download Word File
          </a>
        </div>
      )}

      {/* STEP 2: Preview */}
      {file && preview && (
        <div className="mt-4 flex flex-col items-center">
          <p className="font-medium mb-2">Preview (First Page)</p>
          <img
            src={preview}
            alt="Preview"
            className="w-[300px] border rounded-lg shadow"
          />

          <button
            onClick={handleConvert}
            disabled={loading}
            className={`mt-6 px-8 py-3 ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white text-lg rounded-lg shadow transition`}
          >
            {loading ? "⏳ Converting..." : "⚡ Convert to Word"}
          </button>
        </div>
      )}

   
    </div>
  );
}
