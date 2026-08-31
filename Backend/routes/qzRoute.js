const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const ownerMiddleware = require("../middlewares/ownerMiddleware");
const Job = require("../models/job");
const cloudinary = require("../db/cloudinary");
const { readQzCertificate, signQzRequest } = require("../services/qzSigningService");

const qzRoutes = express.Router();

qzRoutes.get(
  "/qz/document/:jobId/:documentIndex",
  authMiddleware,
  ownerMiddleware,
  async (req, res) => {
    try {
      const job = await Job.findOne({
        _id: req.params.jobId,
        shopId: req.user.ownerId,
      }).select("documents");

      const documentIndex = Number(req.params.documentIndex);
      const document = Number.isInteger(documentIndex)
        ? job?.documents[documentIndex]
        : null;

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found for this shop owner.",
        });
      }

      const resourceType = "raw"
      const versionMatch = new URL(document.fileUrl).pathname.match(/\/v(\d+)\//);

      const signedUrl = cloudinary.url(document.cloudinaryPublicId, {
        secure: true,
        resource_type: resourceType,
        type: "upload",
        version: versionMatch?.[1],
        sign_url: false,
      });

      return res.json({ success: true, url: signedUrl });
    } catch (error) {
      console.error("QZ document URL error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to prepare the document for printing.",
      });
    }
  },
);

qzRoutes.get(
  "/qz/certificate",
  authMiddleware,
  ownerMiddleware,
  (req, res) => {
    try {
      const certificate = readQzCertificate();
      res.set("Content-Type", "text/plain; charset=utf-8");
      res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      return res.send(certificate);
    } catch (error) {
      console.error("QZ certificate route error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

qzRoutes.get(
  "/qz/sign",
  authMiddleware,
  ownerMiddleware,
  (req, res) => {
    try {
      const { request } = req.query;

      if (!request) {
        return res.status(400).json({
          success: false,
          message: "Missing QZ signing payload.",
        });
      }

      const signature = signQzRequest(request);
      return res.type("text/plain").send(signature);
    } catch (error) {
      console.error("QZ signature route error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

module.exports = qzRoutes;
