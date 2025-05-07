export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  seats: number;
  availableSeats?: number;
  location: string; // Required for location filter
  category: string; // Required for category filter
  organizerId?: string;
  isCancelled?: boolean;
}

export interface Transaction {
  id: string;
  eventId: string;
  userId: string;
  amount: number;
  status:
    | "waiting"
    | "confirmed"
    | "done"
    | "rejected"
    | "expired"
    | "canceled";
  paymentProof?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventFormValues {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  seats: number;
  isFree: boolean;
  location: string;
  category: string;
}
