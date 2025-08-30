import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

const PdfRemove = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [editedPdfUrl, setEditedPdfUrl] = useState(null);
  const [pageNumbers, setPageNumbers] = useState("");

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      setPdfFile(arrayBuffer);
      setEditedPdfUrl(null);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Convert input "1,3,5" → [0,2,4]
  const parsePages = () => {
    return pageNumbers
      .split(",")
      .map((n) => parseInt(n.trim(), 10) - 1)
      .filter((n) => !isNaN(n));
  };

  // Remove selected pages
  const handleRemovePages = async () => {
    if (!pdfFile) {
      alert("Upload a PDF first!");
      return;
    }
    const pdfDoc = await PDFDocument.load(pdfFile);
    const pagesToRemove = parsePages().sort((a, b) => b - a);

    pagesToRemove.forEach((p) => {
      if (p >= 0 && p < pdfDoc.getPageCount()) {
        pdfDoc.removePage(p);
      }
    });

    const pdfBytes = await pdfDoc.save();
    const url = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
    setEditedPdfUrl(url);
  };

  // Extract selected pages
  const handleExtractPages = async () => {
    if (!pdfFile) {
      alert("Upload a PDF first!");
      return;
    }
    const srcDoc = await PDFDocument.load(pdfFile);
    const newDoc = await PDFDocument.create();
    const pagesToExtract = parsePages();

    for (let p of pagesToExtract) {
      if (p >= 0 && p < srcDoc.getPageCount()) {
        const [copiedPage] = await newDoc.copyPages(srcDoc, [p]);
        newDoc.addPage(copiedPage);
      }
    }

    const pdfBytes = await newDoc.save();
    const url = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
    setEditedPdfUrl(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-lg bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-8 flex flex-col items-center space-y-6">
        <h1 className="text-3xl font-extrabold text-white text-center drop-shadow-lg">
          ✨ PDF Page Editor
        </h1>
        <p className="text-white/80 text-sm text-center">
          Upload a PDF and remove or extract specific pages instantly.
        </p>

        {/* File Upload */}
        <label className="w-full cursor-pointer border-2 border-dashed border-white/50 rounded-xl p-6 text-center text-white hover:border-white transition">
          <span className="block">📂 Click or Drag & Drop PDF</span>
          <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
        </label>

        {/* Page input */}
        <input
          type="text"
          placeholder="Enter page numbers (e.g. 1,3,5)"
          value={pageNumbers}
          onChange={(e) => setPageNumbers(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        {/* Action buttons */}
        <div className="flex gap-4 w-full">
          <button
            onClick={handleRemovePages}
            className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
          >
            🗑 Remove Pages
          </button>
          <button
            onClick={handleExtractPages}
            className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition"
          >
            📑 Extract Pages
          </button>
        </div>

        {/* Download link */}
        {editedPdfUrl && (
          <a
            href={editedPdfUrl}
            download="edited.pdf"
            className="w-full px-4 py-3 rounded-xl bg-green-500 text-white text-center font-semibold shadow hover:bg-green-600 transition"
          >
            ⬇️ Download PDF
          </a>
        )}
      </div>
    </div>
  );
};

export default PdfRemove;
