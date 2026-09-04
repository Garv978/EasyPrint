import { ChevronDown } from "lucide-react";
import DocumentCard from "./DocumentCard";

export default function CustomerCard({
  customer,
  isOpen,
  toggleExpand,
  onDeleteJob,
}) {
  const customerTotal = customer.documents.reduce(
    (sum, document) => sum + document.price,
    0,
  );
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
      {/* Row */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm">
            {customer.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
            <p className="text-xs text-gray-400">
              {customer.documents.length} document
              {customer.documents.length !== 1 ? "s" : ""} • ₹{customerTotal}
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
        </div>
      </div>

      {/* Expanded documents */}
      {isOpen && (
        <div className="border-t border-emerald-50 bg-emerald-50/30 px-5 py-4 space-y-3">
          {customer.documents.map((doc, idx) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              idx={idx}
              onDeleteJob={onDeleteJob}
            />
          ))}
        </div>
      )}
    </div>
  );
}
