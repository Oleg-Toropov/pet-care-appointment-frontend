import { api } from "../utils/api";

export async function getVeterinarians() {
  const result = await api.get("/veterinarians/get-all-veterinarians");
  return result.data;
}

export async function findAvailableVeterinarians(searchParams) {
  const queryParams = new URLSearchParams(searchParams);
  const result = await api.get(
    `/veterinarians/search-veterinarian?${queryParams}`
  );
  return result.data;
}

export const getAllSpecializations = async () => {
  const response = await api.get("/veterinarians/vet/get-all-specialization");
  return response.data;
};

export const getAvailableTimesForAppointment = async (vetId, date) => {
  try {
    const response = await api.get(
      `/veterinarians/${vetId}/available-times?date=${date}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export async function getBiographyById(vetId) {
  try {
    const response = await api.get(`biographies/biography/${vetId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function saveVetBiography(vetId, biographyData) {
  const response = await api.post(
    `biographies/biography/${vetId}/save`,
    biographyData
  );
  return response.data;
}

export async function updateVetBiography(biographyId, biographyData) {
  const response = await api.put(
    `biographies/biography/${biographyId}/update`,
    biographyData
  );
  return response.data;
}
