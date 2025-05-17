import Link from "next/link";

interface EventsCardProps {
  event: {
    id: number;
    name: string;
    location: string;
    description?: string;
    price: number;
    start_date: string;
    end_date?: string;
  };
}

export default function EventsCard({ event }: EventsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 border rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        {event.name}
      </h2>
      {event.location && (
        <p className="text-sm text-gray-600">{event.location}</p>
      )}
      {event.description && (
        <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
          {event.description}
        </p>
      )}
      <p className="mt-2 text-sm text-gray-500">
        📅 {new Date(event.start_date).toLocaleDateString()}
        {event.end_date &&
          ` - ${new Date(event.end_date).toLocaleDateString()}`}
      </p>
      <p className="text-sm text-gray-500">
        💰 {event.price === 0 ? "Free" : `Rp${event.price.toLocaleString()}`}
      </p>

      <div className="mt-4 flex justify-between items-center">
        <Link
          href={`/events/${event.id}`}
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          View Details
        </Link>
        <Link
          href={`/events/${event.id}/buy`}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Buy Ticket
        </Link>
      </div>
    </div>
  );
}
