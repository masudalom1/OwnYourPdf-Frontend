import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MergePdf from "./pages/MergePDF";
import Split from "./pages/Splitpdf";
import CompressPDF from "./pages/CompressPDF";
import PdfToWord from "./pages/PdfToWord";
import PdfToJpg from "./pages/PdfToJpg";
import WordToPdf from "./pages/WordToPdf";
import PdfRemove from "./pages/PdfRemove";
import CodePreviewer from "./pages/CodePreviewer";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/merge" element={<MergePdf />} />
        <Route path="/split" element={<Split />} />
        <Route path="/compress" element={<CompressPDF />} />
         <Route path="convert/pdf-to-word" element={<PdfToWord/>} />
          <Route path="convert/pdf-to-jpg" element={<PdfToJpg/>} />
          <Route path="convert/pdf-to-ppt" element={<PdfToJpg/>} />
          <Route path="convert/word-to-pdf" element={<WordToPdf/>} />
           <Route path="/remove-pdf" element={<PdfRemove/>} />
         
           <Route path="/CodePreviewer" element={<CodePreviewer/>} />
      </Routes>
    </>
  );
}

export default App;
