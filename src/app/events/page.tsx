"use client";
import { EventSearch } from "@/components/search/EventSearch";

export default function EventsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">All Events</h1>
      <EventSearch />
    </main>
  );
}
