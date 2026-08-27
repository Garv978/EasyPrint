import React, { useState } from "react";
import FileUploadSection from "../components/FileUploadSection";
import PrintOptionsSection from "../components/PrintOptionsSection";
import ProductCardsSection from "../components/ProductCardsSection";
import { useParams } from "react-router-dom";
import { uploadFiles } from "../services/UserServices";
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
  const [isUploading, setIsUploading] = useState(false);

  const { shopCode } = useParams();
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
      setIsUploading(true);
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

      const response = await uploadFiles(shopCode, formData);
      setUploadedFiles(response.data.fileNames || []);
      setFiles([]);
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      console.error("SERVER ERROR:", error.response?.data);
    } finally {
      setIsUploading(false);
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
          isUploading={isUploading}
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
