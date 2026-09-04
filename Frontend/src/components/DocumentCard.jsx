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
  Trash2,
} from "lucide-react";

import { updatePrintStatus } from "../services/OwnerServices";
import {
  connectQzAndListPrinters,
  printPdfDocument,
} from "../services/qzService";

const getButtonState = (state) => {
  const states = {
    connecting: {
      label: "Connecting...",
      disabled: true,
      className: "bg-yellow-500 hover:bg-yellow-600",
    },
    printing: {
      label: "Printing...",
      disabled: true,
      className: "bg-emerald-600 hover:bg-emerald-700",
    },
    success: {
      label: "Printed successfully",
      disabled: true,
      className: "bg-green-600 hover:bg-green-700",
    },
    failed: {
      label: "Retry print",
      disabled: false,
      className: "bg-red-500 hover:bg-red-600",
    },
    "not-installed": {
      label: "QZ not ready",
      disabled: true,
      className: "bg-gray-400 hover:bg-gray-400",
    },
    "printer-unavailable": {
      label: "No printers",
      disabled: true,
      className: "bg-gray-400 hover:bg-gray-400",
    },
    idle: {
      label: "Print",
      disabled: false,
      className: "bg-emerald-500 hover:bg-emerald-600",
    },
  };

  return states[state] || states.idle;
};

const getPrinterMessage = (state) => {
  const messages = {
    "not-installed": "QZ Tray not running",
    "printer-unavailable": "Printer unavailable",
    idle: "Click Print to connect",
  };

  return messages[state] || messages.idle;
};

const PrintStateIcon = ({ state }) => {
  const icons = {
    printing: <Loader2 size={14} className="animate-spin" />,
    success: <Check size={14} />,
    failed: <AlertCircle size={14} />,
  };

  return icons[state] || <Printer size={14} />;
};

const DocumentDetails = ({ doc }) => (
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
        <RectangleHorizontal size={12} className="text-emerald-400" />
      ) : (
        <RectangleVertical size={12} className="text-emerald-400" />
      )}

      {doc.layout === "landscape" ? "Landscape" : "Portrait"}
    </span>

    <span className="flex items-center gap-1">
      <FileStack size={12} className="text-emerald-400" />
      Range: {doc.range}
    </span>
  </div>
);

const DocumentHeader = ({
  doc,
  idx,
  buttonState,
  printerState,
  onPrint,
  onDelete,
  isDeleting,
}) => (
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

        <DocumentDetails doc={doc} />
      </div>
    </div>

    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
      <span className="flex items-center text-sm font-semibold text-gray-800">
        <IndianRupee size={13} />
        {doc.price}
      </span>

      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className="rounded-xl border border-red-100 p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        title="Delete job"
        aria-label={`Delete ${doc.fileName}`}
      >
        <Trash2 size={15} />
      </button>

      <button
        type="button"
        onClick={onPrint}
        disabled={buttonState.disabled}
        className={`flex items-center gap-1.5 text-sm font-medium text-white px-3 py-2 rounded-xl transition-colors ${buttonState.className}`}
      >
        <PrintStateIcon state={printerState} />
        {buttonState.label}
      </button>
    </div>
  </div>
);

const PrinterSelector = ({
  availablePrinters,
  selectedPrinter,
  printerState,
  isRefreshingPrinters,
  onPrinterChange,
  onRefresh,
}) => {
  const hasPrinters = availablePrinters.length > 0;

  if (hasPrinters) {
    return (
      <div className="flex items-center gap-2">
        <select
          value={selectedPrinter}
          onChange={(event) => onPrinterChange(event.target.value)}
          className="rounded-lg border border-emerald-200 bg-white px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          {availablePrinters.map((printer) => (
            <option key={printer} value={printer}>
              {printer}
            </option>
          ))}
        </select>

        <RefreshButton
          isRefreshing={isRefreshingPrinters}
          onRefresh={onRefresh}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{getPrinterMessage(printerState)}</span>

      <RefreshButton
        isRefreshing={isRefreshingPrinters}
        onRefresh={onRefresh}
      />
    </div>
  );
};

const RefreshButton = ({ isRefreshing, onRefresh }) => (
  <button
    type="button"
    onClick={onRefresh}
    disabled={isRefreshing}
    className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-[11px] font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {isRefreshing ? "Refreshing..." : "Refresh"}
  </button>
);

const PrinterSection = ({
  availablePrinters,
  selectedPrinter,
  printerState,
  isRefreshingPrinters,
  onPrinterChange,
  onRefresh,
}) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span className="font-medium text-gray-600">Printer:</span>

      <PrinterSelector
        availablePrinters={availablePrinters}
        selectedPrinter={selectedPrinter}
        printerState={printerState}
        isRefreshingPrinters={isRefreshingPrinters}
        onPrinterChange={onPrinterChange}
        onRefresh={onRefresh}
      />
    </div>
  </div>
);

const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
      <AlertCircle size={14} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
};

const PreviousError = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <span className="text-xs text-red-500">Previous error: {message}</span>
  );
};

const getPrintOptions = (doc, printerName) => ({
  printerName,
  jobId: doc.jobId,
  documentIndex: doc.documentIndex,
  fileUrl: doc.fileUrl,
  copies: doc.copies,
  sides: doc.sides,
  layout: doc.layout,
  color: doc.color,
  pagesPerSheet: doc.pagesPerSheet,
  pageSelection: doc.pageSelection,
  customPages: doc.customPages,
  pageRange: doc.range === "All" ? "" : doc.range,
});

export default function DocumentCard({ doc, idx, onDeleteJob }) {
  const [printerState, setPrinterState] = useState("idle");
  const [availablePrinters, setAvailablePrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [printerError, setPrinterError] = useState("");
  const [isRefreshingPrinters, setIsRefreshingPrinters] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshPrinters = async () => {
    setIsRefreshingPrinters(true);
    setPrinterError("");

    try {
      const { printers } = await connectQzAndListPrinters();

      if (!printers.length) {
        setAvailablePrinters([]);
        setSelectedPrinter("");
        setPrinterState("printer-unavailable");
        setPrinterError("No local printers were found.");
        return;
      }

      setAvailablePrinters(printers);
      setSelectedPrinter((current) => current || printers[0]);
      setPrinterState("idle");
    } catch (error) {
      console.error("REFRESH PRINTERS ERROR:", error);

      setAvailablePrinters([]);
      setSelectedPrinter("");
      setPrinterState("not-installed");
      setPrinterError(error.message || "Unable to refresh printers.");
    } finally {
      setIsRefreshingPrinters(false);
    }
  };

  const findPrinter = async () => {
    const { printers } = await connectQzAndListPrinters();

    if (!printers.length) {
      setAvailablePrinters([]);
      setSelectedPrinter("");
      setPrinterState("printer-unavailable");
      setPrinterError("No local printers were found.");
      return null;
    }

    const printerName = printers[0];

    setAvailablePrinters(printers);
    setSelectedPrinter(printerName);

    return printerName;
  };

  const getPrinterName = async () => {
    if (selectedPrinter) {
      return selectedPrinter;
    }

    return findPrinter();
  };

  const updateJobStatus = async (status, errorMessage) => {
    if (!doc.jobId) {
      return;
    }

    await updatePrintStatus(doc.jobId, status, errorMessage);
  };

  const handlePrint = async () => {
    setPrinterError("");
    setPrinterState("connecting");

    try {
      const printerName = await getPrinterName();

      if (!printerName) {
        return;
      }

      setPrinterState("printing");

      await updateJobStatus("Printing");

      await printPdfDocument(getPrintOptions(doc, printerName));

      await updateJobStatus("Completed");

      setPrinterState("success");
    } catch (error) {
      console.error("PRINT ERROR:", error);

      setPrinterState("failed");
      setPrinterError(error.message || "Printing failed.");

      try {
        await updateJobStatus("Failed", error.message || "Printing failed.");
      } catch (statusError) {
        console.error("UPDATE PRINT STATUS ERROR:", statusError);
      }
    }
  };

  const buttonState = getButtonState(printerState);

  const handleDelete = async () => {
    if (
      !doc.jobId ||
      isDeleting ||
      !window.confirm(`Delete ${doc.fileName}?`)
    ) {
      return;
    }

    setIsDeleting(true);
    setPrinterError("");

    try {
      await onDeleteJob(doc.jobId);
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);
      setPrinterError(
        error.response?.data?.message || "Unable to delete this job.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-emerald-100 p-4 flex flex-col gap-4">
      <DocumentHeader
        doc={doc}
        idx={idx}
        buttonState={buttonState}
        printerState={printerState}
        onPrint={handlePrint}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      <PrinterSection
        availablePrinters={availablePrinters}
        selectedPrinter={selectedPrinter}
        printerState={printerState}
        isRefreshingPrinters={isRefreshingPrinters}
        onPrinterChange={setSelectedPrinter}
        onRefresh={refreshPrinters}
      />

      <PreviousError message={doc.errorMessage} />

      <ErrorMessage message={printerError} />
    </div>
  );
}
