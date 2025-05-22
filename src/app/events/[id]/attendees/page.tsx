"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api-client";
import clsx from "clsx";

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

export default function EventAttendeesPage() {
  const { id } = useParams();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [eventTitle, setEventTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const event = res.data;

        setEventTitle(event.title || `Event ${id}`);

        const normalized = (event.transactions || []).map((tx: any) => ({
          user: tx.user,
          ticketTypes: (tx.details || []).map((d: any) => ({
            type: d.ticket?.type || "Unknown",
            quantity: d.quantity || 0,
            price: d.ticket?.price || 0,
          })),
          totalQuantity: tx.quantity,
          totalPaid: tx.totalPrice,
          status: tx.status,
          paymentProof: tx.paymentProof,
        }));

        setAttendees(normalized);
      } catch (err: any) {
        setError("Failed to load event attendees.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Attendees for "{eventTitle}"
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading attendees...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : attendees.length === 0 ? (
          <p className="text-center text-gray-500">No attendees yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {attendees.map((tx, i) => (
              <li key={i} className="py-4 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {tx.user.first_name} {tx.user.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{tx.user.email}</p>
                  </div>
                  <span
                    className={clsx(
                      "text-xs font-semibold px-2 py-1 rounded-full",
                      {
                        "bg-green-100 text-green-800": tx.status === "DONE",
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
                  🎟 Total Tickets: <strong>{tx.totalQuantity}</strong> | 💰
                  Total Paid:{" "}
                  <strong>{tx.totalPaid.toLocaleString("id-ID")} IDR</strong>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
