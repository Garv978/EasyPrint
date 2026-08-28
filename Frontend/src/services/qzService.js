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
      "Unable to connect to QZ Tray. Make sure the QZ Tray desktop application is installed and running."
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
      "QZ Tray connected, but the available printers could not be retrieved."
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

  const duplex =
    sides === "Double-sided"
      ? "duplex"
      : "one-sided";

  const orientation =
    layout === "Landscape"
      ? "landscape"
      : "portrait";

  const colorType =
    color === "Color"
      ? "color"
      : "blackwhite";

  return qzInstance.configs.create(
    printerName,
    {
      copies: normalizedCopies,

      duplex,

      orientation,

      colorType,

      jobName: `EasyPrint-${Date.now()}`,

      scaleContent: true,
    }
  );
};

/**
 * Build the PDF print data.
 */
const createPdfPrintData = ({
  fileUrl,
  pageRange,
}) => {
  if (!fileUrl) {
    throw new Error(
      "No PDF file URL is available for this job."
    );
  }

  const pdfData = {
    type: "pixel",
    format: "pdf",
    flavor: "file",
    data: fileUrl,
  };

  if (
    pageRange &&
    pageRange !== "All"
  ) {
    pdfData.options = {
      pageRanges: pageRange,
    };
  }

  return [pdfData];
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
    fileUrl,
    copies,
    sides,
    layout,
    color,
    pageRange,
  }) => {
    if (!fileUrl) {
      throw new Error(
        "No PDF file URL is available for this job."
      );
    }

    const {
      qz: qzInstance,
      printers,
    } =
      await connectQzAndListPrinters();

    /*
     * If DocumentCard supplied a printer,
     * use it.
     *
     * Otherwise use the first printer found.
     */
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
      });

    const printData =
      createPdfPrintData({
        fileUrl,
        pageRange,
      });

    console.log(
      "PRINT CONFIG:",
      {
        printer: selectedPrinter,
        copies,
        sides,
        layout,
        color,
        pageRange,
      }
    );

    console.log(
      "SENDING PDF TO PRINTER..."
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
          "QZ Tray failed to send the document to the printer."
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