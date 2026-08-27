import API from "../api";

export const getMyJobs = async () => {
  return await API.get("/get-my-jobs");
};

export const googleOwnerAuth = async (credential, shopDetails, mode = "login") => {
  return await API.post("/owner/auth/google", {
    token: credential,
    shopDetails,
    mode,
    role: "owner",
  });
};