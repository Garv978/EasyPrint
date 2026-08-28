import { useState } from "react";
import {
  Copy,
  FileStack,
  FileText,
  IndianRupee,
  Palette,
  Printer,
  RectangleHorizontal,
  RectangleVertical,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";

import { updatePrintStatus } from "../services/OwnerServices";
import {
  connectQzAndListPrinters,
  printPdfDocument,
} from "../services/qzService";

const getButtonState = (state) => {
  switch (state) {
    case "connecting":
      return {
        label: "Connecting...",
        disabled: true,
        className: "bg-yellow-500 hover:bg-yellow-600",
      };

    case "printing":
      return {
        label: "Printing...",
        disabled: true,
        className: "bg-emerald-600 hover:bg-emerald-700",
      };

    case "success":
      return {
        label: "Printed",
        disabled: true,
        className: "bg-green-600 hover:bg-green-700",
      };

    case "failed":
      return {
        label: "Retry print",
        disabled: false,
        className: "bg-red-500 hover:bg-red-600",
      };

    case "not-installed":
      return {
        label: "QZ not ready",
        disabled: true,
        className: "bg-gray-400 hover:bg-gray-400",
      };

    case "printer-unavailable":
      return {
        label: "No printers",
        disabled: true,
        className: "bg-gray-400 hover:bg-gray-400",
      };

    default:
      return {
        label: "Print",
        disabled: false,
        className: "bg-emerald-500 hover:bg-emerald-600",
      };
  }
};

export default function DocumentCard({ doc, idx }) {
  const [printerState, setPrinterState] = useState("idle");
  const [availablePrinters, setAvailablePrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [printerError, setPrinterError] = useState("");

  const handlePrint = async () => {
    try {
      setPrinterError("");
      setPrinterState("connecting");

      let printerName = selectedPrinter;

      // Connect to QZ Tray and discover printers if no printer is selected.
      if (!printerName) {
        const { printers } = await connectQzAndListPrinters();

        if (!printers.length) {
          setAvailablePrinters([]);
          setSelectedPrinter("");
          setPrinterState("printer-unavailable");
          setPrinterError("No local printers were found.");
          return;
        }

        printerName = printers[0];

        setAvailablePrinters(printers);
        setSelectedPrinter(printerName);
      }

      setPrinterState("printing");

      if (doc.jobId) {
        await updatePrintStatus(doc.jobId, "Printing");
      }

      await printPdfDocument({
        printerName,
        fileUrl: doc.fileUrl,
        copies: doc.copies,
        sides: doc.sides,
        layout: doc.layout,
        color: doc.color,
        pageRange: doc.range === "All" ? "" : doc.range,
      });

      if (doc.jobId) {
        await updatePrintStatus(doc.jobId, "Completed");
      }

      setPrinterState("success");
    } catch (error) {
      console.error("PRINT ERROR:", error);

      setPrinterState("failed");
      setPrinterError(error.message || "Printing failed.");

      if (doc.jobId) {
        await updatePrintStatus(
          doc.jobId,
          "Failed",
          error.message || "Printing failed.",
        );
      }
    }
  };

  const buttonState = getButtonState(printerState);

  return (
    <div className="bg-white rounded-xl border border-emerald-100 p-4 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FileStack size={12} className="text-emerald-400" />
                {doc.pages} pages
              </span>

              {doc.range !== "All" && (
                <span className="flex items-center gap-1">
                  <FileStack size={12} className="text-emerald-400" />
                  Charged: {doc.chargedPages} pages
                </span>
              )}

              <span className="flex items-center gap-1">
                <Palette size={12} className="text-emerald-400" />
                {doc.color === "Color" ? "Colorful" : "Black & White"}
              </span>

              <span className="flex items-center gap-1">
                <Copy size={12} className="text-emerald-400" />
                {doc.copies} {doc.copies === 1 ? "copy" : "copies"}
              </span>

              <span className="flex items-center gap-1">
                {doc.layout === "landscape" ? (
                  <RectangleHorizontal
                    size={12}
                    className="text-emerald-400"
                  />
                ) : (
                  <RectangleVertical
                    size={12}
                    className="text-emerald-400"
                  />
                )}

                {doc.layout === "landscape" ? "Landscape" : "Portrait"}
              </span>

              <span className="flex items-center gap-1">
                <FileStack size={12} className="text-emerald-400" />
                Range: {doc.range}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <span className="flex items-center text-sm font-semibold text-gray-800">
            <IndianRupee size={13} />
            {doc.price}
          </span>

          <button
            type="button"
            onClick={handlePrint}
            disabled={buttonState.disabled}
            className={`flex items-center gap-1.5 text-sm font-medium text-white px-3 py-2 rounded-xl transition-colors ${buttonState.className}`}
          >
            {printerState === "printing" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : printerState === "success" ? (
              <Check size={14} />
            ) : printerState === "failed" ? (
              <AlertCircle size={14} />
            ) : (
              <Printer size={14} />
            )}

            {buttonState.label}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-600">Printer:</span>

          {availablePrinters.length > 0 ? (
            <select
              value={selectedPrinter}
              onChange={(event) => setSelectedPrinter(event.target.value)}
              className="rounded-lg border border-emerald-200 bg-white px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              {availablePrinters.map((printer) => (
                <option key={printer} value={printer}>
                  {printer}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-gray-400">
              {printerState === "not-installed"
                ? "QZ Tray not running"
                : printerState === "printer-unavailable"
                  ? "Printer unavailable"
                  : "Click Print to connect"}
            </span>
          )}
        </div>

        {doc.errorMessage && (
          <span className="text-xs text-red-500">
            Previous error: {doc.errorMessage}
          </span>
        )}
      </div>

      {printerError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{printerError}</span>
        </div>
      )}
    </div>
  );
}