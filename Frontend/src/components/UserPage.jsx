import { ArrowRight, ChevronDown, Copy, FileStack, FileText, Grid2x2, Image as ImageIcon, Layers2, Palette, RectangleHorizontal, RectangleVertical, Upload } from "lucide-react";
import React, { useState } from "react";
import API from "../api";

export default function UserPage() {
  const [colorMode, setColorMode] = useState("bw");
  const [copies, setCopies] = useState(1);
  const [customCopies, setCustomCopies] = useState("");
  const [sides, setSides] = useState("single");
  const [pageRange, setPageRange] = useState("all");
  const [fromPage, setFromPage] = useState("");
  const [toPage, setToPage] = useState("");
  const [layout, setLayout] = useState("portrait");
  const [pagesPerSheet, setPagesPerSheet] = useState(1);
  const [files,setFiles] = useState([]);
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
    if(selectedFiles.length === 0) return ;
    setFiles(selectedFiles) ;
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    try {
      const formData = new FormData();

      // Append multiple files
      files.forEach((file) => {
        formData.append("documents", file);
      });


      // Append print options
      formData.append("colorMode", colorMode);

      formData.append(
        "copies",
        customCopies !== "" ? customCopies : copies
      );

      formData.append("sides", sides);

      formData.append("layout", layout);

      formData.append(
        "pagesPerSheet",
        pagesPerSheet
      );


      // Page range
      formData.append("pageRange", pageRange);

      if (pageRange === "custom") {
        formData.append("fromPage", fromPage);
        formData.append("toPage", toPage);
      }
      const response = await API.post(
        "/user/file",
        formData
      );
      console.log(response.data);
      setUploadedFiles(response.data.files ?? []);
      setFiles([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="min-h-screen bg-emerald-50/60 p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-4">

        {/* Upload Card */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900">Ready to Print?</h2>
          <p className="text-gray-400 mt-1 mb-6">
            Print PDFs, Word files, images, certificates, resumes, assignments, and more.
          </p>


        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />

        <label
          htmlFor="file-upload"
          className="w-full border-2 border-dashed border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-colors rounded-xl py-5 flex items-center justify-center gap-2 text-emerald-600 font-semibold cursor-pointer"
        >
          <Upload size={18} />
          Upload File
        </label>
        {/* Selected Files Display */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold text-gray-600">
              Selected Files:
            </p>

            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2 text-sm text-gray-700"
              >
                <div className="flex flex-col truncate">
                  <span className="truncate max-w-[250px]">
                    {file.name}
                  </span>

                  <span className="text-gray-400 text-xs">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="ml-3 text-red-500 hover:text-red-700 font-semibold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        {uploadedFiles.length > 0 && (
          <div className="mt-5 space-y-2">
            <p className="text-sm font-semibold text-emerald-600">
              Uploaded Successfully:
            </p>

            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-sm"
              >
                <span className="truncate max-w-[250px] text-gray-700">
                  {file.name}
                </span>

                <span className="text-emerald-600 font-semibold">
                  ✓ Uploaded
                </span>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={handleUpload}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-xl py-3 text-white font-semibold"
        >
          Upload
        </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Supported Formats: PDF, DOC, DOCX, JPG, PNG
          </p>
        </div>

        {/* Print Options Row */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Print Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">

            {/* Color dropdown */}
            <div>
              <label className="flex items-center gap-1 text-[11px] text-gray-400 mb-1">
                <Palette size={13} className="text-emerald-500" /> Color
              </label>
              <div className="relative">
                <select
                  value={colorMode}
                  onChange={(e) => setColorMode(e.target.value)}
                  className="w-full appearance-none border border-emerald-100 bg-emerald-50/50 rounded-xl px-3 py-2.5 pr-8 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="bw">Black &amp; White</option>
                  <option value="color">Colorful</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              </div>
            </div>

            {/* Layout */}
            <div>
              <label className="flex items-center gap-1 text-[11px] text-gray-400 mb-1">
                <RectangleVertical size={13} className="text-emerald-500" /> Layout
              </label>
              <div className="flex rounded-xl border border-emerald-100 overflow-hidden">
                <button
                  onClick={() => setLayout("portrait")}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2.5 transition-colors ${
                    layout === "portrait" ? "bg-emerald-500 text-white" : "bg-emerald-50/50 text-gray-700 hover:bg-emerald-100"
                  }`}
                >
                  <RectangleVertical size={14} /> Portrait
                </button>
                <button
                  onClick={() => setLayout("landscape")}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2.5 transition-colors ${
                    layout === "landscape" ? "bg-emerald-500 text-white" : "bg-emerald-50/50 text-gray-700 hover:bg-emerald-100"
                  }`}
                >
                  <RectangleHorizontal size={14} /> Landscape
                </button>
              </div>
            </div>

            {/* Pages per sheet */}
            <div>
              <label className="flex items-center gap-1 text-[11px] text-gray-400 mb-1">
                <Grid2x2 size={13} className="text-emerald-500" /> Pages per Sheet
              </label>
              <div className="relative">
                <select
                  value={pagesPerSheet}
                  onChange={(e) => setPagesPerSheet(Number(e.target.value))}
                  className="w-full appearance-none border border-emerald-100 bg-emerald-50/50 rounded-xl px-3 py-2.5 pr-8 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  {[1, 2, 4, 6, 9, 16].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "page" : "pages"} / sheet
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              </div>
            </div>

            {/* Copies */}
            <div>
              <label className="flex items-center gap-1 text-[11px] text-gray-400 mb-1">
                <Copy size={13} className="text-emerald-500" /> Copies
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <select
                    value={customCopies !== "" ? "custom" : copies}
                    onChange={handleCopyDropdown}
                    className="w-full appearance-none border border-emerald-100 bg-emerald-50/50 rounded-xl px-3 py-2.5 pr-8 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "copy" : "copies"}
                      </option>
                    ))}
                    <option value="custom">Custom...</option>
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                </div>
                {(customCopies !== "" || copies === "") && (
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 12"
                    value={customCopies}
                    onChange={handleCustomCopies}
                    className="w-20 border border-emerald-100 bg-emerald-50/50 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 placeholder:text-emerald-300"
                  />
                )}
              </div>
            </div>

            {/* Sides */}
            <div>
              <label className="flex items-center gap-1 text-[11px] text-gray-400 mb-1">
                <Layers2 size={13} className="text-emerald-500" /> Sides
              </label>
              <div className="flex rounded-xl border border-emerald-100 overflow-hidden">
                <button
                  onClick={() => setSides("single")}
                  className={`flex-1 text-sm font-medium py-2.5 transition-colors ${
                    sides === "single" ? "bg-emerald-500 text-white" : "bg-emerald-50/50 text-gray-700 hover:bg-emerald-100"
                  }`}
                >
                  Single-sided
                </button>
                <button
                  onClick={() => setSides("double")}
                  className={`flex-1 text-sm font-medium py-2.5 transition-colors ${
                    sides === "double" ? "bg-emerald-500 text-white" : "bg-emerald-50/50 text-gray-700 hover:bg-emerald-100"
                  }`}
                >
                  Double-sided
                </button>
              </div>
            </div>

          </div>

          {/* Page Range */}
          <div className="mt-5 pt-5 border-t border-emerald-50">
            <label className="flex items-center gap-1 text-[11px] text-gray-400 mb-2">
              <FileStack size={13} className="text-emerald-500" /> Pages to Print
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex rounded-xl border border-emerald-100 overflow-hidden shrink-0">
                <button
                  onClick={() => setPageRange("all")}
                  className={`px-4 text-sm font-medium py-2.5 transition-colors ${
                    pageRange === "all" ? "bg-emerald-500 text-white" : "bg-emerald-50/50 text-gray-700 hover:bg-emerald-100"
                  }`}
                >
                  All Pages
                </button>
                <button
                  onClick={() => setPageRange("custom")}
                  className={`px-4 text-sm font-medium py-2.5 transition-colors ${
                    pageRange === "custom" ? "bg-emerald-500 text-white" : "bg-emerald-50/50 text-gray-700 hover:bg-emerald-100"
                  }`}
                >
                  Custom Range
                </button>
              </div>

              {pageRange === "custom" && (
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="From"
                    value={fromPage}
                    onChange={(e) => setFromPage(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-20 border border-emerald-100 bg-emerald-50/50 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 placeholder:text-emerald-300"
                  />
                  <span className="text-gray-400 text-sm">to</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="To"
                    value={toPage}
                    onChange={(e) => setToPage(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-20 border border-emerald-100 bg-emerald-50/50 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 placeholder:text-emerald-300"
                  />
                  <span className="text-xs text-gray-400">e.g. 1 to 8 of your file</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Blank A4 Sheet */}
          <div className="relative bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-emerald-700" />
              <h4 className="font-semibold text-gray-900">Blank A4 Sheet</h4>
            </div>
            <ul className="text-sm text-gray-500 space-y-1 mb-6">
              <li>• 80 GSM Paper</li>
              <li>• White Paper</li>
            </ul>
            <button className="inline-flex items-center gap-1 text-emerald-600 font-medium text-sm bg-emerald-50 px-4 py-2 rounded-full hover:bg-emerald-100 transition-colors">
              Get now <ArrowRight size={14} />
            </button>

            {/* Decorative A4 stack */}
            <div className="absolute bottom-3 right-3 w-16 h-16 flex items-center justify-center">
              <div className="w-12 h-16 bg-emerald-50 border border-emerald-200 rounded-sm rotate-6 absolute" />
              <div className="w-12 h-16 bg-white border border-emerald-200 rounded-sm flex items-center justify-center text-emerald-300 font-bold text-xs relative">
                A4
              </div>
            </div>
          </div>

          {/* Photo - Coming Soon */}
          <div className="relative bg-emerald-50/40 rounded-2xl border border-emerald-100 shadow-sm p-6 overflow-hidden opacity-70">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon size={18} className="text-emerald-300" />
              <h4 className="font-semibold text-emerald-300">Photo</h4>
            </div>
            <ul className="text-sm text-emerald-300 space-y-1 mb-6">
              <li>• High Quality Print</li>
              <li>• Glossy Paper</li>
            </ul>
            <button
              disabled
              className="text-sm font-medium bg-emerald-100 text-emerald-300 px-4 py-2 rounded-full cursor-not-allowed"
            >
              Coming soon
            </button>

            <div className="absolute bottom-3 right-3 w-16 h-16 flex items-center justify-center">
              <div className="w-14 h-14 bg-white border border-emerald-200 rounded-md rotate-6 absolute" />
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-center text-emerald-200 relative">
                <ImageIcon size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}