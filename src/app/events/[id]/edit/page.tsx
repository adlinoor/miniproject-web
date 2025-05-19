"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

export default function EventDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!id || !user) return;

    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`
        );
        setEvent(res.data);
      } catch (error) {
        toast.error("Failed to fetch event");
      }
    };

    const checkJoined = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions/check`,
          {
            params: { eventId: id },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.joined) setHasJoined(true);
      } catch {
        // ignore error, assume not joined
      }
    };

    fetchEvent();
    checkJoined();
  }, [id, user]);

  const handleJoin = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
        { eventId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Successfully joined the event!");
      router.push("/my-events");
    } catch (error: any) {
      if (error.response?.status === 400 && error.response.data?.message) {
        toast.error(error.response.data.message);
        setHasJoined(true);
      } else {
        toast.error("Failed to join the event");
      }
    }
  };

  if (!event) return <p className="text-center mt-10">Loading event...</p>;

  return (
    <section className="max-w-4xl mx-auto py-12 px-6">
      {event.images?.length > 0 && (
        <img
          src={event.images[0].url}
          alt={event.title}
          className="w-full h-64 object-cover rounded-xl mb-6 border"
        />
      )}
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        {event.title}
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {event.description}
      </p>
      <div className="mb-2">
        <strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()}{" "}
        - {new Date(event.endDate).toLocaleDateString()}
      </div>
      <div className="mb-2">
        <strong>Location:</strong> {event.location}
      </div>
      <div className="mb-2">
        <strong>Category:</strong> {event.category}
      </div>
      <div className="mb-2">
        <strong>Price:</strong>{" "}
        {event.price > 0 ? `Rp${event.price.toLocaleString("id-ID")}` : "Free"}
      </div>
      <div className="mb-2">
        <strong>Seats Available:</strong> {event.availableSeats}
      </div>

      {user?.role === "CUSTOMER" && (
        <button
          onClick={handleJoin}
          disabled={hasJoined}
          className={`mt-6 px-6 py-2 text-white rounded transition-colors ${
            hasJoined
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {hasJoined ? "Already Joined" : "Join Event"}
        </button>
      )}
    </section>
  );
}
