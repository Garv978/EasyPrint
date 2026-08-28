import API from "../api";

const QZ_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/qz-tray@2.1.0/qz-tray.js";

let qzPromise;

const loadQzScript = async () => {
  if (window.qz) {
    return window.qz;
  }

  if (qzPromise) {
    return qzPromise;
  }

  qzPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector("script[data-qz-tray]");

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.qz), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("QZ Tray script failed to load.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = QZ_SCRIPT_URL;
    script.async = true;
    script.dataset.qzTray = "true";

    script.onload = () => {
      if (window.qz) {
        resolve(window.qz);
        return;
      }

      reject(new Error("QZ Tray loaded but the window.qz API could not be found."));
    };

    script.onerror = () => {
      reject(new Error("QZ Tray failed to load. Please confirm the QZ Tray app is installed and running."));
    };

    document.head.appendChild(script);
  });

  return qzPromise;
};

const configureQzSecurity = async (qz) => {
  qz.security.setCertificatePromise((resolve, reject) => {
    fetch(`${API.defaults.baseURL}/qz/certificate`, {
      credentials: "include",
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const serverError = await response.text();
          throw new Error(serverError || "Unable to fetch the QZ Tray certificate.");
        }

        return response.text();
      })
      .then(resolve)
      .catch(reject);
  });

  qz.security.setSignatureAlgorithm("SHA512");
  qz.security.setSignaturePromise((toSign) => {
    return (resolve, reject) => {
      fetch(`${API.defaults.baseURL}/qz/sign?request=${encodeURIComponent(toSign)}`, {
        credentials: "include",
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            const serverError = await response.text();
            throw new Error(serverError || "Unable to sign the print request.");
          }

          return response.text();
        })
        .then(resolve)
        .catch(reject);
    };
  });

  return qz;
};

export const connectQzAndListPrinters = async () => {
  const qz = await configureQzSecurity(await loadQzScript());

  await qz.websocket.connect();
  const printers = await qz.printers.find();

  return {
    qz,
    printers: Array.isArray(printers) ? printers : [],
  };
};

export const printPdfDocument = async ({
  printerName,
  fileUrl,
  copies,
  sides,
  layout,
  color,
  pageRange,
}) => {
  if (!fileUrl) {
    throw new Error("No PDF file URL is available for this job.");
  }

  const { qz, printers } = await connectQzAndListPrinters();

  const selectedPrinter = printerName || printers[0];

  if (!selectedPrinter) {
    throw new Error("No local printers are available. Connect a printer and ensure QZ Tray is running.");
  }

  const config = qz.configs.create(selectedPrinter, {
    copies: Number(copies) || 1,
    duplex: sides === "Double-sided" ? "duplex" : "one-sided",
    orientation: layout === "Landscape" ? "landscape" : "portrait",
    colorType: color === "Color" ? "color" : "blackwhite",
    jobName: `EasyPrint-${Date.now()}`,
    scaleContent: true,
  });

  const printData = [{
    type: "pdf",
    format: "pdf",
    flavor: "file",
    data: fileUrl,
    options: pageRange && pageRange !== "All" ? { pageRanges: pageRange } : undefined,
  }];

  await qz.print(config, printData);

  return selectedPrinter;
};
