"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function OrganizerDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/organizer`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch organizer events", err);
      }
    };

    if (user?.role === "ORGANIZER") fetchOrganizerEvents();
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-8">My Events</h1>
        {events.length === 0 ? (
          <p>No events found. Try creating one!</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <div
                key={event.id}
                className="border rounded-md p-4 shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(event.startDate).toLocaleDateString()} -{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </p>
                <Link
                  href={`/events/${event.id}`}
                  className="text-blue-600 mt-2 inline-block"
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
