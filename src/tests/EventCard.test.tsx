import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import EventsCard from "@/components/events/EventsCard";

describe("EventsCard", () => {
  it("renders event card with title and location", () => {
    const dummyEvent = {
      id: 1,
      title: "Sample Event",
      location: "Jakarta",
      description: "This is a sample event",
      price: 50000,
      startDate: "2025-06-01T10:00:00.000Z",
      endDate: "2025-06-01T12:00:00.000Z",
      images: [{ url: "https://example.com/image.png" }],
      promotions: [{ code: "PROMO10", discount: 10000 }],
    };

    render(<EventsCard event={dummyEvent} />);

    const title = screen.getByRole("heading", { name: /sample event/i });
    expect(title).toBeInTheDocument();

    const location = screen.getByText(/jakarta/i);
    expect(location).toBeInTheDocument();
  });
});
