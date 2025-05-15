"use client";
<<<<<<< HEAD
=======

>>>>>>> origin/rian
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]); // Menambahkan tipe untuk state events

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events`
        ); // Menggunakan URL dari .env
        setEvents(response.data); // Menyimpan data events ke state
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents(); // Panggil fungsi fetchEvents ketika komponen pertama kali dimuat
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Discover Amazing Events
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Find, create, and manage events all in one place. Whether you're
          looking to attend or organize, we've got you covered.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/events"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Browse Events
          </Link>
          <Link
            href="/create-event"
            className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Create Event
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Why Choose EventHub?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Add feature cards here */}
          <div className="text-center p-6 border rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold">Easy to Use</h3>
            <p className="mt-4 text-gray-600">
              User-friendly interface for everyone!
            </p>
          </div>
          <div className="text-center p-6 border rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold">Manage Events</h3>
            <p className="mt-4 text-gray-600">
              Create, manage, and organize your events in one place.
            </p>
          </div>
          <div className="text-center p-6 border rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold">Meet New People</h3>
            <p className="mt-4 text-gray-600">
              Connect with like-minded individuals at every event.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto pb-32">
        <h3 className="text-2xl font-bold text-center mb-8">Upcoming Events</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 p-6 border rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {event.title}
                </h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {event.description}
                </p>
                <div className="mt-4">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No events found.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
