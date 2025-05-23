import Link from "next/link";
import Button from "@/components/ui/Button";

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
    <div className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between overflow-hidden">
      <div className="p-6 space-y-1">
        {/* Event Name */}
        <Link href={`/events/${event.id}`}>
          <h2 className="text-xl font-semibold text-gray-800 group-hover:text-[#3b82f6] transition cursor-pointer">
            {event.name}
          </h2>
        </Link>

        {/* Event Location */}
        <p className="text-sm text-gray-500">{event.location}</p>

        {/* Event Date */}
        <p className="text-sm text-gray-600">
          📅{" "}
          {new Date(event.start_date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          {event.end_date &&
            ` – ${new Date(event.end_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}`}
        </p>

        {/* Event Price */}
        <p className="text-sm text-gray-600">
          💰{" "}
          {event.price === 0
            ? "Free"
            : `Rp${event.price.toLocaleString("id-ID")}`}
        </p>

        {/* Event Description */}
        {event.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-3">
            {event.description}
          </p>
        )}
      </div>

      {/* Button Section */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-center">
        <Link href={`/events/${event.id}`} className="w-full">
          <Button variant="secondary" className="w-full text-center">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
