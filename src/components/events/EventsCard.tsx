import React from "react";

type Props = {
  event: {
    id: number;
    name: string;
    location: string;
    price: number;
    start_date: string;
    end_date: string;
  };
};

const EventCard: React.FC<Props> = ({ event }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <h2 className="text-xl font-bold">{event.name}</h2>
      <p className="text-sm text-gray-600">{event.location}</p>
      <p className="text-sm">
        {new Date(event.start_date).toLocaleDateString()} -{" "}
        {new Date(event.end_date).toLocaleDateString()}
      </p>
      <p className="mt-2 font-semibold">
        {event.price > 0 ? `IDR ${event.price.toLocaleString()}` : "Free"}
      </p>
    </div>
  );
};

export default EventCard;
