import { api } from "../utils/api";

export async function getPetTypes() {
  const result = await api.get("/pets/get-pet-types");
  return result.data;
}
export async function getPetColors() {
  const result = await api.get("/pets/get-pet-colors");
  return result.data;
}
export async function getPetBreeds(petType) {
  const result = await api.get(`/pets/get-pet-breeds?petType=${petType}`);
  return result.data;
}
