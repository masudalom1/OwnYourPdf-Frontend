import React from "react";
import { Link } from "react-router-dom"; // 👈 import Link
import Content from "../components/Content";

const Home = () => {
  const tools = [
    { name: "Merge PDF", desc: "Combine multiple PDFs into one file", path: "/merge" },
    { name: "Split PDF", desc: "Extract pages or split large PDFs easily", path: "/split" },
    { name: "Compress PDF", desc: "Reduce file size without losing quality", path: "/compress" },
    { name: "pdf to jpg", desc: "Turn PDFs into editable Word docs", path: "/convert/pdf-to-jpg" },
    { name: "remove or extract pdf", desc: "Extract tables into Excel format", path: "/remove-pdf" },
    { name: "Code Previewer", desc: "Remove password protection securely", path: "/CodePreviewer" },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-br from-red-50 via-white to-gray-50">
        {/* SEO Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center leading-tight max-w-3xl">
          All-in-One Free PDF Tools – Edit, Merge, Convert & More
        </h1>

        {/* SEO Subheading */}
        <p className="mt-6 max-w-2xl text-lg text-gray-600 text-center">
          Work with your PDFs effortlessly. Merge, split, compress, convert to Word/Excel, 
          add watermarks, unlock, and rotate files – all <span className="font-semibold text-red-600">100% FREE</span>, 
          fast, and secure. Everything you need to manage PDFs in one place.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex gap-4">
          <Link
            to="/tools"
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md font-medium transition-transform transform hover:scale-105"
          >
            All Tools
          </Link>
          <Link
            to="/about"
            className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl shadow-md font-medium transition-transform transform hover:scale-105"
          >
            Learn More
          </Link>
        </div>

        {/* Tools Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-6xl w-full">
          {tools.map((tool, index) => (
            <Link
              key={index}
              to={tool.path} // 👈 link to route
              className="p-6 bg-white rounded-2xl shadow hover:shadow-xl border border-gray-100 transition cursor-pointer hover:-translate-y-1 block"
            >
              <h3 className="text-xl font-semibold text-gray-900">{tool.name}</h3>
              <p className="mt-2 text-gray-600">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* content section */}
      <Content />
    </>
  );
};

export default Home;
