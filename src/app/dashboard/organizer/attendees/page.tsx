"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api-client";
import { useAppSelector } from "@/lib/redux/hook";
import clsx from "clsx";

interface RawTransaction {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  details: {
    ticket: {
      type: string;
      price: number;
    };
    quantity: number;
  }[];
  quantity: number;
  totalPrice: number;
  status: string;
  paymentProof?: string;
}

interface Event {
  id: number;
  title: string;
  transactions: RawTransaction[];
}

interface Attendee {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  ticketTypes: {
    type: string;
    quantity: number;
    price: number;
  }[];
  totalQuantity: number;
  totalPaid: number;
  status: string;
  paymentProof?: string;
}

function normalizeTransactions(event: any): Attendee[] {
  if (!Array.isArray(event.transactions)) return [];

  return event.transactions.map((tx: any) => ({
    user: tx.user,
    ticketTypes: Array.isArray(tx.details)
      ? tx.details.map((d: any) => ({
          type: d.ticket?.type || "Unknown",
          quantity: d.quantity || 0,
          price: d.ticket?.price || 0,
        }))
      : [],
    totalQuantity: tx.quantity || 0,
    totalPaid: tx.totalPrice || 0,
    status: tx.status || "UNKNOWN",
    paymentProof: tx.paymentProof || "",
  }));
}

export default function AttendeeListPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [events, setEvents] = useState<
    (Event & { formattedTransactions: Attendee[] })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<number | "all">("all");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const fetchAttendees = async () => {
      try {
        const res = await api.get("/events/organizer/my-events");
        const rawEvents: Event[] = res.data?.data || [];

        const formatted = rawEvents.map((event) => ({
          ...event,
          formattedTransactions: normalizeTransactions(event),
        }));

        setEvents(formatted);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [user, router]);

  if (!user) return null;

  const filteredEvents =
    selectedEventId === "all"
      ? events
      : events.filter((e) => e.id === selectedEventId);

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">🧾 Attendee List</h1>

      {loading ? (
        <p className="text-center py-6 text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-6">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500">No events available.</p>
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) =>
                setSelectedEventId(
                  e.target.value === "all" ? "all" : parseInt(e.target.value)
                )
              }
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="all">All Events</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="mb-10 border rounded-xl p-6 shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold mb-4 text-primary">
                {event.title}
              </h2>

              {event.formattedTransactions.length === 0 ? (
                <p className="text-sm text-gray-500">No attendees yet.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {event.formattedTransactions.map((tx, i) => (
                    <li key={i} className="py-4 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {tx.user.first_name} {tx.user.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {tx.user.email}
                          </p>
                        </div>
                        <span
                          className={clsx(
                            "text-xs font-semibold px-2 py-1 rounded-full",
                            {
                              "bg-green-100 text-green-800":
                                tx.status === "DONE",
                              "bg-yellow-100 text-yellow-800":
                                tx.status === "WAITING_FOR_ADMIN_CONFIRMATION",
                            }
                          )}
                        >
                          {tx.status === "DONE" ? "Confirmed" : "Waiting"}
                        </span>
                      </div>

                      <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-2 list-disc">
                        {tx.ticketTypes.map((ticket, idx) => (
                          <li key={idx}>
                            {ticket.quantity} × {ticket.type} (
                            {ticket.price.toLocaleString()} IDR)
                          </li>
                        ))}
                      </ul>

                      <p className="text-sm text-gray-700 mt-1">
                        🎟 Total Tickets: <strong>{tx.totalQuantity}</strong> |
                        💰 Total Paid:{" "}
                        <strong>
                          {tx.totalPaid.toLocaleString("id-ID")} IDR
                        </strong>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}
    </main>
  );
}
