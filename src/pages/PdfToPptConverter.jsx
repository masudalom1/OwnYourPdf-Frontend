import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pptxgen from "pptxgenjs";
import { saveAs } from "file-saver";

// Worker for pdf.js
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PdfToPptConverter() {
  const [slidesPreview, setSlidesPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setSlidesPreview([]);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async () => {
      const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
      const previews = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        const imgData = canvas.toDataURL("image/png", 1.0);

        previews.push(imgData);
      }

      setSlidesPreview(previews);
      setLoading(false);
    };
  };

  const downloadPPT = () => {
    if (slidesPreview.length === 0) return;

    let pptx = new pptxgen();

    slidesPreview.forEach((img) => {
      let slide = pptx.addSlide();
      slide.addImage({
        data: img,
        x: 0,
        y: 0,
        w: pptx.width,
        h: pptx.height,
      });
    });

    pptx.writeFile({ fileName: "converted-pdf-to-ppt.pptx" });
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-purple-600">
          📄 PDF to PPT Converter
        </h1>

        {/* File Upload */}
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition">
          <span className="text-gray-600">Click or drag & drop your PDF here</span>
          <input type="file" accept="application/pdf" onChange={handleFileChange} hidden />
        </label>

        {/* Loading */}
        {loading && (
          <div className="text-center mt-4 text-purple-600 animate-pulse">
            ⏳ Converting PDF to PPT...
          </div>
        )}

        {/* Preview */}
        {slidesPreview.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Preview Slides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {slidesPreview.map((img, i) => (
                <div key={i} className="border rounded-lg overflow-hidden shadow">
                  <img src={img} alt={`slide-${i + 1}`} className="w-full object-cover" />
                  <p className="text-center py-2 text-sm text-gray-600">Slide {i + 1}</p>
                </div>
              ))}
            </div>

            {/* Download Button */}
            <button
              onClick={downloadPPT}
              className="mt-6 w-full bg-purple-500 text-white font-semibold py-3 rounded-xl hover:bg-purple-600 transition"
            >
              📥 Download PPT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
