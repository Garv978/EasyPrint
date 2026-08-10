import React, { useState } from "react";
import API from "../api";
import FileUploadSection from "../components/FileUploadSection";
import PrintOptionsSection from "../components/PrintOptionsSection";
import ProductCardsSection from "../components/ProductCardsSection";

export default function UserDashboard() {
  const [colorMode, setColorMode] = useState("bw");
  const [copies, setCopies] = useState(1);
  const [customCopies, setCustomCopies] = useState("");
  const [sides, setSides] = useState("single");
  const [pageRange, setPageRange] = useState("all");
  const [fromPage, setFromPage] = useState("");
  const [toPage, setToPage] = useState("");
  const [layout, setLayout] = useState("portrait");
  const [pagesPerSheet, setPagesPerSheet] = useState(1);
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleCopyDropdown = (e) => {
    const val = e.target.value;
    if (val === "custom") {
      setCopies("");
      setCustomCopies("");
    } else {
      setCopies(Number(val));
      setCustomCopies("");
    }
  };

  const handleCustomCopies = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomCopies(val);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("documents", file);
      });

      formData.append("colorMode", colorMode);
      formData.append("copies", customCopies !== "" ? customCopies : copies);
      formData.append("sides", sides);
      formData.append("layout", layout);
      formData.append("pagesPerSheet", pagesPerSheet);
      formData.append("pageRange", pageRange);

      if (pageRange === "custom") {
        formData.append("fromPage", fromPage);
        formData.append("toPage", toPage);
      }

      const response = await API.post("/user/file", formData);
      console.log(response.data);
      setUploadedFiles(response.data.files ?? []);
      setFiles([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-emerald-50/60 p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-4">
        <FileUploadSection
          files={files}
          uploadedFiles={uploadedFiles}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
          onUpload={handleUpload}
        />

        <PrintOptionsSection
          colorMode={colorMode}
          setColorMode={setColorMode}
          layout={layout}
          setLayout={setLayout}
          pagesPerSheet={pagesPerSheet}
          setPagesPerSheet={setPagesPerSheet}
          copies={copies}
          customCopies={customCopies}
          handleCopyDropdown={handleCopyDropdown}
          handleCustomCopies={handleCustomCopies}
          sides={sides}
          setSides={setSides}
          pageRange={pageRange}
          setPageRange={setPageRange}
          fromPage={fromPage}
          setFromPage={setFromPage}
          toPage={toPage}
          setToPage={setToPage}
        />

        <ProductCardsSection />
      </div>
    </div>
  );
}
