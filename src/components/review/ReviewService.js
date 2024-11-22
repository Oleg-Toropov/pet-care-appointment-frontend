import { api } from "../utils/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export async function addReview(vetId, reviewerId, reviewData) {
  try {
    const response = await api.post(
      `reviews/submit-review?veterinarianId=${vetId}&reviewerId=${reviewerId}`,
      reviewData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/review/${reviewId}/delete`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
