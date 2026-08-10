import {
  Check,
  ChevronDown,
  Copy,
  FileStack,
  FileText,
  IndianRupee,
  Palette,
  Printer,
  RectangleHorizontal,
  RectangleVertical,
  Settings,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";

// ---- Mock data: customers -> documents ----
const initialCustomers = [
  {
    id: "c1",
    name: "Ananya Sharma",
    documents: [
      { id: "d1", fileName: "Physics_Assignment.pdf", pages: 12, color: "bw", copies: 2, layout: "portrait", range: "All" },
      { id: "d2", fileName: "Physics_Diagrams.pdf", pages: 6, color: "color", copies: 1, layout: "landscape", range: "1-4" },
    ],
  },
  {
    id: "c2",
    name: "Rohan Mehta",
    documents: [
      { id: "d3", fileName: "Chemistry_Notes.docx", pages: 20, color: "bw", copies: 1, layout: "portrait", range: "All" },
    ],
  },
  {
    id: "c3",
    name: "Priya Nair",
    documents: [
      { id: "d4", fileName: "Priya_Resume_Final.pdf", pages: 2, color: "color", copies: 5, layout: "portrait", range: "All" },
    ],
  },
  {
    id: "c4",
    name: "Karan Verma",
    documents: [
      { id: "d5", fileName: "Internship_Certificate.pdf", pages: 1, color: "color", copies: 3, layout: "landscape", range: "All" },
      { id: "d6", fileName: "Course_Completion.pdf", pages: 1, color: "bw", copies: 2, layout: "landscape", range: "All" },
    ],
  },
  {
    id: "c5",
    name: "Sneha Iyer",
    documents: [
      { id: "d7", fileName: "Marksheet_Sem4.pdf", pages: 3, color: "bw", copies: 1, layout: "portrait", range: "1-2" },
    ],
  },
];

export default function UserDashboard() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  // Draft values (being edited) vs saved values (used for calculations)
  const [draftBw, setDraftBw] = useState(2);
  const [draftColor, setDraftColor] = useState(8);
  const [priceBw, setPriceBw] = useState(2);
  const [priceColor, setPriceColor] = useState(8);
  const [justSaved, setJustSaved] = useState(false);

  const isDirty = draftBw !== priceBw || draftColor !== priceColor;

  const handleSave = () => {
    setPriceBw(draftBw);
    setPriceColor(draftColor);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const docPrice = (doc) => {
    const rate = doc.color === "color" ? priceColor : priceBw;
    return doc.pages * doc.copies * rate;
  };

  const toggleExpand = (customerId) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  const deleteCustomer = (customerId) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    if (expandedCustomer === customerId) setExpandedCustomer(null);
  };

  return (
    <div className="min-h-screen bg-emerald-50/50 p-6">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Print Orders Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            All documents submitted by your customers.
          </p>
        </div>

        {/* Pricing Model */}
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
                <FileText size={13} className="text-emerald-500" /> Black &amp; White (per page)
              </label>
              <div className="relative">
                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
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
                <Palette size={13} className="text-emerald-500" /> Colorful (per page)
              </label>
              <div className="relative">
                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
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
              These rates apply per printed page and are used to calculate each document's price below.
            </p>
            <button
              onClick={handleSave}
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

        {/* Customer list */}
        <div className="space-y-3">
          {customers.length === 0 && (
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-10 text-center text-gray-400 text-sm">
              No orders yet.
            </div>
          )}

          {customers.map((customer) => {
            const isOpen = expandedCustomer === customer.id;
            const customerTotal = customer.documents.reduce((s, d) => s + docPrice(d), 0);

            return (
              <div
                key={customer.id}
                className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden"
              >
                {/* Row */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm">
                      {customer.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                      <p className="text-xs text-gray-400">
                        {customer.documents.length} document{customer.documents.length !== 1 ? "s" : ""} • ₹{customerTotal}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(customer.id)}
                      className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border transition-colors ${
                        isOpen
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-emerald-50/60 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                      }`}
                    >
                      Documents
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <button
                      onClick={() => deleteCustomer(customer.id)}
                      className="p-2 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Remove customer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Expanded documents */}
                {isOpen && (
                  <div className="border-t border-emerald-50 bg-emerald-50/30 px-5 py-4 space-y-3">
                    {customer.documents.map((doc, idx) => (
                      <div
                        key={doc.id}
                        className="bg-white rounded-xl border border-emerald-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                      >
                        {/* Doc info */}
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-600 shrink-0">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <FileText size={14} className="text-emerald-500 shrink-0" />
                              <p className="text-sm font-medium text-gray-800 truncate">{doc.fileName}</p>
                            </div>

                            {/* Specs */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FileStack size={12} className="text-emerald-400" /> {doc.pages} pages
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
                                <FileStack size={12} className="text-emerald-400" /> Range: {doc.range}
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
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}