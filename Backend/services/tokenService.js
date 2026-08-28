const jwt = require("jsonwebtoken");

const createUserToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: "user",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const createOwnerToken = (owner) => {
  return jwt.sign(
    {
      ownerId: owner._id,
      shopName: owner.shopName,
      shopCode: owner.shopCode,
      role: "owner",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

module.exports = {
  createUserToken,
  createOwnerToken,
};