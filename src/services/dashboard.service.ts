import api from "@/lib/api-client";

export const getOrganizerEvents = async () => {
  const response = await api.get("/events/organizer/my-events");
  return response.data?.data || [];
};

export const getEventTransactions = async (eventId: number) => {
  const response = await api.get(`/dashboard/events/${eventId}/transactions`);
  return response.data;
};

export const updateTransactionStatus = async (
  transactionId: number,
  status: "APPROVED" | "REJECTED"
) => {
  const response = await api.patch(`/dashboard/transactions/${transactionId}`, {
    status,
  });
  return response.data;
};
