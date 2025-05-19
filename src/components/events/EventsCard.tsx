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
    <div className="card flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-semibold mb-1">{event.name}</h2>
        <p className="text-sm text-gray-500">{event.location}</p>

        <p className="text-sm text-gray-600 mt-2">
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
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
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
