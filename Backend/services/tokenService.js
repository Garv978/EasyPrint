const jwt = require("jsonwebtoken");

const JWT_OPTIONS = {
  expiresIn: "15m",
  algorithm: "HS256",
};

const createUserToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: "user",
    },
    process.env.JWT_SECRET,
    JWT_OPTIONS
  );
};

const createOwnerToken = (owner) => {
  return jwt.sign(
    {
      ownerId: owner._id.toString(),
      role: "owner",
    },
    process.env.JWT_SECRET,
    JWT_OPTIONS
  );
};

module.exports = {
  createUserToken,
  createOwnerToken,
};