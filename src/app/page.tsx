import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
          {/* Feature cards... */}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto pb-32">
        {/* Event cards... */}
      </section>
    </>
  );
}
