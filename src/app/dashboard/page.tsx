"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function OrganizerDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/organizer/events`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };

    if (user?.role === "ORGANIZER") {
      fetchMyEvents();
    }
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <section className="max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">My Events Dashboard</h1>
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="grid gap-6">
            {events.map((event: any) => (
              <div
                key={event.id}
                className="border p-4 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <p className="text-gray-500 text-sm">
                    {new Date(event.startDate).toLocaleDateString()} -{" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/events/${event.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/${event.id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                          }
                        );
                        setEvents(events.filter((e: any) => e.id !== event.id));
                      } catch (err) {
                        console.error("Failed to delete event", err);
                      }
                    }}
                    className="text-red-600 hover:underline"
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
