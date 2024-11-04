import { api } from "../utils/api";

export async function getPatients() {
  const result = await api.get("/patients/get-all-patients");
  return result.data;
}
