import API from "../api";

export const getMyJobs = async () => {
  return await API.get("/get-my-jobs");
};

export const getPricing = async () => {
  return await API.get("/get-pricing");
};

export const updatePricing = async (BWRate, ColoredRate) => {
  return await API.put("/update-pricing", {
    BWRate,
    ColoredRate,
  });
};

export const googleOwnerAuth = async (
  credential,
  shopDetails,
  mode = "login"
) => {
  return await API.post("/owner/auth/google", {
    token: credential,
    shopDetails,
    mode,
    role: "owner",
  });
};

