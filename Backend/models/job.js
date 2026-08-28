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
        fileName: {
          type: String,
          required: true,
        },

        cloudinaryPublicId: {
          type: String,
          required: true,
        },

        fileUrl: {
          type: String,
          required: true,
        },

        pages: {
          type: Number,
          required: true,
          min: 1,
        },

        chargedPages: {
          type: Number,
          required: true,
          min: 1,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        fileSize: {
          type: Number,
          default: 0,
        },
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
        enum: [1, 2, 4, 6, 9, 16],
        default: 1,
      },

      copies: {
        type: Number,
        default: 1,
        min: 1,
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
      min: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Printing", "Completed", "Failed", "Cancelled"],
      default: "Pending",
    },

    // Optional error information if printing fails
    errorMessage: {
      type: String,
      default: "",
    },

    // When the temporary R2 files should expire
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Job", jobSchema);
