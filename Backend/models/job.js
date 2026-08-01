const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopOwner",
      required: true,
    },

    documents: [
      {
        fileName: String,
        fileUrl: String,
        pages: Number,
        fileSize: Number,
      },
    ],

    printOptions: {
      color: {
        type: String,
        enum: ["Black & White", "Color"],
        default: "Black & White",
      },

      layout: {
        type: String,
        enum: ["Portrait", "Landscape"],
        default: "Portrait",
      },

      pagesPerSheet: {
        type: Number,
        default: 1,
      },

      copies: {
        type: Number,
        default: 1,
      },

      sides: {
        type: String,
        enum: ["Single-sided", "Double-sided"],
        default: "Single-sided",
      },

      pageSelection: {
        type: String,
        enum: ["All Pages", "Custom"],
        default: "All Pages",
      },

      customPages: {
        type: String,
        default: "",
      },
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Completed",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);