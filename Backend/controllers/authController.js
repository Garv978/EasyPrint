const User = require("../models/user");
const ShopOwner = require("../models/shopOwner");

const { verifyGoogleToken } = require("../services/googleAuth");
const {
  createUserToken,
  createOwnerToken,
} = require("../services/tokenService");

const { generateUniqueShopCode } = require("../utils/shopCode");

const buildFullName = (payload) => {
  const { name, given_name, family_name, email } = payload;

  return (
    name ||
    `${given_name || ""} ${family_name || ""}`.trim() ||
    email.split("@")[0]
  );
};

const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });
};

const googleUserAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google credential is missing",
      });
    }

    const payload = await verifyGoogleToken(token);

    const { sub: googleId, email } = payload;

    const fullName = buildFullName(payload);

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: fullName,
        email,
        googleId,
      });
    }

    const authToken = createUserToken(user);

    setAuthCookie(res, authToken);

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error("GOOGLE USER AUTH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Auth failed",
    });
  }
};

const googleOwnerAuth = async (req, res) => {
  try {
    const {
      token,
      shopDetails = {},
      mode = "login",
    } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    const payload = await verifyGoogleToken(token);

    const { sub: googleId, email } = payload;

    const fullName = buildFullName(payload);

    let owner = await ShopOwner.findOne({ email });

    // Existing owner trying to register again
    if (owner && mode === "register") {
      return res.status(409).json({
        success: false,
        alreadyRegistered: true,
        message: "This email is already registered",
      });
    }

    // New owner
    if (!owner) {
      const {
        shopName,
        phoneNo,
        BWRate,
        ColoredRate,
      } = shopDetails;

      const validShopDetails =
        typeof shopName === "string" &&
        typeof phoneNo === "string" &&
        shopName.trim() &&
        /^\d{10}$/.test(phoneNo.trim()) &&
        Number.isFinite(Number(BWRate)) &&
        Number.isFinite(Number(ColoredRate)) &&
        Number(BWRate) >= 0 &&
        Number(ColoredRate) >= 0;

      if (!validShopDetails) {
        return res.status(400).json({
          success: false,
          requiresShopDetails: true,
          message: "Shop details are required for new owners",
        });
      }

      owner = await ShopOwner.create({
        shopName: shopName.trim(),
        shopCode: await generateUniqueShopCode(),
        name: fullName,
        email,
        googleId,
        phoneNo: phoneNo.trim(),
        BWRate: Number(BWRate),
        ColoredRate: Number(ColoredRate),
      });
    }

    const authToken = createOwnerToken(owner);

    setAuthCookie(res, authToken);

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error("GOOGLE OWNER AUTH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Auth failed",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        loggedIn: false,
      });
    }

    const jwt = require("jsonwebtoken");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    if (decoded.role === "user") {
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({
          loggedIn: false,
        });
      }

      return res.json({
        loggedIn: true,
        role: "user",
        user,
      });
    }

    if (decoded.role === "owner") {
      const owner = await ShopOwner.findById(decoded.ownerId);

      if (!owner) {
        return res.status(401).json({
          loggedIn: false,
        });
      }

      return res.json({
        loggedIn: true,
        role: "owner",
        owner,
      });
    }

    return res.status(401).json({
      loggedIn: false,
    });
  } catch (error) {
    console.error("GET CURRENT USER ERROR:", error);

    return res.status(401).json({
      loggedIn: false,
    });
  }
};

const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("authToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  return res.json({
    success: true,
  });
};

module.exports = {
  googleUserAuth,
  googleOwnerAuth,
  getCurrentUser,
  logout,
};