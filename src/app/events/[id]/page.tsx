import { Event } from "@/types/event";
import axios from "axios";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function EventDetailPage({ params }: Props) {
  try {
    const response = await axios.get<Event>(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/${params.id}`
    );
    const event = response.data;

    return (
      <section className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-600 mb-6">{event.description}</p>
        <div className="mb-2">
          <strong>Date:</strong>{" "}
          {new Date(event.startDate).toLocaleDateString()} -{" "}
          {new Date(event.endDate).toLocaleDateString()}
        </div>
        <div className="mb-2">
          <strong>Location:</strong> {event.location}
        </div>
        <div className="mb-2">
          <strong>Price:</strong> Rp{event.price.toLocaleString()}
        </div>
        <div className="mb-2">
          <strong>Seats:</strong> {event.availableSeats}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Failed to fetch event:", error);
    notFound(); // Optional: you can customize 404 page
  }
}
