import { api } from "../utils/api";

export async function bookAppointment(
  senderId,
  recipientId,
  appointmentRequest
) {
  const token = localStorage.getItem("authToken");
  const result = await api.post(
    `/appointments/book-appointment?senderId=${senderId}&recipientId=${recipientId}`,
    appointmentRequest,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
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

export async function countAppointments() {
  const result = await api.get("/appointments/count/appointments");
  return result.data;
}

export const getAppointmentsSummary = async () => {
  const response = await api.get("/appointments/summary/appointments-summary");
  return response.data;
};

export const getAppointments = async (page, size, search = "") => {
  const response = await api.get("/appointments/all", {
    params: {
      page,
      size,
      search,
    },
  });
  return response.data;
};

export const deleteAppointment = async (appointmentId) => {
  const response = await api.delete(
    `/appointments/appointment/${appointmentId}/delete`
  );
  return response.data;
};
