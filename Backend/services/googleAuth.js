const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (credential) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("Invalid Google token");
    }

    return payload;
  } catch (error) {
    console.error("Google token verification failed:", error.message);
    throw new Error("Invalid Google token");
  }
};

module.exports = {
  verifyGoogleToken,
};