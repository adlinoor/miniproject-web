"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api-client";
import EventsForm, { EventFormValues } from "@/components/events/EventsForm";

export default function CreateEventPage() {
  const router = useRouter();

  // Terima langsung object EventFormValues
  const handleSubmit = async (data: EventFormValues) => {
    try {
      // Mapping field backend: title, description, startDate, endDate, price, availableSeats, category, location
      await api.post("/events", {
        title: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        price: data.eventType === "FREE" ? 0 : data.price,
        availableSeats: data.seats,
        category: data.category,
        location: `${data.city} - ${data.name}`,
      });
      toast.success("Event created successfully!");
      router.push("/dashboard/organizer");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <section className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create a New Event
        </h1>
        {/* Pastikan EventsForm onSubmit menerima object */}
        <EventsForm onSubmit={handleSubmit} />
      </section>
    </ProtectedRoute>
  );
}
