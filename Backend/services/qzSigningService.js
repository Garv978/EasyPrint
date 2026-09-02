const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const certificatePath =
  process.env.QZ_CERT_PATH ||
  path.join(__dirname, "../certs/digital-certificate.txt");

const privateKeyPath =
  process.env.QZ_PRIVATE_KEY_PATH ||
  path.join(__dirname, "../certs/private-key.pem");

const readQzCertificate = () => {
  try {
    const certificate = fs.readFileSync(certificatePath, "utf8");
    return certificate;
  } catch (error) {
    console.error("QZ certificate read failed:", error.message);

    throw new Error(
      "QZ certificate is missing. Upload a valid digital-certificate.txt and configure QZ_CERT_PATH.",
      {
        cause: error,
      },
    );
  }
};

const signQzRequest = (requestText) => {
  if (!requestText) {
    throw new Error("QZ signing request is missing.");
  }

  try {
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    const signer = crypto.createSign("RSA-SHA512");
    signer.update(requestText);
    signer.end();

    return signer.sign(privateKey, "base64");
  } catch (error) {
    console.error("QZ signature generation failed:", error.message);

    throw new Error(
      "QZ signing key is missing or invalid. Configure QZ_PRIVATE_KEY_PATH with the private key used for message signing.",
      {
        cause: error,
      },
    );
  }
};

module.exports = {
  readQzCertificate,
  signQzRequest,
};