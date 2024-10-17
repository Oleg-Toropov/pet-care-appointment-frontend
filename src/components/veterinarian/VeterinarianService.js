import { api } from "../utils/api";

export async function getVeterinarians() {
  // try {
  const result = await api.get("/veterinarians/get-all-veterinarians");
  console.log("The result ", result);
  console.log("The result ", result.data);
  return result.data;
  // } catch (error) {
  //   throw error;
  // }
}
