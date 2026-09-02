import API from "../api";

export const uploadFiles = async (shopCode, formData) => {
  return await API.post(`/user/file/${shopCode}`, formData);
};

export const getMyUserJobs = async () => {
  return await API.get("/user/get-my-jobs");
};

export const googleUserAuth = async (credential) => {
  return await API.post("/user/auth/google", {
    token: credential,
  });
};