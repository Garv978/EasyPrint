const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const ownerMiddleware = require("../middlewares/ownerMiddleware");
const { readQzCertificate, signQzRequest } = require("../services/qzSigningService");

const qzRoutes = express.Router();

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
