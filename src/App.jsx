import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MergePdf from "./pages/MergePDF";
import Split from "./pages/Splitpdf";
import CompressPDF from "./pages/CompressPDF";
import PdfToJpg from "./pages/PdfToJpg";
import PdfRemove from "./pages/PdfRemove";
import CodePreviewer from "./pages/CodePreviewer";
import PrivacyPolicy from "./aboutsite/PrivacyPolicy";
import About from "./aboutsite/About";
import Contact from "./aboutsite/Contact";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/merge" element={<MergePdf />} />
        <Route path="/split" element={<Split />} />
        <Route path="/compress" element={<CompressPDF />} />
        <Route path="convert/pdf-to-jpg" element={<PdfToJpg />} />
        <Route path="/remove-pdf" element={<PdfRemove />} />
        <Route path="/CodePreviewer" element={<CodePreviewer />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
