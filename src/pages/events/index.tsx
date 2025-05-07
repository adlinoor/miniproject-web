import { EventSearch } from "@/components/search/EventSearch";

const EventsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Discover Events</h1>
      <EventSearch />
    </div>
  );
};

export default EventsPage;
