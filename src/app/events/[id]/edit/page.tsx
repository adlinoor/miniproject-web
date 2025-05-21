"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import EventsForm, {
  EventFormValues,
  EventFormProps,
} from "@/components/events/EventsForm";

export default function EditEventPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [initialValues, setInitialValues] = useState<EventFormValues | null>(
    null
  );

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`
        );

        const event = res.data;

        if (user?.role !== "ORGANIZER" || user?.id !== event.organizerId) {
          toast.error("Unauthorized to edit this event");
          router.push("/unauthorized");
          return;
        }

        const [cityPart, ...locationParts] = event.location.split(" - ");
        const location = locationParts.join(" - ") || cityPart;

        const parsed: EventFormValues & { id?: string } = {
          id: event.id,
          name: event.title,
          description: event.description,
          startDate: event.startDate.slice(0, 10),
          endDate: event.endDate.slice(0, 10),
          price: event.price,
          seats: event.availableSeats,
          isFree: event.price === 0,
          category: event.category,
          city: locationParts.length > 0 ? cityPart : "",
        };

        setInitialValues(parsed);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch event data");
        router.push("/dashboard/organizer");
      }
    };

    fetchEvent();
  }, [id, user, router]);

  const handleUpdate = async (data: EventFormValues) => {
    try {
      const finalCity = data.city;
      const finalLocation = `${finalCity} - ${data.name}`;

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
        {
          title: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          price: data.price,
          availableSeats: data.seats,
          isFree: data.isFree,
          category: data.category,
          location: finalLocation,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Event updated successfully!");
      router.push("/dashboard/organizer");
    } catch (error: any) {
      console.error("Update failed:", error.response?.data || error);
      toast.error("Failed to update event");
    }
  };

  if (!initialValues) {
    return <p className="text-center mt-10">Loading form...</p>;
  }

  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Edit Event
      </h1>
      <EventsForm onSubmit={handleUpdate} initialValues={initialValues} />
    </section>
  );
}
