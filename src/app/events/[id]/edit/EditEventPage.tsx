"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import EventsForm, { EventFormValues } from "@/components/events/EventsForm";
import api from "@/lib/api-client";

export default function EditEventPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, isHydrated } = useSelector((state: RootState) => state.auth);
  const [initialValues, setInitialValues] = useState<
    (EventFormValues & { id?: string; imageUrl?: string }) | null
  >(null);

  useEffect(() => {
    if (!id || !isHydrated || !user) return;

    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        // INI YANG BENAR:
        const event = res.data.data;

        if (
          user.role !== "ORGANIZER" ||
          Number(user.id) !== Number(event.organizerId)
        ) {
          toast.error("Unauthorized to edit this event");
          router.push("/unauthorized");
          return;
        }

        setInitialValues({
          id: event.id,
          name: event.title,
          description: event.description,
          startDate: event.startDate?.slice(0, 10),
          endDate: event.endDate?.slice(0, 10),
          price: event.price,
          seats: event.availableSeats,
          eventType: event.price === 0 ? "FREE" : "PAID",
          category: event.category,
          city: event.location?.split(" - ")[0] || "",
          imageUrl: event.imageUrl || undefined,
        });
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch event data");
        router.push("/dashboard/organizer");
      }
    };

    fetchEvent();
  }, [id, isHydrated, user, router]);

  // Submit form sebagai FormData (bisa update foto)
  const handleUpdate = async (formData: FormData) => {
    try {
      const res = await api.put(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Event updated successfully!");
        router.push("/dashboard/organizer");
      } else {
        toast.error("Unexpected response status");
      }
    } catch (error: any) {
      console.error("Update failed:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to update event");
    }
  };

  // Delete event
  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirm) return;

    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted successfully!");
      router.push("/dashboard/organizer");
    } catch (error: any) {
      console.error("Delete failed:", error.response?.data || error);
      toast.error("Failed to delete event");
    }
  };

  if (!initialValues) {
    return <p className="text-center mt-10">Loading form...</p>;
  }

  return (
    <section className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Edit Event
      </h1>
      <EventsForm onSubmit={handleUpdate} initialValues={initialValues} />
      <div className="mt-6 text-right">
        <button
          onClick={handleDelete}
          title="This will permanently delete the event"
          className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium text-sm transition"
        >
          Delete Event
        </button>
      </div>
    </section>
  );
}
