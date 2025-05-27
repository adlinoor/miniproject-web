"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import EventsForm from "@/components/events/EventsForm";
import api from "@/lib/api-client";

export default function EditEventPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, isHydrated } = useSelector((state: RootState) => state.auth);
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!id || !isHydrated || !user) return;

    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const event = res.data.data;
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
          imageUrls: event.images?.map((img: any) => img.url) || [],
          ticketTypes:
            event.tickets?.map((t: any) => ({
              type: t.type,
              price: t.price,
              quantity: t.quantity,
            })) ?? [],
        });
      } catch {
        toast.error("Failed to fetch event data");
        router.push("/dashboard/organizer");
      }
    };
    fetchEvent();
  }, [id, isHydrated, user, router]);

  const handleUpdate = async (formData: FormData) => {
    try {
      await api.put(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Event updated!");
      router.push("/dashboard/organizer");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update event");
    }
  };

  if (!initialValues) return <div>Loading...</div>;

  return (
    <section className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Edit Event
      </h1>
      <EventsForm onSubmit={handleUpdate} initialValues={initialValues} />
    </section>
  );
}
