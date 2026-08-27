const express = require("express");
const authRouter = express.Router();
require("dotenv").config();
const User = require("../models/user");
const ShopOwner = require("../models/shopOwner");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { customAlphabet } = require("nanoid") ;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

authRouter.post("/user/auth/google", async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Google credential is missing",
            });
        }

        // 1. Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const {
            sub,
            email,
            name,
            given_name,
            family_name
        } = payload;

        // Construct name with fallback logic
        const fullName =
            name ||
            `${given_name || ""} ${family_name || ""}`.trim() ||
            email.split("@")[0];

        // 2. Find user
        let user = await User.findOne({ email });

        // 3. Create user if not exists
        if (!user) {
            user = await User.create({
                name: fullName,
                email,
                googleId: sub,
            });
        }

        // 4. Create JWT
        const authToken = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                name: user.name || fullName,
                role : "user"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        // 5. Store JWT in HttpOnly cookie
        res.cookie("authToken", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        // 6. Send response
        res.json({
            success: true,
        });

    } catch (err) {
        console.log("GOOGLE AUTH ERROR:", err.message);
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Auth failed",
        });
    }
});


const generateShopCode = customAlphabet(
  "ABCDEFGHJKMNPQRSTUVWXYZ23456789",
  8
);
authRouter.post("/owner/auth/google", async (req, res) => {
    try {
        const { token, shopDetails = {}, mode = "login" } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Google token is required",
            });
        }

        // 1. Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const {
            sub,
            email,
            name,
            given_name,
            family_name
        } = payload;

        // Construct name with fallback logic
        const fullName =
            name ||
            `${given_name || ""} ${family_name || ""}`.trim() ||
            email.split("@")[0];

        // Existing owners can sign in without submitting shop details again.
        let owner = await ShopOwner.findOne({ email });

        if (owner && mode === "register") {
            return res.status(409).json({
                success: false,
                alreadyRegistered: true,
                message: "This email is already registered",
            });
        }

        if (!owner) {
            const { shopName, phoneNo, BWRate, ColoredRate } = shopDetails;

            if (
                typeof shopName !== "string" ||
                typeof phoneNo !== "string" ||
                !shopName.trim() ||
                !/^[0-9]{10}$/.test(phoneNo.trim()) ||
                !Number.isFinite(Number(BWRate)) ||
                !Number.isFinite(Number(ColoredRate)) ||
                Number(BWRate) < 0 ||
                Number(ColoredRate) < 0
            ) {
                return res.status(400).json({
                    success: false,
                    requiresShopDetails: true,
                    message: "Shop details are required for new owners",
                });
            }

            async function createUniqueShopCode() {
                while (true) {
                    const code = generateShopCode();
                    const exists = await ShopOwner.exists({ shopCode: code });
                    if (!exists) return code;
                }
            }

            owner = await ShopOwner.create({
                shopName: shopName.trim(),
                shopCode: await createUniqueShopCode(),
                name : fullName,
                email,
                googleId : sub,
                phoneNo: phoneNo.trim(),
                BWRate: Number(BWRate),
                ColoredRate: Number(ColoredRate),
            });
        }

        // 4. Create JWT
        const authToken = jwt.sign(
            {
                ownerId: owner._id,
                shopName : owner.shopName || fullName,
                shopCode : owner.shopCode,
                role : "owner"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        // 5. Store JWT in HttpOnly cookie
        res.cookie("authToken", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        // 6. Send response
        res.json({
            success: true,
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Auth failed",
        });
    }
});


authRouter.get("/auth/me" , async(req,res) => {
    try{
        const token = req.cookies.authToken ;

        if(!token){
            return res.status(401).json({
                loggedIn : false
            });
        }

        const decoded = jwt.verify(
            token ,
            process.env.JWT_SECRET
        );

        if(decoded.role === "user"){
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(401).json({ loggedIn: false });
            }

            return res.json({
                loggedIn : true,
                role : "user",
                user
            })
        }

        if(decoded.role === "owner"){
            const owner = await ShopOwner.findById(decoded.ownerId);

            if (!owner) {
                return res.status(401).json({ loggedIn: false });
            }
            
            return res.json({
                loggedIn : true,
                role : "owner",
                owner
            })
        }

        return res.status(401).json({
            loggedIn : false

        });
    }
    catch(error){
        return res.status(401).json({
            loggedIn : false
        });
    }  
});


authRouter.post("/auth/logout", (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    });

    res.json({
        success: true,
    });
});


module.exports = authRouter;