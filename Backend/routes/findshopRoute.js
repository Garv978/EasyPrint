const express = require("express");
const findShopRouter = express.Router();
const ShopOwner = require("../models/shopOwner");

findShopRouter.get("/checkShop" ,async (req,res) => {
    try {
        const { shopCode } = req.query;

        const shop = await ShopOwner.findOne({ shopCode });

        if (!shop) {
            return res.status(404).json({
                success: false
            });
        }

        return res.status(200).json({
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            success: false
        });
    }
})

module.exports = findShopRouter;