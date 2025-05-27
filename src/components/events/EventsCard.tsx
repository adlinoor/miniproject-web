import Link from "next/link";
import Button from "@/components/ui/Button";

interface EventsCardProps {
  event: {
    id: number;
    title: string;
    location: string;
    description?: string;
    price: number;
    startDate: string;
    endDate?: string;
    images?: { url: string }[];
    promotions?: { code: string; discount: number }[];
  };
}

export default function EventsCard({ event }: EventsCardProps) {
  // Ambil gambar pertama dari array images (jika ada)
  const coverImage =
    event.images && event.images.length > 0
      ? event.images[0].url
      : "/favicons/apple-touch-icon.png"; // fallback image

  // Promo badge (hanya jika ada promo aktif)
  const activePromo =
    event.promotions && event.promotions.length > 0
      ? event.promotions[0]
      : null;

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full h-40 bg-gray-100">
        <img
          src={coverImage}
          alt="Event Image"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {activePromo && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-xl shadow">
            Promo {activePromo.discount}%
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-6 space-y-1 flex-1">
        {/* Event Name */}
        <Link href={`/events/${event.id}`}>
          <h2 className="text-xl font-semibold text-gray-800 group-hover:text-[#3b82f6] transition cursor-pointer">
            {event.title}
          </h2>
        </Link>
        <p className="text-sm text-gray-500">{event.location}</p>
        <p className="text-sm text-gray-600">
          📅{" "}
          {new Date(event.startDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          {event.endDate &&
            ` – ${new Date(event.endDate).toLocaleDateString("id-ID", {
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
          <p className="text-sm text-gray-500 mt-2 line-clamp-3">
            {event.description}
          </p>
        )}
      </div>
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
