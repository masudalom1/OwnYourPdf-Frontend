// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

// Dropdown links
const CONVERT_LINKS = [
  { to: "/convert/pdf-to-word", label: "PDF → Word" },
  { to: "/convert/pdf-to-jpg", label: "PDF → JPG" },
  { to: "/convert/pdf-to-ppt", label: "PDF → PPT" },
  { to: "/convert/word-to-pdf", label: "Word → PDF" },
];

const ALL_TOOLS = [
  { to: "/merge", label: "Merge PDF" },
  { to: "/split", label: "Split PDF" },
  { to: "/compress", label: "Compress PDF" },
  { to: "/protect", label: "Protect PDF" },
  { to: "/rotate", label: "Rotate PDF" },
];

const AI_TOOLS = [
  { to: "/ai/generate-article", label: "Generate Article" },
  { to: "/ai/summarize", label: "Summarize" },
  { to: "/ai/paraphrase", label: "Paraphrase" },
  { to: "/ai/translate", label: "Translate" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubs, setMobileSubs] = useState({
    convert: false,
    all: false,
    ai: false,
  });

  const toggleMobileSub = (key) => {
    setMobileSubs((s) => ({ ...s, [key]: !s[key] }));
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-indigo-600 font-semibold uppercase text-sm"
      : "text-gray-800 hover:text-indigo-600 uppercase text-sm transition";

   return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg
              className="w-7 h-7 text-pink-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21s-6.7-4.3-9-7c-2.3-2.7-3-6.3-1.5-9.5C3 1.3 7.1 0 12 0s9 1.3 10.5 4.5c1.5 3.2.8 6.8-1.5 9.5-2.3 2.7-9 7-9 7z" />
            </svg>
            <span className="text-lg font-extrabold text-gray-900">
              OwnYour <span className="text-indigo-600">PDF</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            role="navigation"
            aria-label="Main menu"
            className="hidden md:flex items-center space-x-6"
          >
            <NavLink to="/merge" className={navLinkClass}>
              Merge PDF
            </NavLink>
            <NavLink to="/split" className={navLinkClass}>
              Split PDF
            </NavLink>
            <NavLink to="/compress" className={navLinkClass}>
              Compress PDF
            </NavLink>

            {/* Dropdowns */}
            <Dropdown label="Convert PDF" items={CONVERT_LINKS} />
            <Dropdown
              label="All PDF Tools"
              items={ALL_TOOLS}
              extraLink={{ to: "/tools/all", label: "See all tools" }}
            />
            <Dropdown
              label="AI Content Generator"
              items={AI_TOOLS}
              extraLink={{ to: "/ai", label: "AI Dashboard" }}
            />
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${mobileOpen ? "block" : "hidden"} border-t`}
      >
        <div className="px-4 py-3 space-y-1">
          <NavLink to="/" className="block py-2 text-gray-800">
            Home
          </NavLink>
          <NavLink to="/merge" className="block py-2 text-gray-800">
            Merge PDF
          </NavLink>
          <NavLink to="/split" className="block py-2 text-gray-800">
            Split PDF
          </NavLink>
          <NavLink to="/compress" className="block py-2 text-gray-800">
            Compress PDF
          </NavLink>

          {/* Accordions */}
          <Accordion
            label="Convert PDF"
            items={CONVERT_LINKS}
            open={mobileSubs.convert}
            onToggle={() => toggleMobileSub("convert")}
          />
          <Accordion
            label="All PDF Tools"
            items={ALL_TOOLS}
            open={mobileSubs.all}
            onToggle={() => toggleMobileSub("all")}
            extraLink={{ to: "/tools/all", label: "See all tools" }}
          />
          <Accordion
            label="AI Content Generator"
            items={AI_TOOLS}
            open={mobileSubs.ai}
            onToggle={() => toggleMobileSub("ai")}
            extraLink={{ to: "/ai", label: "AI Dashboard" }}
          />
        </div>
      </div>
    </header>
  );
}

// ---------- Dropdown (desktop) ----------
function Dropdown({ label, items, extraLink }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-1 text-sm uppercase font-medium text-gray-800 hover:text-indigo-600"
      >
        {label}
        <svg
          className={`w-3 h-3 mt-0.5 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.2 7.2a.75.75 0 011.1 0L10 11.3l3.7-4.1a.75.75 0 111.1 1L10.5 13a.75.75 0 01-1.1 0L5.2 8.3a.75.75 0 010-1.1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-20 mt-2 w-56 rounded-md border bg-white shadow-lg">
          <div className="py-1">
            {items.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                onClick={() => setOpen(false)} // close dropdown on click
              >
                {l.label}
              </Link>
            ))}
            {extraLink && (
              <>
                <div className="border-t my-1" />
                <Link
                  to={extraLink.to}
                  className="block px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                  onClick={() => setOpen(false)}
                >
                  {extraLink.label}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


// ---------- Accordion (mobile) ----------
function Accordion({ label, items, open, onToggle, extraLink }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2"
        aria-expanded={open}
      >
        <span className="uppercase text-sm font-medium">{label}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.2 7.2a.75.75 0 011.1 0L10 11.3l3.7-4.1a.75.75 0 111.1 1L10.5 13a.75.75 0 01-1.1 0L5.2 8.3a.75.75 0 010-1.1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="pl-4">
          {items.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="block py-2 text-gray-700 hover:text-indigo-600"
            >
              {l.label}
            </NavLink>
          ))}
          {extraLink && (
            <NavLink
              to={extraLink.to}
              className="block py-2 font-medium text-indigo-600"
            >
              {extraLink.label}
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
}
