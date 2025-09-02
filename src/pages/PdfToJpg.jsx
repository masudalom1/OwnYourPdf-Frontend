// File: ConvertPdfToJpg.jsx
import React, { useState, useMemo } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Helmet } from "react-helmet";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function ConvertPdfToJpg() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [pages, setPages] = useState([]); // [{pageNumber, dataUrl, blob}]
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [scale, setScale] = useState(1.0); // render scale
  const [quality, setQuality] = useState(0.92); // JPEG quality
  const [selectedPages, setSelectedPages] = useState([]); // numbers

  const baseName = useMemo(() => {
    const n = fileName.replace(/\.pdf$/i, "");
    return n || "document";
  }, [fileName]);

  // Handle file input
  const handleFile = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a PDF file.");
      return;
    }
    setFile(selected);
    setFileName(selected.name);
    setPages([]);
    setSelectedPages([]);
    setProgress({ current: 0, total: 0 });
  };

  // Render all pages to JPG (browser only)
  const generateImages = async () => {
    if (!file) {
      alert("Please choose a PDF first.");
      return;
    }
    setLoading(true);
    setPages([]);
    setProgress({ current: 0, total: 0 });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const total = pdf.numPages;
      setProgress({ current: 0, total });

      const out = [];
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: scale }); // user scale

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: false });

        // Make width/height integral to avoid blurry output at times
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({ canvasContext: ctx, viewport }).promise;

        // Convert canvas to JPEG Blob (quality controlled)
        const blob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
        );
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        out.push({ pageNumber: i, dataUrl, blob });

        setProgress({ current: i, total });
      }
      setPages(out);
      setSelectedPages(out.map((p) => p.pageNumber)); // select all by default
    } catch (err) {
      console.error(err);
      alert("Failed to convert PDF. Please try again or use a smaller file.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (n) => {
    setSelectedPages((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  };

  const selectAll = () => setSelectedPages(pages.map((p) => p.pageNumber));
  const clearSelection = () => setSelectedPages([]);

  const downloadOne = (p) => {
    const a = document.createElement("a");
    a.href = p.dataUrl;
    a.download = `${baseName}-page-${p.pageNumber}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadAllZip = async () => {
    if (selectedPages.length === 0) {
      alert("Please select at least one page.");
      return;
    }
    const zip = new JSZip();
    const folder = zip.folder(baseName || "images");
    // Keep order by page number
    const selected = pages
      .filter((p) => selectedPages.includes(p.pageNumber))
      .sort((a, b) => a.pageNumber - b.pageNumber);

    selected.forEach((p) => {
      const fileName = `${baseName}-page-${String(p.pageNumber).padStart(3, "0")}.jpg`;
      folder.file(fileName, p.blob);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${baseName}-jpg.zip`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center p-6">
      {/* ✅ SEO Helmet */}
      <Helmet>
        <title>PDF to JPG Online Free | Convert PDF Pages to Images Instantly</title>
        <meta
          name="description"
          content="Convert PDF to JPG online, free and secure. Render high-quality JPG images from PDF pages in your browser. No signup, no watermark."
        />
        <meta
          name="keywords"
          content="pdf to jpg, convert pdf to jpg, pdf to image, pdf converter, export pdf as jpg, pdf to jpeg online"
        />
        <link rel="canonical" href="https://ownyourpdf.online/pdf-to-jpg" />

        {/* Open Graph */}
        <meta property="og:title" content="PDF to JPG Online Free | OwnYourPDF" />
        <meta
          property="og:description"
          content="Fast, secure, and free PDF to JPG converter. Works fully in your browser — no uploads."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ownyourpdf.online/pdf-to-jpg" />
        <meta property="og:image" content="https://ownyourpdf.online/og-pdf-to-jpg.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PDF to JPG Online Free" />
        <meta
          name="twitter:description"
          content="Convert PDF pages to JPG images instantly in your browser."
        />
        <meta name="twitter:image" content="https://ownyourpdf.online/og-pdf-to-jpg.jpg" />

        {/* FAQ Schema for rich results */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is this PDF to JPG tool free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, the converter is completely free and fully browser-based."
                }
              },
              {
                "@type": "Question",
                "name": "Do my files get uploaded?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Conversion happens locally in your browser using WebAssembly and Canvas. Your files never leave your device."
                }
              },
              {
                "@type": "Question",
                "name": "Can I download all JPGs at once?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. After conversion you can download individual pages or all images as a ZIP."
                }
              }
            ]
          }
        `}</script>
      </Helmet>

      {/* Card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 md:p-10">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-3">
          🖼️ PDF to JPG Converter
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Convert each PDF page into a high-quality JPG image. Fully browser-based — fast and secure.
        </p>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center justify-between gap-4 bg-gray-50 rounded-xl p-4">
            <label className="font-medium text-gray-700">Render Scale</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-40"
              aria-label="Render scale"
            />
            <span className="text-sm text-gray-600">{scale.toFixed(1)}×</span>
          </div>
          <div className="flex items-center justify-between gap-4 bg-gray-50 rounded-xl p-4">
            <label className="font-medium text-gray-700">JPG Quality</label>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.01"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-40"
              aria-label="JPEG quality"
            />
            <span className="text-sm text-gray-600">{Math.round(quality * 100)}%</span>
          </div>
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFile}
                className="hidden"
              />
              <span className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition">
                📂 Choose PDF
              </span>
            </label>
          </div>
        </div>

        {/* File name */}
        {fileName && (
          <p className="text-center text-sm text-gray-500 mb-4">
            Selected: <span className="font-medium">{fileName}</span>
          </p>
        )}

        {/* Convert button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={generateImages}
            disabled={!file || loading}
            className={`px-8 py-3 rounded-xl text-lg font-medium shadow transition ${
              !file || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "⏳ Converting..." : "⚡ Convert PDF to JPG"}
          </button>
        </div>

        {/* Progress */}
        {loading && progress.total > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Rendering pages…</span>
              <span>
                {progress.current}/{progress.total}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 bg-green-500 transition-all"
                style={{
                  width: `${(progress.current / Math.max(progress.total, 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Actions (selection + bulk download) */}
        {pages.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Clear
              </button>
            </div>
            <button
              onClick={downloadAllZip}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow"
            >
              ⬇️ Download Selected as ZIP
            </button>
          </div>
        )}

        {/* Previews */}
        {pages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[520px] overflow-y-auto border rounded-xl p-4">
            {pages.map((p) => {
              const isSelected = selectedPages.includes(p.pageNumber);
              return (
                <div
                  key={p.pageNumber}
                  className={`relative border-2 rounded-lg transition ${
                    isSelected ? "border-green-600 shadow-lg" : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => toggleSelect(p.pageNumber)}
                    className={`absolute top-2 left-2 text-xs px-2 py-1 rounded ${
                      isSelected ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                    aria-label={`Select page ${p.pageNumber}`}
                  >
                    {isSelected ? "Selected ✓" : "Select"}
                  </button>

                  <img
                    src={p.dataUrl}
                    alt={`PDF page ${p.pageNumber}`}
                    className="w-full rounded-t-md"
                    loading="lazy"
                  />
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm text-gray-600">Page {p.pageNumber}</span>
                    <button
                      onClick={() => downloadOne(p)}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      Download JPG
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ✅ SEO Content (helps ranking) */}
      <div className="max-w-5xl mt-12 text-gray-800 leading-relaxed">
        <h2 className="text-2xl font-bold mb-3">Why Use Our PDF to JPG Converter?</h2>
        <p>
          Convert PDF pages to high-quality JPG images instantly. This tool works entirely
          in your browser, so your files never leave your device. It’s fast, secure, and
          free — perfect for exporting slides, reports, invoices, and designs as images.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>✔️ 100% browser-based — no uploads</li>
          <li>✔️ Adjustable render scale & JPEG quality</li>
          <li>✔️ Preview every page before download</li>
          <li>✔️ Download single images or a ZIP of all pages</li>
          <li>✔️ Works on desktop & mobile</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">FAQs</h2>
        <h3 className="text-lg font-semibold">Is this PDF to JPG tool free?</h3>
        <p>Yes, it’s completely free and will remain free.</p>

        <h3 className="text-lg font-semibold mt-4">Are my files secure?</h3>
        <p>
          Yes. The conversion happens locally in your browser using Canvas — your PDFs are
          never uploaded to a server.
        </p>

        <h3 className="text-lg font-semibold mt-4">Can I control image quality?</h3>
        <p>
          Absolutely. Use the sliders to change render scale and JPEG quality for the
          perfect balance of clarity and file size.
        </p>
      </div>

      {/* Footer */}
      <p className="mt-8 text-gray-500 text-sm">
        Built with ❤️ by OwnYourPDF — Fast, Secure, and Free PDF Tools
      </p>
    </div>
  );
}
