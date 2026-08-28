import API from "../api";

export const getMyJobs = async () => {
  return API.get("/get-my-jobs", {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
};

export const getPricing = async () => {
  return API.get("/get-pricing");
};

export const updatePricing = async (BWRate, ColoredRate) => {
  return API.put("/update-pricing", {
    BWRate,
    ColoredRate,
  });
};

export const googleOwnerAuth = async (
  credential,
  shopDetails,
  mode = "login"
) => {
  return API.post("/owner/auth/google", {
    token: credential,
    shopDetails,
    mode,
    role: "owner",
  });
};

