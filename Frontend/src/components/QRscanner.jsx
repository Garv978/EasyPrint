import { useEffect, useRef, useState, useCallback } from "react";
import { X, Zap, ZapOff, RotateCw, ImageOff } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

const SCAN_BOX = 400;

function classifyCameraError(err) {
  const name = err?.name || "";
  const message = String(err?.message || err || "");
  if (
    name === "NotAllowedError" ||
    name === "PermissionDeniedError" ||
    /permission denied/i.test(message)
  ) {
    return "denied";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "no-camera";
  }
  return "error";
}

function describeCameraError(err) {
  const name = err?.name || "";
  if (name === "NotReadableError" || name === "TrackStartError") {
    return "The camera is already in use by another app or tab. Close it and try again.";
  }
  if (name === "OverconstrainedError") {
    return "This camera doesn't support the requested settings.";
  }
  if (name === "SecurityError") {
    return "Camera access requires a secure (HTTPS) connection.";
  }
  return err?.message || "Couldn't start the camera.";
}

function QRScanner({ isOpen, onClose, onScanSuccess }) {
  const scannerRef = useRef(null);
  const containerId = "qr-reader";

  const [status, setStatus] = useState("idle"); // idle | starting | running | denied | no-camera | error
  const [errorMessage, setErrorMessage] = useState("");
  const [cameras, setCameras] = useState([]);
  const [cameraIndex, setCameraIndex] = useState(0);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  const isMountedRef = useRef(true);
  const startLockRef = useRef(false); // prevents two concurrent start() calls (e.g. React StrictMode double-effect)
  const scanLockRef = useRef(false);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
      scanner.clear();
    } catch (err) {
      // Stopping a scanner that never fully started throws — safe to ignore
      console.debug("QRScanner: stop() no-op", err);
    } finally {
      scannerRef.current = null;
    }
  }, []);

  const handleSuccess = (decodedText) => {
    if (scanLockRef.current) return;
    scanLockRef.current = true;
    setStatus("scanned");

    setTimeout(() => {
      stopScanner();
      onScanSuccess?.(decodedText);
    }, 1200);
  };

  const startScanner = useCallback(
    async (deviceId) => {
      if (startLockRef.current) return; // another start() is already in flight — ignore this one
      startLockRef.current = true;
      setStatus("starting");
      setErrorMessage("");
      try {
        // Defensive: html5-qrcode throws "HTML Element ... already contains child elements"
        // if the container wasn't cleared by a previous instance (common with StrictMode
        // double-effects or fast open/close). Clear it ourselves before creating a new one.
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = "";

        const scanner = new Html5Qrcode(containerId, { verbose: false });
        scannerRef.current = scanner;

        await scanner.start(
          deviceId,
          {
            fps: 8,
            qrbox: { width: SCAN_BOX, height: SCAN_BOX },
            aspectRatio: 1.0,
            disableFlip: false,
          },
          (decodedText) => {
            handleSuccess(decodedText);
          },
          () => {
            /* per-frame decode miss — expected while aiming, ignore */
          },
        );

        if (!isMountedRef.current) {
          await stopScanner();
          return;
        }

        // Check torch support on the live track
        const capabilities = scanner.getRunningTrackCapabilities?.();
        setTorchSupported(Boolean(capabilities?.torch));
        setStatus("running");
      } catch (err) {
        console.log("QRScanner: start error", err);
        if (!isMountedRef.current) return;
        const classified = classifyCameraError(err);
        setStatus(classified);
        if (classified === "error") setErrorMessage(describeCameraError(err));
      } finally {
        startLockRef.current = false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    isMountedRef.current = true;
    if (!isOpen) return;

    scanLockRef.current = false;

    let cancelled = false;

    (async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (cancelled) return;
        if (!devices || devices.length === 0) {
          setStatus("no-camera");
          return;
        }
        setCameras(devices);
        const rearIndex = devices.findIndex((d) =>
          /back|rear|environment/i.test(d.label),
        );
        const startIndex = rearIndex === -1 ? 0 : rearIndex;
        setCameraIndex(startIndex);
        await startScanner(devices[startIndex].id);
      } catch (err) {
        if (cancelled) return;
        console.log("QRScanner: getCameras error", err);
        const classified = classifyCameraError(err);
        setStatus(classified);
        if (classified === "error") setErrorMessage(describeCameraError(err));
      }
    })();

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      stopScanner();
      setTorchOn(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const switchCamera = async () => {
    if (cameras.length < 2 || status !== "running") return;
    const nextIndex = (cameraIndex + 1) % cameras.length;
    await stopScanner();
    setCameraIndex(nextIndex);
    setTorchOn(false);
    await startScanner(cameras[nextIndex].id);
  };

  const toggleTorch = async () => {
    const scanner = scannerRef.current;
    if (!scanner || !torchSupported) return;
    try {
      const next = !torchOn;
      await scanner.applyVideoConstraints({ advanced: [{ torch: next }] });
      setTorchOn(next);
    } catch (err) {
      console.log("QRScanner: torch toggle failed", err);
    }
  };

  const handleClose = async () => {
    await stopScanner();
    setTorchOn(false);
    onClose?.();
  };

  const retry = async () => {
    if (cameras[cameraIndex]) {
      await startScanner(cameras[cameraIndex].id);
    } else {
      setStatus("starting");
      // Re-trigger the full permission/device flow
      setCameras([]);
      const devices = await Html5Qrcode.getCameras().catch(() => []);
      if (devices.length) {
        setCameras(devices);
        await startScanner(devices[0].id);
      } else {
        setStatus("no-camera");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Camera feed target — html5-qrcode injects its <video> here */}
      <div
        id={containerId}
        className="absolute inset-0 h-full w-full [&_video]:object-cover! [&_video]:h-full! [&_video]:w-full!"
      />

      {/* Dimmed mask with a clear viewfinder cutout, GPay-style */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)" }}
      />

      {status === "running" && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: SCAN_BOX,
            height: SCAN_BOX,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
          }}
        >
          {/* Corner brackets */}
          <div className="absolute inset-0 rounded-2xl">
            {[
              "top-0 left-0 border-t-4 border-l-4 rounded-tl-2xl",
              "top-0 right-0 border-t-4 border-r-4 rounded-tr-2xl",
              "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-2xl",
              "bottom-0 right-0 border-b-4 border-r-4 rounded-br-2xl",
            ].map((cls) => (
              <span
                key={cls}
                className={`absolute h-9 w-9 border-white ${cls}`}
              />
            ))}
          </div>

          {/* Scanning line — soft and subtle */}
          <div
            className="absolute inset-x-3 h-0.5 rounded-full animate-qr-scan-line"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 20%, rgba(255,255,255,0.95) 80%, transparent)",
              boxShadow: "0 0 8px 1px rgba(255,255,255,0.22)",
            }}
          />
        </div>
      )}

      {/* Top controls */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 pt-5 pb-10 bg-linear-to-b from-black/60 to-transparent">
        <button
          onClick={handleClose}
          aria-label="Close scanner"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm active:scale-95 transition-transform"
        >
          <X size={22} />
        </button>

        <span className="text-white text-[15px] font-medium tracking-wide">
          Scan QR code
        </span>

        <div className="flex gap-2">
          {torchSupported && status === "running" && (
            <button
              onClick={toggleTorch}
              aria-label="Toggle flashlight"
              className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm active:scale-95 transition-transform ${
                torchOn ? "bg-white text-black" : "bg-white/15 text-white"
              }`}
            >
              {torchOn ? <Zap size={20} /> : <ZapOff size={20} />}
            </button>
          )}
          {status === "running" && (
            <button
              onClick={switchCamera}
              disabled={cameras.length < 2}
              aria-label="Switch camera"
              title={
                cameras.length < 2
                  ? "Only one camera available"
                  : "Switch camera"
              }
              className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm transition-transform ${
                cameras.length < 2
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "bg-white/15 text-white active:scale-95"
              }`}
            >
              <RotateCw size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom copy */}
      {status === "running" && (
        <p className="absolute bottom-12 inset-x-0 text-center text-white/90 text-sm px-8">
          Align the QR code within the frame
        </p>
      )}

      {/* Loading state */}
      {/* {status === "starting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
          <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          <p className="text-sm text-white/80">Starting camera…</p>
        </div>
      )} */}

      {/* Permission denied */}
      {status === "denied" && (
        <StatusPanel
          title="Camera access needed"
          body="Allow camera access in your browser settings to scan a QR code."
          actionLabel="Try again"
          onAction={retry}
          onClose={handleClose}
        />
      )}

      {/* No camera found */}
      {status === "no-camera" && (
        <StatusPanel
          icon={<ImageOff size={28} />}
          title="No camera found"
          body="We couldn't find a camera on this device."
          actionLabel="Try again"
          onAction={retry}
          onClose={handleClose}
        />
      )}

      {/* Generic error — shows the real reason instead of a generic permission prompt */}
      {status === "error" && (
        <StatusPanel
          title="Camera couldn't start"
          body={errorMessage || "The scanner couldn't start. Please try again."}
          actionLabel="Try again"
          onAction={retry}
          onClose={handleClose}
        />
      )}

      <style>{`
        @keyframes qr-scan-line {
          0% { top: 10px; opacity: 0; }
          12% { opacity: 0.85; }
          88% { opacity: 0.85; }
          100% { top: calc(100% - 10px); opacity: 0; }
        }
        .animate-qr-scan-line {
          animation: qr-scan-line 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function StatusPanel({ icon, title, body, actionLabel, onAction, onClose }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-8">
      <div className="w-full max-w-xs rounded-2xl bg-[#1f1f1f] p-6 text-center text-white">
        {icon && (
          <div className="mb-3 flex justify-center text-white/70">{icon}</div>
        )}
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm text-white/60">{body}</p>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-white/20 py-2.5 text-sm font-medium text-white/80 active:scale-95 transition-transform"
          >
            Cancel
          </button>
          <button
            onClick={onAction}
            className="flex-1 rounded-full bg-[#4285F4] py-2.5 text-sm font-medium text-white active:scale-95 transition-transform"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRScanner;
