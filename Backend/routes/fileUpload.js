const express = require("express");
const fileUpload = express.Router();
const upload = require("../middlewares/upload");

fileUpload.post("/user/file",upload.array("documents", 20),async(req,res) => {
        try {
            console.log("FILES:");
            console.log(req.files);
            console.log("BODY:");
            console.log(req.body);
            const files = req.files.map((file) => {
                return {
                    fileName: file.originalname,
                    fileType: file.mimetype,
                    fileSize: file.size,
                    // because we are using memoryStorage
                    fileData: file.buffer
                };
            });
            const printDetails = {
                colorMode: req.body.colorMode,
                copies: Number(req.body.copies),
                sides: req.body.sides,
                layout: req.body.layout,
                pagesPerSheet: Number(
                    req.body.pagesPerSheet
                ),
                pageRange: req.body.pageRange,
                fromPage: req.body.fromPage || null,
                toPage: req.body.toPage || null
            };
            console.log("PRINT OPTIONS:");
            console.log(printDetails);
            res.status(200).json({
                message: "Files received successfully",
                files: files.map(file => ({
                    name: file.fileName,
                    type: file.fileType,
                    size: file.fileSize
                })),
                printDetails
            });
        } catch(error) {
            console.log(error);
            res.status(500).json({
                message: "Something went wrong"
            });
        }
    }
);

module.exports = fileUpload;