const express = require("express");
const fileUpload = express.Router();
const upload = require("../middlewares/upload");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const Job = require("../models/job");
const ShopOwner = require("../models/shopOwner");
const authMiddleware = require("../middlewares/authMiddleware");

fileUpload.post("/user/file/:shopCode",authMiddleware,upload.array("documents", 20),

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
            file.originalname
          );

          return {
            fileName: file.originalname,
            cloudinaryPublicId: result.public_id,
            fileUrl: result.secure_url,
            pages: 0,
            fileSize: file.size,
          };
        })
      );


      const printOptions = {
        color:
          req.body.colorMode === "color"
            ? "Color"
            : "Black & White",

        copies:
          Number(req.body.copies) || 1,

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

      const expiresAt = new Date(
        Date.now() + 40 * 60 * 1000
      );


      await Job.create({
        userId: userId,

        shopId: shop._id,

        documents: uploadedFiles,

        printOptions: printOptions,

        totalPrice:
          Number(req.body?.totalPrice) || 0,

        status: "Pending",

        expiresAt: expiresAt,
      });

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
  }
);

module.exports = fileUpload;