import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const PdfRemove = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [editedPdfUrl, setEditedPdfUrl] = useState(null);
  const [pageNumbers, setPageNumbers] = useState("");
   const [fileName, setFileName] = useState("");

  // Handle file upload
// Handle file upload
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    const arrayBuffer = await file.arrayBuffer();
    setPdfFile(arrayBuffer);
    setEditedPdfUrl(null);
    setFileName(file.name); // ✅ Update filename state here
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
    <>
      {/* ✅ SEO Helmet Section */}
      <Helmet>
        <title>Remove or Extract Pages from PDF Online | Free PDF Editor</title>
        <meta
          name="description"
          content="Easily remove or extract specific pages from your PDF online. 100% free, secure, and browser-based PDF page editor with instant download."
        />
        <meta
          name="keywords"
          content="remove PDF pages, extract PDF pages, delete pages from PDF, PDF editor online, free PDF tool"
        />
        <link rel="canonical" href="https://yourdomain.com/pdf-remove" />
      </Helmet>

      {/* ✅ UI/UX Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg bg-white/20 backdrop-blur-xl shadow-2xl rounded-3xl p-8 flex flex-col items-center space-y-6"
        >
          <h1 className="text-4xl font-extrabold text-white text-center drop-shadow-lg">
            📝 PDF Page Editor
          </h1>
          <p className="text-white/90 text-sm text-center max-w-md">
            Upload your PDF and quickly <strong>remove</strong> or <strong>extract</strong> pages.
            100% free, no signup, works directly in your browser.
          </p>

          {/* File Upload */}
          <label className="w-full cursor-pointer border-2 border-dashed border-white/60 rounded-2xl p-6 text-center text-white hover:border-white transition">
            <span className="block font-medium">📂 Click or Drag & Drop PDF</span>
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
  {/* Show selected file name */}
        {fileName && (
          <p className="text-sm text-gray-700 mt-3 text-center">
            📄 <span className="font-medium">{fileName}</span>
          </p>
        )}
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
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              href={editedPdfUrl}
              download="edited.pdf"
              className="w-full px-4 py-3 rounded-xl bg-green-500 text-white text-center font-semibold shadow hover:bg-green-600 transition"
            >
              ⬇️ Download Edited PDF
            </motion.a>
          )}
        </motion.div>
      </section>

      {/* ✅ SEO Content Section */}
      <section className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
        <h2 className="text-2xl font-bold mb-4">Why Use Our Free PDF Page Editor?</h2>
        <p className="mb-4">
          Our <strong>online PDF page remover and extractor</strong> allows you to edit your PDF documents instantly,
          right in your browser. No software installation, no registration required.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>🔒 100% Secure – files processed only in your browser.</li>
          <li>⚡ Instant Results – remove or extract PDF pages in seconds.</li>
          <li>💻 Works Everywhere – compatible with Windows, Mac, Linux.</li>
          <li>📱 Mobile Friendly – edit PDFs on your phone or tablet.</li>
        </ul>
      </section>
    </>
  );
};

export default PdfRemove;
