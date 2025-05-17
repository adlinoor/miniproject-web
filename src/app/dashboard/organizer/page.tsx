"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api-client";
import Button from "@/components/ui/Button";

export default function OrganizerDashboardPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/organizer/events").then((res) => setEvents(res.data.data || []));
  }, []);

  return (
    <section className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        <Link href="/events/create">
          <Button variant="primary">+ Create New</Button>
        </Link>
      </div>
      {events.length === 0 ? (
        <p className="text-gray-600">No events yet. Start by creating one.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event: any) => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {event.name}
              </h3>
              <p className="text-sm text-gray-600">{event.location}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.start_date).toLocaleDateString()} -{" "}
                {new Date(event.end_date).toLocaleDateString()}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/events/${event.id}`}>
                  <Button variant="secondary">View</Button>
                </Link>
                <Link href={`/events/${event.id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Link href={`/events/${event.id}/attendees`}>
                  <Button variant="secondary">Attendees</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
