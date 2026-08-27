import {
  Copy,
  FileStack,
  FileText,
  IndianRupee,
  Palette,
  Printer,
  RectangleHorizontal,
  RectangleVertical,
} from "lucide-react";
import React from "react";

export default function DocumentCard({ doc, idx, docPrice }) {
  return (
    <div className="bg-white rounded-xl border border-emerald-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Doc info */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-600 shrink-0">
          {idx + 1}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <FileText size={14} className="text-emerald-500 shrink-0" />
            <p className="text-sm font-medium text-gray-800 truncate">
              {doc.fileName}
            </p>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FileStack size={12} className="text-emerald-400" /> {doc.pages}{" "}
              pages
            </span>
            <span className="flex items-center gap-1">
              <Palette size={12} className="text-emerald-400" />
              {doc.color === "color" ? "Colorful" : "Black & White"}
            </span>
            <span className="flex items-center gap-1">
              <Copy size={12} className="text-emerald-400" /> {doc.copies}{" "}
              {doc.copies === 1 ? "copy" : "copies"}
            </span>
            <span className="flex items-center gap-1">
              {doc.layout === "landscape" ? (
                <RectangleHorizontal size={12} className="text-emerald-400" />
              ) : (
                <RectangleVertical size={12} className="text-emerald-400" />
              )}
              {doc.layout === "landscape" ? "Landscape" : "Portrait"}
            </span>
            <span className="flex items-center gap-1">
              <FileStack size={12} className="text-emerald-400" /> Range:{" "}
              {doc.range}
            </span>
          </div>
        </div>
      </div>

      {/* Price + print */}
      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
        <span className="flex items-center text-sm font-semibold text-gray-800">
          <IndianRupee size={13} />
          {docPrice(doc)}
        </span>
        <button className="flex items-center gap-1.5 text-sm font-medium bg-emerald-500 text-white px-3 py-2 rounded-xl hover:bg-emerald-600 transition-colors">
          <Printer size={14} />
          Print
        </button>
      </div>
    </div>
  );
}
