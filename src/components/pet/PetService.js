import { api } from "../utils/api";

export async function getPetTypes() {
  try {
    const result = await api.get("/pets/get-pet-types");
    return result.data;
  } catch (error) {
    console.error("Failed to fetch types:", error); // TODO: delete
    throw error;
  }
}
export async function getPetColors() {
  try {
    const result = await api.get("/pets/get-pet-colors");
    return result.data;
  } catch (error) {
    console.error("Failed to fetch colors:", error); // TODO: delete
    throw error;
  }
}
export async function getPetBreeds(petType) {
  try {
    const result = await api.get(`/pets/get-pet-breeds?petType=${petType}`);
    return result.data;
  } catch (error) {
    console.error("Failed to fetch breeds:", error); // TODO: delete
    throw error;
  }
}
