import { Check, FileText, IndianRupee, Palette, Settings } from "lucide-react";
import React from "react";

export default function PricingModel({
  draftBw,
  setDraftBw,
  draftColor,
  setDraftColor,
  priceBw,
  priceColor,
  justSaved,
  onSave,
  isDirty,
}) {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-emerald-500" />
          <h3 className="text-sm font-semibold text-gray-900">Pricing Model</h3>
        </div>
        {justSaved && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <Check size={13} /> Saved
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1 text-[11px] text-gray-400 mb-1">
            <FileText size={13} className="text-emerald-500" /> Black &amp;
            White (per page)
          </label>
          <div className="relative">
            <IndianRupee
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400"
            />
            <input
              type="number"
              min="0"
              step="0.5"
              value={draftBw}
              onChange={(e) => setDraftBw(Number(e.target.value))}
              className="w-full border border-emerald-100 bg-emerald-50/50 rounded-xl pl-8 pr-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>
        <div>
          <label className="flex items-center gap-1 text-[11px] text-gray-400 mb-1">
            <Palette size={13} className="text-emerald-500" /> Colorful (per
            page)
          </label>
          <div className="relative">
            <IndianRupee
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400"
            />
            <input
              type="number"
              min="0"
              step="0.5"
              value={draftColor}
              onChange={(e) => setDraftColor(Number(e.target.value))}
              className="w-full border border-emerald-100 bg-emerald-50/50 rounded-xl pl-8 pr-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-gray-400">
          These rates apply per printed page and are used to calculate each
          document's price below.
        </p>
        <button
          onClick={onSave}
          disabled={!isDirty}
          className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-colors shrink-0 ml-4 ${
            isDirty
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-emerald-50 text-emerald-300 cursor-not-allowed"
          }`}
        >
          <Check size={14} />
          Save
        </button>
      </div>
    </div>
  );
}
