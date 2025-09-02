import React, { useState } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {Helmet} from "react-helmet"

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
      const res = await axios.post(
        "https://own-your-pdf-backend.vercel.app/compress",
        formData,
        {
          responseType: "blob",
        }
      );

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
      <Helmet>
        <title>Compress PDF Online Free | Reduce PDF Size Instantly</title>
        <meta
          name="description"
          content="Compress PDF online free without signup. Reduce PDF file size while keeping quality. Fast, secure, and works in your browser."
        />
        <meta
          name="keywords"
          content="compress pdf, reduce pdf size, shrink pdf, pdf compressor, compress pdf online free"
        />
        <link rel="canonical" href="https://www.ownyourpdf.online/compress" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Compress PDF Online Free | OwnYourPDF"
        />
        <meta
          property="og:description"
          content="Easily compress PDF files online. Reduce file size securely in your browser. 100% free PDF compressor tool."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ownyourpdf.online/compress" />
        <meta
          property="og:image"
          content="https://ownyourpdf.online/og-compresspdf.jpg"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Compress PDF Online Free" />
        <meta
          name="twitter:description"
          content="Free PDF compressor - Reduce and download compressed PDFs instantly. No signup required."
        />
        <meta
          name="twitter:image"
          content="https://pbs.twimg.com/profile_images/1958922055060967424/8G9nAWfE_400x400.jpg"
        />

        {/* ✅ JSON-LD for FAQ schema */}
        <script type="application/ld+json">{`
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is this Compress PDF tool free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, it is completely free and always will be."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to install software to compress PDFs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No installation needed. Everything runs securely in your browser."
          }
        },
        {
          "@type": "Question",
          "name": "Are my files safe when I compress PDFs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! The entire process happens in your browser. Your PDFs are never stored on our servers."
          }
        }
      ]
    }
  `}</script>
      </Helmet>
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

      {/* ✅ SEO Content Section */}
      <div className="max-w-4xl mt-12 text-gray-800 leading-relaxed">
        <h2 className="text-2xl font-bold mb-4">
          Why Use Our Compress PDF Tool?
        </h2>
        <p>
          Compressing PDF files online has never been easier. Our free PDF
          compressor reduces file size instantly while maintaining quality.
          Unlike other tools, this works directly in your browser — no need to
          upload your files to unsafe servers.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>✔️ 100% Free and browser-based</li>
          <li>✔️ No watermarks or hidden charges</li>
          <li>✔️ Secure — files stay on your device</li>
          <li>✔️ Works on desktop & mobile</li>
          <li>✔️ Instant download after compression</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">FAQs</h2>
        <h3 className="text-lg font-semibold">
          Is this Compress PDF tool free?
        </h3>
        <p>Yes, it is completely free and always will be.</p>

        <h3 className="text-lg font-semibold mt-4">
          Do I need to install software?
        </h3>
        <p>
          No installation needed. Everything runs inside your browser securely.
        </p>

        <h3 className="text-lg font-semibold mt-4">Are my files safe?</h3>
        <p>
          Yes! The entire process happens in your browser. Your PDFs are never
          stored on our servers.
        </p>
      </div>
    </div>
  );
}
