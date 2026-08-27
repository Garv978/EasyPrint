const mongoose = require("mongoose");

const shopOwnerSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true,
    },

    shopCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },

    phoneNo: {
      type: String, 
      required: true,
    },

    BWRate: {
      type: Number,
      required: true,
      min: 0,
    },

    ColoredRate: {
      type: Number,
      required: true,
      min: 0,
    },
    role: {
      type: String,
      enum: ["user", "owner"],
      default: "owner"
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ShopOwner", shopOwnerSchema);