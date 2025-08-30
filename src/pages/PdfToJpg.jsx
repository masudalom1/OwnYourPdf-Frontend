import React, { useState } from "react";
import { jsPDF } from "jspdf";
import mammoth from "mammoth";

export default function WordToPdf() {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setPdfUrl(null);

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Extract text from Word file
      const { value: text } = await mammoth.extractRawText({ arrayBuffer });

      // Generate PDF
      const pdf = new jsPDF();
      const lines = pdf.splitTextToSize(text, 180);
      pdf.text(lines, 15, 20);

      // Create blob and preview link
      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err) {
      alert("Conversion failed!");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 md:p-10">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          📝 Word → PDF Converter
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Upload a Word document (.docx) and instantly convert it into a PDF. 100% frontend, no upload required.
        </p>

        {/* Upload */}
        <div className="flex flex-col items-center">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".docx"
              onChange={handleFile}
              className="hidden"
            />
            <span className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition">
              📂 Choose Word File
            </span>
          </label>
          {fileName && (
            <p className="mt-2 text-sm text-gray-500">
              Selected: <span className="font-medium">{fileName}</span>
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 text-center text-lg font-medium text-blue-600 animate-pulse">
            ⏳ Converting Word to PDF...
          </div>
        )}

        {/* Result */}
        {pdfUrl && (
          <div className="mt-10 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              ✅ Conversion Complete
            </h2>
            <a
              href={pdfUrl}
              download={fileName.replace(".docx", ".pdf")}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl shadow hover:bg-green-700 transition"
            >
              ⬇️ Download PDF
            </a>
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              className="w-full h-96 mt-6 border rounded-lg"
            />
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
