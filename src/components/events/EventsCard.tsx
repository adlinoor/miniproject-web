import { Event } from "@/types/events";
import { FiCalendar, FiMapPin, FiDollarSign } from "react-icons/fi";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const startDate = new Date(event.startDate).toLocaleDateString();
  const endDate = new Date(event.endDate).toLocaleDateString();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {event.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-500">
            <FiCalendar className="mr-2" />
            <span>
              {startDate} {startDate !== endDate ? `- ${endDate}` : ""}
            </span>
          </div>

          <div className="flex items-center text-gray-500">
            <FiMapPin className="mr-2" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-gray-500">
            <FiDollarSign className="mr-2" />
            <span>
              {event.price > 0 ? `IDR ${event.price.toLocaleString()}` : "Free"}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={`/events/${event.id}`}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
