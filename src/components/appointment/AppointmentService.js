import { api } from "../utils/api";

export async function bookAppointment(
  senderId,
  recipientId,
  appointmentRequest
) {
  try {
    const result = await api.post(
      `/appointments/book-appointment?senderId=${senderId}&recipientId=${recipientId}`,
      appointmentRequest
    );
    console.log("Appointment booked successfully:", result); // TODO: delete
    return result.data;
  } catch (error) {
    console.error("Failed to fetch book-appointment:", error); // TODO: delete
    throw error;
  }
}
