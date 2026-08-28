const express = require("express");
const fileUpload = express.Router();
const upload = require("../middlewares/upload");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const Job = require("../models/job");
const ShopOwner = require("../models/shopOwner");
const authMiddleware = require("../middlewares/authMiddleware");
const { PDFDocument } = require("pdf-lib");
const calculateJobPrice = require("../utils/calculateJobPrice");

const getPageCount = async (file) => {
  const mimeType = file.mimetype;

  if (mimeType === "application/pdf") {
    const pdfDoc = await PDFDocument.load(file.buffer);

    return pdfDoc.getPageCount();
  }

  if (mimeType === "image/jpeg" || mimeType === "image/png") {
    return 1;
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
};

const getChargedPages = (pages, printOptions) => {
  if (printOptions.pageSelection !== "Custom") {
    return pages;
  }

  const [from, to] = printOptions.customPages.split("-").map(Number);

  if (
    !Number.isInteger(from) ||
    !Number.isInteger(to) ||
    from < 1 ||
    to > pages ||
    from > to
  ) {
    throw new Error("Invalid custom page range");
  }

  return to - from + 1;
};

fileUpload.post(
  "/user/file/:shopCode",
  authMiddleware,
  upload.array("documents", 20),

  async (req, res) => {
    try {
      const { shopCode } = req.params;
      const shop = await ShopOwner.findOne({ shopCode });

      if (!shop) {
        return res.status(404).json({
          success: false,
          message: "Shop not found",
        });
      }
      const userId = req.user.userId;

      // Upload files to Cloudinary
      const uploadedFiles = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(
            file.buffer,
            file.originalname,
          );

          const pages = await getPageCount(file);

          return {
            fileName: file.originalname,
            cloudinaryPublicId: result.public_id,
            fileUrl: result.secure_url,
            pages,
            fileSize: file.size,
          };
        }),
      );

      const printOptions = {
        color: req.body.colorMode === "color" ? "Color" : "Black & White",

        copies: Number(req.body.copies) || 1,

        sides: req.body.sides === "single" ? "Single-sided" : "Double-sided",

        layout: req.body.layout === "portrait" ? "Portrait" : "Landscape",

        pagesPerSheet: Number(req.body.pagesPerSheet) || 1,

        pageSelection: req.body.pageRange === "custom" ? "Custom" : "All Pages",

        customPages:
          req.body.pageRange === "custom"
            ? `${req.body.fromPage || ""}-${req.body.toPage || ""}`
            : "",
      };

      const documentsWithChargedPages = uploadedFiles.map((document) => {
        const chargedPages = getChargedPages(document.pages, printOptions);

        return {
          ...document,
          chargedPages,
        };
      });
      const { documents, totalPrice } = calculateJobPrice({
        documents: documentsWithChargedPages,
        printOptions,
        bwRate: shop.BWRate,
        colorRate: shop.ColoredRate,
      });
      const expiresAt = new Date(Date.now() + 40 * 60 * 1000);

      const job = await Job.create({
        userId: userId,

        shopId: shop._id,

        documents: documents,

        printOptions: printOptions,

        totalPrice: totalPrice,

        status: "Pending",

        expiresAt: expiresAt,
      });
      const io = req.app.get("io");

      io.to(`shop-${shop._id}`).emit("new-job", job);

      return res.status(201).json({
        success: true,
        message: "Files uploaded successfully ",
        fileNames: uploadedFiles.map((file) => file.fileName),
      });
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
);

module.exports = fileUpload;
