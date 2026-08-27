import API from "../api";

export const uploadFiles = async (shopCode, formData) => {
  return await API.post(`/user/file/${shopCode}`, formData);
};

export const googleUserAuth = async (credential) => {
  return await API.post("/user/auth/google", {
    token: credential,
  });
};