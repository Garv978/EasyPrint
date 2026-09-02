import * as qz from "qz-tray";
import API from "../api";

/*
 * QZ Tray frontend service
 *
 * Responsibilities:
 *  - Configure QZ Tray security
 *  - Connect to the local QZ Tray application
 *  - Discover local printers
 *  - Send PDF print jobs
 *
 * IMPORTANT:
 *  The private QZ signing key NEVER exists in this file.
 *  Signing is performed by the backend through /qz/sign.
 */

let securityConfigured = false;

/**
 * Configure QZ Tray's certificate and signing callbacks.
 *
 * The browser receives the PUBLIC certificate from:
 *
 *     GET /qz/certificate
 *
 * The browser sends data to be signed to:
 *
 *     GET /qz/sign
 *
 * The backend performs the actual RSA-SHA512 signing
 * using private-key.pem.
 */
const configureQzSecurity = () => {
  if (securityConfigured) {
    return;
  }

  /*
   * Public QZ certificate
   */
  qz.security.setCertificatePromise(
    (resolve, reject) => {
      fetch(
        `${API.defaults.baseURL}/qz/certificate`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
          },
        }
      )
        .then(async (response) => {
          if (!response.ok) {
            const errorText =
              await response.text();

            throw new Error(
              errorText ||
                `Failed to retrieve QZ certificate (${response.status}).`
            );
          }

          return response.text();
        })
        .then((certificate) => {
          if (!certificate.trim()) {
            throw new Error(
              "QZ certificate response was empty."
            );
          }

          resolve(certificate);
        })
        .catch(reject);
    }
  );

  /*
   * QZ uses SHA-512 for signing.
   */
  qz.security.setSignatureAlgorithm(
    "SHA512"
  );

  /*
   * Server-side signature.
   *
   * The private key is NOT sent to the browser.
   */
  qz.security.setSignaturePromise(
    (toSign) => {
      return (resolve, reject) => {
        if (!toSign) {
          reject(
            new Error(
              "QZ signing payload is empty."
            )
          );

          return;
        }

        fetch(
          `${API.defaults.baseURL}/qz/sign?request=${encodeURIComponent(
            toSign
          )}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: {
              "Cache-Control":
                "no-store, no-cache, must-revalidate, proxy-revalidate",
              Pragma: "no-cache",
            },
          }
        )
          .then(async (response) => {
            if (!response.ok) {
              const errorText =
                await response.text();

              throw new Error(
                errorText ||
                  `QZ signing failed (${response.status}).`
              );
            }

            return response.text();
          })
          .then((signature) => {
            if (!signature.trim()) {
              throw new Error(
                "QZ signing server returned an empty signature."
              );
            }

            resolve(signature);
          })
          .catch(reject);
      };
    }
  );

  securityConfigured = true;
};

/**
 * Connect to the local QZ Tray application.
 */
export const connectQz = async () => {
  configureQzSecurity();

  /*
   * If QZ Tray is already connected, reuse it.
   */
  if (qz.websocket.isActive()) {
    return qz;
  }

  try {
    await qz.websocket.connect();

    console.log(
      "QZ Tray connected successfully."
    );

    return qz;
  } catch (error) {
    console.error(
      "QZ Tray connection failed:",
      error
    );

    throw new Error(
      "Unable to connect to QZ Tray. Make sure the QZ Tray desktop application is installed and running.",
      {cause:error}
    );
  }
};

/**
 * Find all printers available to the computer
 * running QZ Tray.
 */
export const listPrinters = async () => {
  const qzInstance = await connectQz();

  try {
    const printers =
      await qzInstance.printers.find();

    const printerList = Array.isArray(
      printers
    )
      ? printers
      : [];

    console.log(
      "AVAILABLE PRINTERS:",
      printerList
    );

    return printerList;
  } catch (error) {
    console.error(
      "Printer discovery failed:",
      error
    );

    throw new Error(
      "QZ Tray connected, but the available printers could not be retrieved.",
        { cause: error }
    );
  }
};

/**
 * Connect to QZ Tray and return its available printers.
 *
 * This is kept as a separate exported function because
 * your DocumentCard currently uses this functionality.
 */
export const connectQzAndListPrinters =
  async () => {
    const qzInstance =
      await connectQz();

    const printers =
      await listPrinters();

    return {
      qz: qzInstance,
      printers,
    };
  };

/**
 * Build the QZ printer configuration.
 */
const createPrintConfig = ({
  qzInstance,
  printerName,
  copies,
  sides,
  layout,
  color,
  pagesPerSheet,
}) => {
  if (!printerName) {
    throw new Error(
      "No printer was selected."
    );
  }

  const normalizedCopies =
    Number(copies) > 0
      ? Number(copies)
      : 1;

  const normalizedPagesPerSheet =
    [1, 2, 4, 6, 9, 16].includes(
      Number(pagesPerSheet)
    )
      ? Number(pagesPerSheet)
      : 1;

  const normalizedSides =
    String(sides).toLowerCase() === "double-sided" ||
    String(sides).toLowerCase() === "double"
      ? "duplex"
      : "one-sided";

  const normalizedLayout =
    String(layout).toLowerCase() === "landscape" ||
    String(layout).toLowerCase() === "landscape"
      ? "landscape"
      : "portrait";

  const normalizedColor =
    String(color).toLowerCase() === "color"
      ? "color"
      : "blackwhite";

  return qzInstance.configs.create(
    printerName,
    {
      copies: normalizedCopies,
      duplex: normalizedSides,
      orientation: normalizedLayout,
      colorType: normalizedColor,
      nUp: normalizedPagesPerSheet,
      pagesPerSheet: normalizedPagesPerSheet,
      jobName: `EasyPrint-${Date.now()}`,
      scaleContent: true,
    }
  );
};

/**
 * Fetch the actual document bytes from Cloudinary and convert them into
 * the format QZ Tray accepts for printing.
 */
const fetchCloudinaryDocument = async ({ fileUrl, jobId, documentIndex }) => {
  if (!fileUrl) {
    throw new Error(
      "No document URL is available for this job."
    );
  }

  try {
    let documentUrl = fileUrl;

    if (jobId && Number.isInteger(documentIndex)) {
      const urlResponse = await fetch(
        `${API.defaults.baseURL}/qz/document/${jobId}/${documentIndex}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!urlResponse.ok) {
        throw new Error(
          `Unable to authorize document download (${urlResponse.status}).`,
        );
      }

      const urlPayload = await urlResponse.json();
      documentUrl = urlPayload.url;
    }

    const response = await fetch(documentUrl, {
      method: "GET",
      cache: "no-store",
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(
        `Cloudinary fetch failed (${response.status}).`
      );
    }

    const blob = await response.blob();
    const contentType =
      (blob.type || response.headers.get("content-type") || "")
        .split(";")[0]
        .trim()
        .toLowerCase();

    const supportedTypes = new Set([
      "application/pdf",
      "image/jpeg",
      "image/png",
    ]);

    if (!supportedTypes.has(contentType)) {
      throw new Error(
        `Unsupported document type: ${contentType || "unknown"}`
      );
    }

    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;

        if (typeof result !== "string") {
          reject(
            new Error(
              "Failed to convert document data to base64."
            )
          );
          return;
        }

        const payload = result.includes(",")
          ? result.split(",")[1]
          : result;

        resolve(payload);
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Failed to read the document data from Cloudinary."
          )
        );
      };

      reader.readAsDataURL(blob);
    });

    return {
      mimeType: contentType,
      base64,
    };
  } catch (error) {
    console.error(
      "CLOUDINARY FETCH FAILED:",
      error
    );

    throw new Error(
      error?.message ||
        "Unable to fetch the document content from Cloudinary.",
          { cause: error }
    );
  }
};

/**
 * Normalize PDF page ranges before sending them to QZ Tray.
 * Accepts values like "1-5" or "1-3,5-7" and rejects malformed ranges.
 */
const normalizePdfPageRange = (pageRange) => {
  if (!pageRange) {
    return null;
  }

  const trimmed = String(pageRange).trim();

  if (!trimmed || trimmed === "All" || trimmed === "all") {
    return null;
  }

  const normalized = trimmed.replace(/\s+/g, "");
  const ranges = normalized.split(",");

  const validatedRanges = ranges.map((rangePart) => {
    if (!/^\d+-\d+$/.test(rangePart)) {
      throw new Error(
        "Invalid custom page range. Use format like 1-5 or 1-3,5-7."
      );
    }

    const [start, end] = rangePart.split("-").map(Number);

    if (
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < 1 ||
      end < start
    ) {
      throw new Error(
        "Invalid custom page range. Start must be >= 1 and end must be >= start."
      );
    }

    return `${start}-${end}`;
  });

  return validatedRanges.join(",");
};

/**
 * Build the QZ print data using the actual file bytes retrieved from Cloudinary.
 */
const createQzPrintData = async ({
  fileUrl,
  jobId,
  documentIndex,
  pageRange,
}) => {
  if (!fileUrl) {
    throw new Error(
      "No document URL is available for this job."
    );
  }

  const { mimeType, base64 } = await fetchCloudinaryDocument({
    fileUrl,
    jobId,
    documentIndex,
  });

  if (mimeType === "application/pdf") {
    const pdfData = {
      type: "pixel",
      format: "pdf",
      flavor: "base64",
      data: base64,
    };

    const normalizedPageRange = normalizePdfPageRange(pageRange);

    if (normalizedPageRange) {
      pdfData.options = {
        pageRanges: normalizedPageRange,
      };
    }

    return [pdfData];
  }

  if (
    mimeType === "image/jpeg" ||
    mimeType === "image/png"
  ) {
    return [
      {
        type: "pixel",
        format: "image",
        flavor: "base64",
        data: `data:${mimeType};base64,${base64}`,
      },
    ];
  }

  throw new Error(
    `Unsupported document type: ${mimeType || "unknown"}`
  );
};

/**
 * Print a PDF document.
 *
 * printerName is optional.
 *
 * If printerName isn't provided, the first
 * printer discovered on the shop owner's
 * computer will be used.
 */
export const printPdfDocument =
  async ({
    printerName,
    jobId,
    documentIndex,
    fileUrl,
    copies,
    sides,
    layout,
    color,
    pageRange,
    pagesPerSheet,
    pageSelection,
    customPages,
  }) => {
    if (!fileUrl) {
      throw new Error(
        "No document URL is available for this job."
      );
    }

    const {
      qz: qzInstance,
      printers,
    } =
      await connectQzAndListPrinters();

    const selectedPrinter =
      printerName || printers[0];

    if (!selectedPrinter) {
      throw new Error(
        "No local printers were found. Install or connect a printer on the computer running QZ Tray."
      );
    }

    console.log(
      "SELECTED PRINTER:",
      selectedPrinter
    );

    const config =
      createPrintConfig({
        qzInstance,
        printerName:
          selectedPrinter,
        copies,
        sides,
        layout,
        color,
        pagesPerSheet,
      });

    const resolvedPageRange =
      pageRange ||
      (pageSelection === "Custom" && customPages ? customPages : "All");

    const printData =
      await createQzPrintData({
        fileUrl,
        jobId,
        documentIndex,
        pageRange: resolvedPageRange,
      });

    console.log(
      "PRINT CONFIG:",
      {
        printer: selectedPrinter,
        copies,
        sides,
        layout,
        color,
        pageRange: resolvedPageRange,
        pagesPerSheet,
        pageSelection,
        customPages,
      }
    );

    console.log(
      "SENDING DOCUMENT TO PRINTER..."
    );

    try {
      await qzInstance.print(
        config,
        printData
      );

      console.log(
        "PRINT REQUEST SENT SUCCESSFULLY"
      );

      return selectedPrinter;
    } catch (error) {
      console.error(
        "QZ PRINT FAILED:",
        error
      );

      throw new Error(
        error?.message ||
          "QZ Tray failed to send the document to the printer.",
            { cause: error }
      );
    }
  };

/**
 * Disconnect QZ Tray.
 *
 * This is optional and normally should NOT be
 * called after every print.
 *
 * It is useful when the dashboard is being
 * completely shut down or when you explicitly
 * want to close the QZ connection.
 */
export const disconnectQz =
  async () => {
    if (!qz.websocket.isActive()) {
      return;
    }

    try {
      await qz.websocket.disconnect();

      console.log(
        "QZ Tray disconnected."
      );
    } catch (error) {
      console.error(
        "QZ Tray disconnect failed:",
        error
      );
    }
  };