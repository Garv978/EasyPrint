const { PDFDocument } = require("pdf-lib");

const uploadToCloudinary = require("../utils/uploadToCloudinary");
const calculateJobPrice = require("../utils/calculateJobPrice");
const Job = require("../models/job");
const ShopOwner = require("../models/shopOwner");

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

const uploadFiles = async (req, res) => {
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

    // Upload files to Cloudinary and determine page counts
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

    // Build print options
    const printOptions = {
      color:
        req.body.colorMode === "color" ? "Color" : "Black & White",

      copies: Number(req.body.copies) || 1,

      sides:
        req.body.sides === "single"
          ? "Single-sided"
          : "Double-sided",

      layout:
        req.body.layout === "portrait"
          ? "Portrait"
          : "Landscape",

      pagesPerSheet:
        Number(req.body.pagesPerSheet) || 1,

      pageSelection:
        req.body.pageRange === "custom"
          ? "Custom"
          : "All Pages",

      customPages:
        req.body.pageRange === "custom"
          ? `${req.body.fromPage || ""}-${req.body.toPage || ""}`
          : "",
    };

    // Calculate charged pages for every document
    const documentsWithChargedPages = uploadedFiles.map((document) => {
      const chargedPages = getChargedPages(
        document.pages,
        printOptions,
      );

      return {
        ...document,
        chargedPages,
      };
    });

    // Calculate final job price
    const { documents, totalPrice } = calculateJobPrice({
      documents: documentsWithChargedPages,
      printOptions,
      bwRate: shop.BWRate,
      colorRate: shop.ColoredRate,
    });

    // Job expires after 40 minutes
    const expiresAt = new Date(
      Date.now() + 40 * 60 * 1000,
    );

    // Create job in database
    const job = await Job.create({
      userId,
      shopId: shop._id,
      documents,
      printOptions,
      totalPrice,
      status: "Pending",
      expiresAt,
    });

    // Notify shop owner through Socket.IO
    const io = req.app.get("io");
    if (io) {
      // Notify shop owner
      io.to(`shop-${shop._id}`).emit("new-job", job);

      // Notify the user who created the job
      io.to(`user-${userId}`).emit("job-created", job);
    }

    return res.status(201).json({
      success: true,
      message: "Files uploaded successfully",
      job,
      fileNames: uploadedFiles.map(
        (file) => file.fileName,
      ),
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  uploadFiles,
};
