import { api } from "../utils/api";

export async function getVeterinarians() {
  try {
    const result = await api.get("/veterinarians/get-all-veterinarians");
    console.log("The result ", result); // TODO: delete
    console.log("The result ", result.data); // TODO: delete
    return result.data;
  } catch (error) {
    console.error("Failed to fetch veterinarians:", error); // TODO: delete
    throw error;
  }
}

export async function findAvailableVeterinarians(searchParams) {
  try {
    const queryParams = new URLSearchParams(searchParams);
    const result = await api.get(
      `/veterinarians/search-veterinarian?${queryParams}`
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching available veterinarians:", error); // TODO: delete
    throw error;
  }
}
