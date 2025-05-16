"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

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

export default function AttendeeListPage() {
  const { id } = useParams() as { id: string };
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/${id}/attendees`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAttendees(res.data.attendees);
      } catch (err) {
        toast.error("Failed to fetch attendees");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAttendees();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading attendees...</p>;

  return (
    <section className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Event Attendees</h1>
      {attendees.length === 0 ? (
        <p>No attendees found for this event.</p>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Tickets</th>
                <th className="px-4 py-2">Total Paid</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((a, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">
                    {a.user.first_name} {a.user.last_name}
                  </td>
                  <td className="px-4 py-2">{a.user.email}</td>
                  <td className="px-4 py-2">
                    {a.ticketTypes.map((t, j) => (
                      <div key={j}>
                        {t.quantity}× {t.type} (
                        {t.price.toLocaleString("id-ID")})
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    Rp{a.totalPaid.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-2">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
