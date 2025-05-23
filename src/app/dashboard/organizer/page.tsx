"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api-client";
import Button from "@/components/ui/Button";
import ProtectedRoute from "@/components/ProtectedRoute";
import OrganizerEventChart from "@/components/events/OrganizerEventChart.tsx";
import { EventStats } from "@/components/events/EventStats";
import toast from "react-hot-toast";
import { Eye, Edit, Users } from "lucide-react";

interface Event {
  id: number;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  isCancelled: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  status:
    | "waiting"
    | "confirmed"
    | "done"
    | "rejected"
    | "expired"
    | "canceled";
  createdAt: string;
}

export default function OrganizerDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Token missing");

        const eventRes = await api.get("/events/organizer/my-events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const txRes = await api.get("/transactions/organizer", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(eventRes.data.data || []);
        setTransactions(txRes.data.data || []);
      } catch (err: any) {
        toast.error("Dashboard data unavailable (fallback)");
        setEvents([]);
        setTransactions([]);
      }
    };

    fetchData();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <section className="max-w-6xl mx-auto p-4 sm:p-6 space-y-12">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">
            Organizer Dashboard
          </h1>
          <Link href="/events/create">
            <Button variant="primary">+ Create New</Button>
          </Link>
        </div>

        {/* Event Chart */}
        <OrganizerEventChart />

        {/* Divider */}
        <hr className="border-t border-gray-200" />

        {/* Event + Transaction Stats */}
        <EventStats events={events} transactions={transactions} />

        {/* Divider */}
        <hr className="border-t border-gray-200" />

        {/* Event List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My Events</h2>
          {events.length === 0 ? (
            <p className="text-gray-600">
              No events yet. Start by creating one.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.startDate).toLocaleDateString()} –{" "}
                        {new Date(event.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        event.isCancelled
                          ? "text-red-600 bg-red-100"
                          : "text-green-600 bg-green-100"
                      }`}
                    >
                      {event.isCancelled ? "Cancelled" : "Active"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/events/${event.id}`}>
                      <Button variant="secondary">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </Link>
                    <Link href={`/events/${event.id}/edit`}>
                      <Button variant="secondary">
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    </Link>
                    <Link href={`/events/${event.id}/attendees`}>
                      <Button variant="secondary">
                        <Users className="w-4 h-4 mr-1" /> Attendees
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}
