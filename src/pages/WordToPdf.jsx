import React, { useState } from "react";

export default function WordToPdf() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".docx")) {
      alert("Please upload a valid .docx file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("word", file);

    try {
      const res = await fetch("http://localhost:5000/word-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Conversion failed");

      const blob = await res.blob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Error converting Word:", err);
      alert("Error converting Word to PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Word to PDF Converter</h2>
      <input type="file" accept=".docx" onChange={handleFileChange} />

      {loading && <p className="mt-2 text-blue-600">Converting...</p>}

      {pdfUrl && (
        <div className="mt-4">
          <a
            href={pdfUrl}
            download="converted.pdf"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Download PDF
          </a>
          <iframe
            src={pdfUrl}
            title="Preview"
            width="100%"
            height="500px"
            className="mt-2 border"
          />
        </div>
      )}
    </div>
  );
}
