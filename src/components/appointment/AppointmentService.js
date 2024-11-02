import { api } from "../utils/api";

export async function bookAppointment(
  senderId,
  recipientId,
  appointmentRequest
) {
  const result = await api.post(
    `/appointments/book-appointment?senderId=${senderId}&recipientId=${recipientId}`,
    appointmentRequest
  );
  return result.data;
}

export const updateAppointment = async (appointmentId, appointmentData) => {
  const response = await api.put(
    `appointments/appointment/${appointmentId}/update`,
    appointmentData
  );
  return response;
};

export const addPetToAppointment = async (appointmentId, newPetData) => {
  const response = await api.put(
    `appointments/appointment/${appointmentId}/add-pet`,
    newPetData
  );
  return response;
};

export async function cancelAppointment(appointmentId) {
  const response = await api.put(
    `/appointments/appointment/${appointmentId}/cancel`
  );
  return response.data;
}

export async function approveAppointment(appointmentId) {
  const response = await api.put(
    `/appointments/appointment/${appointmentId}/approve`
  );
  return response.data;
}

export async function declineAppointment(appointmentId) {
  const response = await api.put(
    `/appointments/appointment/${appointmentId}/decline`
  );
  return response.data;
}

export const getAppointmentById = async (appointmentId) => {
  const result = await api.get(
    `/appointments/appointment/${appointmentId}/fetch/appointment`
  );
  return result.data;
};
