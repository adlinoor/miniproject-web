export interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  price: number;
  availableSeats: number;
  organizerId: number;
  createdAt: string;
  updatedAt: string;
  images?: { url: string }[];
  promotions?: { code: string; discount: number }[];
  tickets?: {
    id: number;
    type: string;
    price: number;
    quantity: number;
  }[];
}
