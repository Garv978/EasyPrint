import API from "../api";

// Submit feedback
export const submitFeedback = (feedbackData) => {
  return API.post("/feedback", feedbackData);
};

// Get all feedbacks
export const getAllFeedbacks = () => {
  return API.get("/feedback");
};

// Get single feedback
export const getFeedback = (id) => {
  return API.get(`/feedback/${id}`);
};

// Delete feedback
export const deleteFeedback = (id) => {
  return API.delete(`/feedback/${id}`);
};
