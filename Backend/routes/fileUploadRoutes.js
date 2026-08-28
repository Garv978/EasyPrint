```js
const express = require("express");

const fileUpload = express.Router();

const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  uploadFiles,
} = require("../controllers/fileUploadController");

fileUpload.post(
  "/user/file/:shopCode",
  authMiddleware,
  upload.array("documents", 20),
  uploadFiles,
);

module.exports = fileUpload;
```
