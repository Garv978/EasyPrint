const express = require("express");
const jobRoutes = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const ownerMiddleware = require("../middlewares/ownerMiddleware");

const {
  checkShop,
  getMyJobs,
  updatePricing,
  getPricing,
  updatePrintStatus,
} = require("../controllers/jobController");

jobRoutes.get("/checkShop", checkShop);

jobRoutes.get(
  "/get-my-jobs",
  authMiddleware,
  ownerMiddleware,
  getMyJobs
);

jobRoutes.put(
  "/update-pricing",
  authMiddleware,
  ownerMiddleware,
  updatePricing
);

jobRoutes.get(
  "/get-pricing",
  authMiddleware,
  ownerMiddleware,
  getPricing
);

jobRoutes.patch(
  "/jobs/:jobId/print-status",
  authMiddleware,
  ownerMiddleware,
  updatePrintStatus
);

module.exports = jobRoutes;