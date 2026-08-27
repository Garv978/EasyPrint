import { QRCodeCanvas } from "qrcode.react";
import {
  Download,
  Store,
  ScanLine,
  ShieldCheck,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

function ShopQRCode({
  owner
}) {
  const [copied, setCopied] = useState(false);
  const shopCode = owner.shopCode ;
  const shopName = owner.shopName ;
  const ownerName = owner.name ; 
  if (!shopCode) return null;

  // -----------------------------
  // COPY SHOP CODE
  // -----------------------------
  const copyShopCode = async () => {
    try {
      await navigator.clipboard.writeText(shopCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // -----------------------------
  // DOWNLOAD QR CARD
  // -----------------------------
  const downloadQR = () => {
    const qrCanvas = document.getElementById("shop-qr");

    if (!qrCanvas) {
      console.error("QR canvas not found");
      return;
    }

    const qrData = qrCanvas.toDataURL("image/png");

    const qrImage = new Image();

    qrImage.onload = () => {
      // --------------------------------
      // DOWNLOAD CARD SIZE
      // --------------------------------
      const canvas = document.createElement("canvas");

      canvas.width = 1200;
      canvas.height = 800;

      const ctx = canvas.getContext("2d");

      // --------------------------------
      // BACKGROUND
      // --------------------------------
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --------------------------------
      // BLUE HEADER
      // --------------------------------
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        0
      );

      gradient.addColorStop(0, "#2563eb");
      gradient.addColorStop(1, "#4f46e5");

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        0,
        canvas.width,
        150
      );

      // --------------------------------
      // SHOP ICON
      // --------------------------------
      ctx.fillStyle = "#ffffff";

      ctx.beginPath();
      ctx.arc(85, 75, 42, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#2563eb";

      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";

      ctx.fillText(
        shopName.charAt(0).toUpperCase(),
        85,
        90
      );

      // --------------------------------
      // SHOP NAME
      // --------------------------------
      ctx.fillStyle = "#ffffff";

      ctx.font = "bold 38px Arial";
      ctx.textAlign = "left";

      ctx.fillText(
        shopName,
        150,
        70
      );

      ctx.font = "22px Arial";

      ctx.fillText(
        "Scan to visit our shop",
        150,
        105
      );

      // --------------------------------
      // MAIN WHITE CARD
      // --------------------------------
      ctx.fillStyle = "#ffffff";

      ctx.beginPath();
      ctx.roundRect(
        70,
        190,
        1060,
        540,
        30
      );

      ctx.fill();

      // --------------------------------
      // QR BACKGROUND
      // --------------------------------
      ctx.fillStyle = "#eff6ff";

      ctx.beginPath();
      ctx.roundRect(
        120,
        235,
        430,
        430,
        25
      );

      ctx.fill();

      // --------------------------------
      // QR IMAGE
      // --------------------------------
      ctx.drawImage(
        qrImage,
        145,
        260,
        380,
        380
      );

      // --------------------------------
      // RIGHT DETAILS
      // --------------------------------
      ctx.textAlign = "left";

      // Small label
      ctx.fillStyle = "#64748b";
      ctx.font = "18px Arial";

      ctx.fillText(
        "SHOP QR CODE",
        620,
        275
      );

      // Shop name
      ctx.fillStyle = "#111827";
      ctx.font = "bold 40px Arial";

      ctx.fillText(
        shopName,
        620,
        330
      );

      // Owner
      ctx.fillStyle = "#64748b";
      ctx.font = "23px Arial";

      ctx.fillText(
        `Owner: ${ownerName}`,
        620,
        375
      );

      // Divider
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;

      ctx.beginPath();

      ctx.moveTo(620, 410);
      ctx.lineTo(1050, 410);

      ctx.stroke();

      // Shop code label
      ctx.fillStyle = "#64748b";
      ctx.font = "18px Arial";

      ctx.fillText(
        "SHOP CODE",
        620,
        455
      );

      // Shop code
      ctx.fillStyle = "#2563eb";
      ctx.font = "bold 32px Arial";

      ctx.fillText(
        shopCode,
        620,
        500
      );

      // Instructions
      ctx.fillStyle = "#475569";
      ctx.font = "20px Arial";

      ctx.fillText(
        "Open your phone camera",
        620,
        555
      );

      ctx.fillText(
        "and scan this QR code",
        620,
        585
      );

      // Security
      ctx.fillStyle = "#16a34a";
      ctx.font = "bold 18px Arial";

      ctx.fillText(
        "✓ Secure & Unique Shop QR",
        620,
        635
      );

      // --------------------------------
      // DOWNLOAD
      // --------------------------------
      const link = document.createElement("a");

      link.download = `${shopName}-Shop-QR.png`;

      link.href = canvas.toDataURL(
        "image/png"
      );

      link.click();
    };

    // IMPORTANT
    // Load the QR image before drawing it
    qrImage.src = qrData;
  };

  return (
    <div className="w-full px-3 sm:px-4 mt-12">

      {/* MAIN CARD */}

      <div
        className="
          mx-auto
          w-full
          max-w-5xl
          overflow-hidden
          rounded-2xl
          border
          border-blue-100
          bg-white
          shadow-lg
        "
      >

        {/* HEADER */}

        <div
          className="
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            px-4
            py-5
            sm:px-6
            lg:px-8
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white/20
                text-white
              "
            >
              <Store size={23} />
            </div>

            <div className="min-w-0">

              <h2
                className="
                  truncate
                  text-lg
                  font-bold
                  text-white
                  sm:text-xl
                "
              >
                {shopName}
              </h2>

              <p
                className="
                  text-xs
                  text-blue-100
                  sm:text-sm
                "
              >
                Your Shop QR Code
              </p>

            </div>

          </div>

        </div>

        {/* CONTENT */}

        <div
          className="
            flex
            flex-col
            gap-6
            p-4
            sm:p-6
            lg:flex-row
            lg:items-center
            lg:gap-10
            lg:p-8
          "
        >

          {/* ========================= */}
          {/* LEFT - QR */}
          {/* ========================= */}

          <div
            className="
              flex
              w-full
              shrink-0
              flex-col
              items-center
              lg:w-[45%]
            "
          >

            <div
              className="
                w-full
                max-w-[300px]
                rounded-2xl
                border
                border-blue-100
                bg-blue-50
                p-3
                sm:max-w-[320px]
                sm:p-4
              "
            >

              <div
                className="
                  flex
                  w-full
                  justify-center
                  overflow-hidden
                  rounded-xl
                  bg-white
                  p-2
                "
              >

                <QRCodeCanvas
                  id="shop-qr"
                  value={shopCode}
                  size={280}
                  level="H"
                  includeMargin={true}
                  className="
                    h-auto
                    max-w-full
                  "
                />

              </div>

            </div>

            {/* QR LABEL */}

            <div className="mt-4 flex items-center gap-2">

              <ScanLine
                size={18}
                className="text-blue-600"
              />

              <p
                className="
                  text-sm
                  font-medium
                  text-gray-600
                "
              >
                Scan to access shop
              </p>

            </div>

          </div>

          {/* ========================= */}
          {/* RIGHT - DETAILS */}
          {/* ========================= */}

          <div
            className="
              flex
              min-w-0
              w-full
              flex-col
              lg:w-[55%]
            "
          >

            {/* Title */}

            <div>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-blue-600
                "
              >
                Shop Information
              </p>

              <h3
                className="
                  mt-1
                  break-words
                  text-2xl
                  font-bold
                  text-gray-900
                  sm:text-3xl
                "
              >
                {shopName}
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                {ownerName}
              </p>

            </div>

            {/* Divider */}

            <div
              className="
                my-5
                h-px
                w-full
                bg-gray-200
              "
            />

            {/* SHOP CODE */}

            <div>

              <p
                className="
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-gray-400
                "
              >
                Shop Code
              </p>

              <div
                className="
                  mt-2
                  flex
                  items-center
                  justify-between
                  gap-2
                  rounded-xl
                  border
                  border-blue-100
                  bg-blue-50
                  px-4
                  py-3
                "
              >

                <p
                  className="
                    min-w-0
                    break-all
                    text-sm
                    font-bold
                    tracking-[0.18em]
                    text-blue-700
                    sm:text-base
                  "
                >
                  {shopCode}
                </p>

                <button
                  onClick={copyShopCode}
                  className="
                    shrink-0
                    rounded-lg
                    p-2
                    text-blue-600
                    transition
                    hover:bg-blue-100
                  "
                  title="Copy shop code"
                >

                  {copied ? (
                    <Check
                      size={18}
                      className="text-green-600"
                    />
                  ) : (
                    <Copy size={18} />
                  )}

                </button>

              </div>

            </div>

            {/* INSTRUCTIONS */}

            <div
              className="
                mt-5
                rounded-xl
                bg-gray-50
                p-4
              "
            >

              <div className="flex gap-3">

                <ScanLine
                  size={20}
                  className="
                    mt-0.5
                    shrink-0
                    text-blue-600
                  "
                />

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    How customers use it
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-gray-500
                      sm:text-sm
                    "
                  >
                    Customers can scan this QR code
                    with their phone camera to quickly
                    access your shop.
                  </p>

                </div>

              </div>

            </div>

            {/* SECURITY */}

            <div
              className="
                mt-4
                flex
                items-center
                gap-2
                text-xs
                text-gray-400
              "
            >

              <ShieldCheck
                size={16}
                className="text-green-500"
              />

              QR code is unique to your shop

            </div>

            {/* DOWNLOAD */}

            <button
              onClick={downloadQR}
              className="
                mt-5
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-md
                transition
                hover:bg-blue-700
                active:scale-[0.98]
                sm:text-base
              "
            >

              <Download size={19} />

              Download Shop QR

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ShopQRCode;