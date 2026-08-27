const express = require("express") ;
const shopJobsRouter = express.Router();
const Job = require("../models/job");
const authMiddleware = require("../middlewares/authMiddleware") ;

shopJobsRouter.get("/get-my-jobs",authMiddleware, async (req, res) => {
    try {
      if (req.user.role !== "owner") {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const jobs = await Job.find({
        shopId: req.user.ownerId,
        })
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        jobs,
      });

    } catch (error) {
      console.error("GET MY JOBS ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
);
module.exports = shopJobsRouter ;
