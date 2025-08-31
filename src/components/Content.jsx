import React from "react";
import { FaFilePdf, FaLock, FaRobot, FaTools } from "react-icons/fa";
import { MdEditDocument, MdOutlinePictureAsPdf } from "react-icons/md";
import { AiOutlineCompress } from "react-icons/ai";
import { RiPagesFill } from "react-icons/ri";
import {Link} from "react-router-dom"

const Content = () => {
  const sections = [
    {
      title: "📂 Organize PDFs Effortlessly",
      icon: <RiPagesFill className="text-blue-600 text-3xl" />,
      desc: "Keep your documents neat and structured with tools to merge, split, extract, and rotate.",
      items: [
        "Merge PDF – Combine files into one document",
        "Split PDF – Separate sections in seconds",
        "Remove or Extract Pages – Delete or pull out what you need",
        "Rotate PDF – Fix orientation easily",
        "Add Page Numbers & Watermarks – Customize your files",
      ],
    },
    {
      title: "🔄 Convert Any File to PDF",
      icon: <FaFilePdf className="text-red-600 text-3xl" />,
      desc: "Convert images, documents, spreadsheets, and web pages into high-quality PDFs instantly.",
      items: [
        "JPG to PDF – Turn photos into documents",
        "Word to PDF – Keep formatting perfect",
        "PowerPoint to PDF – Share presentations easily",
        "Excel to PDF – Protect your spreadsheets",
        "HTML to PDF – Save webpages as clean PDFs",
      ],
    },
    {
      title: "📤 Convert PDFs into Other Formats",
      icon: <FaTools className="text-green-600 text-3xl" />,
      desc: "Quickly transform PDFs into Word, Excel, PowerPoint, or images.",
      items: [
        "PDF to JPG – Extract visuals",
        "PDF to Word – Editable text",
        "PDF to PowerPoint – Presentation-ready slides",
        "PDF to Excel – Keep data structured",
        "PDF to PDF/A – Long-term storage format",
      ],
    },
    {
      title: "✏️ Edit Your PDFs Like a Pro",
      icon: <MdEditDocument className="text-yellow-500 text-3xl" />,
      desc: "Add text, crop, annotate, insert images, and sign digitally with ease.",
      items: [
        "Add Watermarks & Annotations",
        "Crop PDFs for cleaner layouts",
        "Insert e-Signatures instantly",
        "Redact sensitive data securely",
        "Compare two PDFs side by side",
      ],
    },
    {
      title: "🔒 Secure & Protect Your PDFs",
      icon: <FaLock className="text-purple-600 text-3xl" />,
      desc: "Lock confidential files, encrypt documents, and redact sensitive data.",
      items: [
        "Unlock PDF – Remove passwords easily",
        "Protect PDF – Add encryption and restrictions",
        "Sign PDF – Digital signatures made simple",
        "Redact Content – Hide sensitive information",
      ],
    },
    {
      title: "⚡ Optimize & Repair PDFs",
      icon: <AiOutlineCompress className="text-indigo-600 text-3xl" />,
      desc: "Compress PDFs, repair broken files, and use OCR for searchable text.",
      items: [
        "Compress PDF – Reduce size without quality loss",
        "Repair PDF – Fix damaged documents",
        "OCR PDF – Make scanned PDFs editable & searchable",
        "Scan to PDF – Digitize documents instantly",
      ],
    },
    {
      title: "🤖 Beyond PDFs – AI Content Tools",
      icon: <FaRobot className="text-pink-500 text-3xl" />,
      desc: "Boost your digital presence with AI-powered content generators.",
      items: [
        "Instagram Caption Generator – Creative, trending captions",
        "Facebook Post Ideas – Boost engagement with smart text",
        "YouTube Titles & Descriptions – Optimized for clicks & SEO",
        "Blog & Article Writer – AI-powered long-form content",
        "eCommerce Store Descriptions – Ready-to-use product copy",
      ],
    },
  ];

  return (
    <main className="bg-white text-gray-800">
      {/* Intro */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-16 px-6">
        <h1 className="text-4xl font-extrabold mb-4">
          All-in-One PDF & AI Toolkit
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          Edit, convert, compress, secure, and create AI content – everything
          you need for productivity in one professional platform.
        </p>
      </section>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-16">
        {sections.map((section, i) => (
          <article
            key={i}
            className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-lg transition border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              {section.icon}
              <h2 className="text-2xl font-semibold text-gray-900">
                {section.title}
              </h2>
            </div>
            <p className="text-gray-600 mb-4">{section.desc}</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {section.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </article>
        ))}

        {/* Closing */}
        <section className="text-center py-10">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">
            🚀 One Platform. Unlimited Possibilities.
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            From <strong>converting PDFs to generating AI content</strong>, our
            platform is your one-stop solution for productivity. Secure, fast,
            and SEO-friendly – built for professionals like you.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo / About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">OwnYourPDF</h3>
            <p className="text-sm leading-relaxed">
              The ultimate free & professional PDF toolkit. Convert, edit,
              compress, and generate AI-powered content – all in one platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>Convert to PDF</li>
              <li>Convert from PDF</li>
              <li>Edit PDF</li>
              <li>Secure PDF</li>
              <li>AI Tools</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <Link to="/about">About</Link>
              <br />
              <Link to="/privacy-policy">Privacy</Link>
              <li>Blog</li>
              <li>Guides</li>
              <li>SEO Tips</li>
              <li>FAQs</li>
              <li>Support</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: solvixan.office@gmail.com</li>
              <Link to="/contact">contact info</Link>
              <li>Location: India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} OwnYourPDF. All rights reserved.
        </div>
      </footer>
    </main>
  );
};

export default Content;
