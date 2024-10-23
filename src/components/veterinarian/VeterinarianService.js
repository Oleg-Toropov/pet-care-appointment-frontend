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
