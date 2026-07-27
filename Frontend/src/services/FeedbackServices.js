import API from "../api";

// Submit feedback
export const submitFeedback = async (feedbackData) => {
  const res = await API.post("/feedback", feedbackData);
  return res.data;
};

// Get all feedbacks
export const getAllFeedbacks = async () => {
  const res = await API.get("/feedback");
  return res.data;
};

// Get single feedback
export const getFeedback = async (id) => {
  const res = await API.get(`/feedback/${id}`);
  return res.data;
};

// Delete feedback
export const deleteFeedback = async (id) => {
  const res = await API.delete(`/feedback/${id}`);
  return res.data;
};
