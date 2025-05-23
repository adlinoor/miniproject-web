import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import EventsCard from "@/components/events/EventsCard";

describe("EventCard", () => {
  it("renders event card with name and location", () => {
    const dummyEvent = {
      id: 1,
      name: "Sample Event",
      location: "Jakarta",
      price: 0,
      start_date: new Date().toISOString(), // ✅ ISO date
    };

    render(<EventsCard event={dummyEvent} />);
    expect(screen.getByText(/sample event/i)).toBeInTheDocument();
    expect(screen.getByText(/jakarta/i)).toBeInTheDocument();
  });
});
