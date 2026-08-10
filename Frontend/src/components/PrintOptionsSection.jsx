import {
  ChevronDown,
  Copy,
  FileStack,
  Grid2x2,
  Layers2,
  Palette,
  RectangleHorizontal,
  RectangleVertical,
} from "lucide-react";

export default function PrintOptionsSection({
  colorMode,
  setColorMode,
  layout,
  setLayout,
  pagesPerSheet,
  setPagesPerSheet,
  copies,
  customCopies,
  handleCopyDropdown,
  handleCustomCopies,
  sides,
  setSides,
  pageRange,
  setPageRange,
  fromPage,
  setFromPage,
  toPage,
  setToPage,
}) {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Print Options
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1 text-[11px] text-gray-400 mb-1">
            <RectangleVertical size={13} className="text-emerald-500" /> Layout
          </label>
          <div className="flex rounded-xl border border-emerald-100 overflow-hidden">
            <button
              onClick={() => setLayout("portrait")}
              className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2.5 transition-colors ${
                layout === "portrait"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50/50 text-gray-700 hover:bg-emerald-100"
              }`}
            >
              <RectangleVertical size={14} /> Portrait
            </button>
            <button
              onClick={() => setLayout("landscape")}
              className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2.5 transition-colors ${
                layout === "landscape"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50/50 text-gray-700 hover:bg-emerald-100"
              }`}
            >
              <RectangleHorizontal size={14} /> Landscape
            </button>
          </div>
        </div>

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
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400"
            />
          </div>
        </div>

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
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400"
              />
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

        <div>
          <label className="flex items-center gap-1 text-[11px] text-gray-400 mb-1">
            <Layers2 size={13} className="text-emerald-500" /> Sides
          </label>
          <div className="flex rounded-xl border border-emerald-100 overflow-hidden">
            <button
              onClick={() => setSides("single")}
              className={`flex-1 text-sm font-medium py-2.5 transition-colors ${
                sides === "single"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50/50 text-gray-700 hover:bg-emerald-100"
              }`}
            >
              Single-sided
            </button>
            <button
              onClick={() => setSides("double")}
              className={`flex-1 text-sm font-medium py-2.5 transition-colors ${
                sides === "double"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50/50 text-gray-700 hover:bg-emerald-100"
              }`}
            >
              Double-sided
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-emerald-50">
        <label className="flex items-center gap-1 text-[11px] text-gray-400 mb-2">
          <FileStack size={13} className="text-emerald-500" /> Pages to Print
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex rounded-xl border border-emerald-100 overflow-hidden shrink-0">
            <button
              onClick={() => setPageRange("all")}
              className={`px-4 text-sm font-medium py-2.5 transition-colors ${
                pageRange === "all"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50/50 text-gray-700 hover:bg-emerald-100"
              }`}
            >
              All Pages
            </button>
            <button
              onClick={() => setPageRange("custom")}
              className={`px-4 text-sm font-medium py-2.5 transition-colors ${
                pageRange === "custom"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50/50 text-gray-700 hover:bg-emerald-100"
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
                onChange={(e) =>
                  setFromPage(e.target.value.replace(/[^0-9]/g, ""))
                }
                className="w-20 border border-emerald-100 bg-emerald-50/50 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 placeholder:text-emerald-300"
              />
              <span className="text-gray-400 text-sm">to</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="To"
                value={toPage}
                onChange={(e) =>
                  setToPage(e.target.value.replace(/[^0-9]/g, ""))
                }
                className="w-20 border border-emerald-100 bg-emerald-50/50 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 placeholder:text-emerald-300"
              />
              <span className="text-xs text-gray-400">
                e.g. 1 to 8 of your file
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
