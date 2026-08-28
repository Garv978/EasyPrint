const Job = require("../models/job");
const ShopOwner = require("../models/shopOwner");

// Check if shop exists
const checkShop = async (req, res) => {
  try {
    const { shopCode } = req.query;

    const shop = await ShopOwner.findOne({ shopCode });

    if (!shop) {
      return res.status(404).json({
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("CHECK SHOP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Get jobs belonging to logged-in owner
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      shopId: req.user.ownerId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    // Never cache the owner's current jobs
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

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
};

const updatePricing = async (req, res) => {
  try {
    const { BWRate, ColoredRate } = req.body;

    if (BWRate === undefined || ColoredRate === undefined) {
      return res.status(400).json({
        success: false,
        message: "Both BWRate and ColoredRate are required",
      });
    }

    if (BWRate < 0 || ColoredRate < 0) {
      return res.status(400).json({
        success: false,
        message: "Prices cannot be negative",
      });
    }

    const shopOwner = await ShopOwner.findByIdAndUpdate(
      req.user.ownerId,
      {
        BWRate,
        ColoredRate,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!shopOwner) {
      return res.status(404).json({
        success: false,
        message: "Shop owner not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pricing updated successfully",
      pricing: {
        BWRate: shopOwner.BWRate,
        ColoredRate: shopOwner.ColoredRate,
      },
    });

  } catch (error) {
    console.error("UPDATE PRICING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getPricing = async (req, res) => {
  try {
    const shopOwner = await ShopOwner.findById(req.user.ownerId)
      .select("BWRate ColoredRate");

    if (!shopOwner) {
      return res.status(404).json({
        success: false,
        message: "Shop owner not found",
      });
    }

    return res.status(200).json({
      success: true,
      pricing: {
        BWRate: shopOwner.BWRate,
        ColoredRate: shopOwner.ColoredRate,
      },
    });

  } catch (error) {
    console.error("GET PRICING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updatePrintStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, errorMessage = "" } = req.body;
    const validStatuses = ["Printing", "Completed", "Failed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "A valid print status is required.",
      });
    }

    const job = await Job.findOne({
      _id: jobId,
      shopId: req.user.ownerId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found for this shop owner.",
      });
    }

    job.status = status;
    job.errorMessage = status === "Failed" ? (errorMessage || "Print failed.") : "";
    await job.save();

    const io = req.app.get("io");

    if (io) {
      io.to(`shop-${job.shopId}`).emit("job-status-update", {
        jobId: job._id,
        status: job.status,
        errorMessage: job.errorMessage,
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("UPDATE PRINT STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  checkShop,
  getMyJobs,
  updatePricing,
  getPricing,
  updatePrintStatus,
};