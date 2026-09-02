import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import FileUploadSection from "../components/FileUploadSection";
import PrintOptionsSection from "../components/PrintOptionsSection";
import ProductCardsSection from "../components/ProductCardsSection";

import {
  uploadFiles,
  getMyUserJobs,
} from "../services/UserServices";

import socket from "../socket";

export default function UserDashboard() {
  const { shopCode } = useParams();

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

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

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
    const val = e.target.value.replace(/\D/g, "");
    setCustomCopies(val);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) {
      return;
    }

    setFiles(selectedFiles);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, i) => i !== index),
    );
  };

  useEffect(() => {
    let cancelled = false;

    const loadJobs = async () => {
      try {
        const response = await getMyUserJobs();

        if (!cancelled) {
          setJobs(response.data?.jobs ?? []);
        }
      } catch (error) {
        console.error("GET USER JOBS ERROR:", error);
        console.error("STATUS:", error.response?.status);
        console.error("SERVER ERROR:", error.response?.data);

        if (error.response?.status === 401) {
          window.dispatchEvent(new Event("authChange"));
        }
      } finally {
        if (!cancelled) {
          setJobsLoading(false);
        }
      }
    };

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleJobCreated = (job) => {
      if (!job?._id) {
        return;
      }

      setJobs((prevJobs) => {
        const alreadyExists = prevJobs.some(
          (existingJob) => existingJob._id === job._id,
        );

        if (alreadyExists) {
          return prevJobs;
        }

        return [job, ...prevJobs];
      });
    };

    const handleJobStatusUpdate = (update) => {
      if (!update?.jobId) {
        return;
      }

      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (String(job._id) !== String(update.jobId)) {
            return job;
          }

          return {
            ...job,
            status: update.status,
            errorMessage: update.errorMessage || "",
          };
        }),
      );
    };

    socket.on("job-created", handleJobCreated);
    socket.on("job-status-update", handleJobStatusUpdate);

    return () => {
      socket.off("job-created", handleJobCreated);
      socket.off("job-status-update", handleJobStatusUpdate);
    };
  }, []);

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
      formData.append(
        "copies",
        customCopies !== "" ? customCopies : copies,
      );
      formData.append("sides", sides);
      formData.append("layout", layout);
      formData.append("pagesPerSheet", pagesPerSheet);
      formData.append("pageRange", pageRange);

      if (pageRange === "custom") {
        formData.append("fromPage", fromPage);
        formData.append("toPage", toPage);
      }

      const response = await uploadFiles(shopCode, formData);
      const newJob = response.data?.job;

      if (newJob) {
        setJobs((prevJobs) => {
          const alreadyExists = prevJobs.some(
            (job) => job._id === newJob._id,
          );

          if (alreadyExists) {
            return prevJobs;
          }

          return [newJob, ...prevJobs];
        });
      }

      setUploadedFiles(response.data?.fileNames || []);
      setFiles([]);
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      console.error("SERVER ERROR:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Something went wrong while uploading your files.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700";

      case "Printing":
        return "bg-blue-100 text-blue-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      case "Cancelled":
        return "bg-gray-100 text-gray-700";

      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "Pending":
        return "Waiting for the shop to start printing.";

      case "Printing":
        return "Your documents are currently being printed.";

      case "Completed":
        return "Your print job has been completed.";

      case "Failed":
        return "Something went wrong while printing.";

      case "Cancelled":
        return "This print job was cancelled.";

      default:
        return "";
    }
  };

  const getPageLabel = (count) => {
    if (count === 1) {
      return "page";
    }

    return "pages";
  };

  const getCopyLabel = (count) => {
    if (count === 1) {
      return "copy";
    }

    return "copies";
  };

  const getChargedPageLabel = (count) => {
    if (count === 1) {
      return "charged page";
    }

    return "charged pages";
  };

  const renderJobsContent = () => {
    if (jobsLoading) {
      return (
        <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading your print jobs...
          </p>
        </div>
      );
    }

    if (jobs.length === 0) {
      return (
        <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl">
            🖨️
          </div>

          <h3 className="mt-4 font-semibold text-slate-800">
            No print jobs yet
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Upload a document to create your first print job.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">
                    Print Job
                  </h3>

                  <span className="text-xs text-slate-400">
                    #{String(job._id).slice(-6)}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleString()
                    : "Recently submitted"}
                </p>
              </div>

              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
                  job.status,
                )}`}
              >
                {job.status || "Pending"}
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-700">
                {getStatusMessage(job.status)}
              </p>

              {job.status === "Failed" && job.errorMessage && (
                <p className="mt-1 text-sm text-red-600">
                  {job.errorMessage}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              {job.documents?.map((document) => {
                const pageCount = document.pages ?? 0;
                const chargedPageCount = document.chargedPages;

                return (
                  <div
                    key={document._id}
                    className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {document.fileName}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span>
                          {pageCount} {getPageLabel(pageCount)}
                        </span>

                        {chargedPageCount !== undefined && (
                          <span>
                            {chargedPageCount}{" "}
                            {getChargedPageLabel(chargedPageCount)}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-slate-800">
                      ₹{document.price ?? 0}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {job.printOptions?.color && (
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {job.printOptions.color}
                </span>
              )}

              {job.printOptions?.copies !== undefined && (
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {job.printOptions.copies}{" "}
                  {getCopyLabel(job.printOptions.copies)}
                </span>
              )}

              {job.printOptions?.sides && (
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {job.printOptions.sides}
                </span>
              )}

              {job.printOptions?.layout && (
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {job.printOptions.layout}
                </span>
              )}

              {job.printOptions?.pagesPerSheet && (
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {job.printOptions.pagesPerSheet} per sheet
                </span>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-medium text-slate-500">
                Total price
              </span>

              <span className="text-lg font-bold text-emerald-700">
                ₹{job.totalPrice ?? 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
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

        <div className="space-y-4 pt-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              My Print Jobs
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track your submitted documents and printing status
              in real time.
            </p>
          </div>

          {renderJobsContent()}
        </div>

        <ProductCardsSection />
      </div>
    </div>
  );
}