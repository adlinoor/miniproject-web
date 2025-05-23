"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import EventSearch from "@/components/events/EventSearch";

export default function EventsPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {user?.role === "ORGANIZER" ? "My Events" : "All Events"}
      </h1>
      <EventSearch role={user?.role} />
    </main>
  );
}
