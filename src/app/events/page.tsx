"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "@/components/events/EventsCard";
import SearchBar from "@/components/events/SearchBar";

type Event = {
  id: number;
  name: string;
  location: string;
  price: number;
  start_date: string;
  end_date: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
<<<<<<< HEAD
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events`
        );
        setEvents(response.data.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-center py-20">Loading events...</p>;
  }
=======
    axios
      .get(`/api/events?search=${query}`)
      .then((res) => setEvents(res.data))
      .catch(console.error);
  }, [query]);
>>>>>>> origin/rian

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Upcoming Events</h1>
      <SearchBar onSearch={setQuery} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </main>
  );
}
