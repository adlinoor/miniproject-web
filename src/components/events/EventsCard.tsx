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
    <div className="group bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-sky-700 transition">
          {event.name}
        </h2>
        <p className="text-sm text-gray-500 mb-1">{event.location}</p>

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

        <p className="text-sm text-gray-600">
          💰{" "}
          {event.price === 0
            ? "Free"
            : `Rp${event.price.toLocaleString("id-ID")}`}
        </p>

        {event.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center gap-2 mt-6 pt-4 border-t border-gray-100">
        <Link href={`/events/${event.id}`}>
          <Button variant="secondary">View Details</Button>
        </Link>
        <Link href={`/events/${event.id}/buy`}>
          <Button variant="primary">Buy Ticket</Button>
        </Link>
      </div>
    </div>
  );
}
