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
