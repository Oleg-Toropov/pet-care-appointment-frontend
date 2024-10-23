import { api } from "../utils/api";

export async function addReview(vetId, reviewerId, reviewData) {
  const response = await api.post(
    `reviews/submit-review?veterinarianId=${vetId}&reviewerId=${reviewerId}`,
    reviewData
  );
  return response.data;
}
