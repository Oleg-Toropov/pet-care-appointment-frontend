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
