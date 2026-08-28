const { customAlphabet } = require("nanoid");
const ShopOwner = require("../models/shopOwner");

const generateShopCode = customAlphabet(
  "ABCDEFGHJKMNPQRSTUVWXYZ23456789",
  8
);

const generateUniqueShopCode = async () => {
  while (true) {
    const code = generateShopCode();

    const exists = await ShopOwner.exists({
      shopCode: code,
    });

    if (!exists) {
      return code;
    }
  }
};

module.exports = {
  generateUniqueShopCode,
};