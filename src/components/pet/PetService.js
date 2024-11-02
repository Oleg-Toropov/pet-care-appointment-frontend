import { api } from "../utils/api";

export async function getAllPetTypes() {
  const result = await api.get("/pets/get-types");
  return result.data;
}

export async function getAllPetColors() {
  const result = await api.get("/pets/get-pet-colors");
  return result.data;
}

export async function getAllPetBreeds(petType) {
  const result = await api.get(`/pets/get-pet-breeds?petType=${petType}`);
  return result.data;
}

export const updatePet = async (petId, updatedPet) => {
  const response = await api.put(`/pets/pet/${petId}/update`, updatedPet);
  return response.data;
};

export const deletePet = async (id) => {
  const response = await api.delete(`/pets/pet/${id}/delete`);
  return response.data;
};
