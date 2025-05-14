"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/ProtectedRoute";

type Event = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
};

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/transactions/myevents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(res.data);
      } catch (err) {
        toast.error("Failed to fetch your events");
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <section className="max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">My Registered Events</h1>
        {loading ? (
          <p>Loading...</p>
        ) : events.length === 0 ? (
          <p>You haven't joined any events yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="p-4 border rounded shadow-sm">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-2">{event.description}</p>
                <p className="text-sm text-gray-500 mb-1">
                  {new Date(event.startDate).toLocaleDateString()} -{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm mb-2">Location: {event.location}</p>
                <p className="text-sm mb-4">Price: Rp{event.price}</p>
                <Link
                  href={`/events/${event.id}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
