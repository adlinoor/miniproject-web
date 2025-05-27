"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api-client";
import EventsForm from "@/components/events/EventsForm";

export default function CreateEventPage() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      await api.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
        <EventsForm onSubmit={handleSubmit} />
      </section>
    </ProtectedRoute>
  );
}
