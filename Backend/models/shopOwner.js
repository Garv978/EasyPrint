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

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phoneNo: {
      type: String, 
      required: true,
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ShopOwner", shopOwnerSchema);