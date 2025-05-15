"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type Event = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  category: string;
  location: string;
  price: number;
};

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/organizer/my-events`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
        toast.error("Failed to load your events");
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const handleDelete = async (eventId: number) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Event deleted successfully!");
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error("Failed to delete event", error);
      toast.error("Failed to delete event");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">My Events</h1>

        {loading ? (
          <p>Loading...</p>
        ) : events.length === 0 ? (
          <p>You have no events yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="border p-4 rounded shadow-sm">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(event.startDate).toLocaleDateString()} -{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {event.category} | {event.location}
                </p>
                <p className="text-sm text-gray-700">
                  Rp{event.price.toLocaleString("id-ID")}
                </p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>
                  <Link
                    href={`/events/edit/${event.id}`}
                    className="text-yellow-600 underline"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/events/${event.id}/attendees`}
                    className="text-green-600 underline"
                  >
                    Attendees
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
