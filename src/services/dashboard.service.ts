import axios from "axios";

export const getOrganizerEvents = async () => {
  const response = await axios.get("/dashboard/events");
  return response.data;
};

export const getEventTransactions = async (eventId: number) => {
  const response = await axios.get(`/dashboard/events/${eventId}/transactions`);
  return response.data;
};

export const updateTransactionStatus = async (
  transactionId: number,
  status: "APPROVED" | "REJECTED"
) => {
  const response = await axios.patch(
    `/dashboard/transactions/${transactionId}`,
    { status }
  );
  return response.data;
};
