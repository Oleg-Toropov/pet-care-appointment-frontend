import { api } from "../utils/api";

export async function updateUserPhoto(photoId, photoFile) {
  const formData = new FormData();
  formData.append("file", photoFile);

  const response = await api.put(`/photos/photo/${photoId}/update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function uploadUserPhoto(userId, photoData) {
  const formData = new FormData();
  formData.append("file", photoData);
  formData.append("userId", userId);
  const response = await api.post("/photos/photo/upload", formData);
  return response.data;
}

export async function deleteUserPhoto(photoId, userId) {
  const response = await api.delete(
    `/photos/photo/${photoId}/${userId}/delete`
  );
  return response.data;
}
