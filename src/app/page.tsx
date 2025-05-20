"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import api from "@/lib/api-client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isHydrated = useSelector((state: RootState) => state.auth.isHydrated);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const getDashboardLink = () => {
    if (user?.role === "CUSTOMER") return "/dashboard/customer";
    if (user?.role === "ORGANIZER") return "/dashboard/organizer";
    return "/dashboard";
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text drop-shadow-md">
          Discover Amazing Events
        </h1>

        {isHydrated && user && (
          <p className="text-lg font-medium text-gray-700 mt-2">
            Welcome back, <span className="text-indigo-600">{user.first_name} {user.last_name}</span>!
          </p>
        )}

        <p className="text-base md:text-xl text-gray-600 max-w-xl mx-auto mt-4 mb-6">
          Find, create, and manage events all in one place. Whether you're
          looking to attend or organize, we've got you covered.
        </p>

        <p className="text-sm text-gray-500 mb-8">
          Over <strong>10,000+</strong> users have joined. Ready to find your next experience?
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          {user ? (
            <Link href={getDashboardLink()}>
              <Button variant="primary" className="px-6 py-3 text-base rounded-full shadow-lg hover:scale-105 transition-transform">
                🧭 Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="secondary" className="px-6 py-3 text-base rounded-full shadow">
                  🔐 Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" className="px-6 py-3 text-base rounded-full shadow-lg">
                  📝 Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      <div className="flex items-center justify-center my-16">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-sm font-semibold tracking-widest text-gray-400 uppercase">
          ✨ Upcoming Events
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {events.length > 0 && (
        <section className="px-4 md:px-6 max-w-6xl mx-auto pb-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 6).map((event) => (
              <div
                key={event.id}
                className="rounded-xl bg-white shadow hover:shadow-xl transition border border-gray-200 p-5 hover:-translate-y-1 hover:bg-gray-50"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-2xl">📅</div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {event.description}
                  </p>
                </div>
                <div className="mt-4 text-right">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-sm text-primary hover:underline font-medium underline-offset-4"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}