"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema Zod tanpa image
export const EventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price cannot be negative"),
  seats: z
    .number({ invalid_type_error: "Seats must be a number" })
    .min(1, "At least 1 seat required"),
  eventType: z.enum(["PAID", "FREE"]),
  category: z.string().min(1, "Category is required"),
  city: z.string().min(1, "City is required"),
});

export type EventFormValues = z.infer<typeof EventSchema>;

interface EventFormProps {
  onSubmit: (values: EventFormValues) => void;
  initialValues?: EventFormValues & { id?: string };
}

const defaultCategories = [
  "Music",
  "Workshop",
  "Seminar",
  "Business",
  "Tech",
  "Health",
  "Other",
];
const defaultCities = [
  "Jakarta",
  "Bandung",
  "Yogyakarta",
  "Surabaya",
  "Denpasar",
  "Other",
];

export default function EventsForm({
  onSubmit,
  initialValues,
}: EventFormProps) {
  const methods = useForm<EventFormValues>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      ...initialValues,
      price: initialValues?.price ?? 0,
      seats: initialValues?.seats ?? 1,
      eventType: initialValues?.eventType ?? "PAID",
    },
  });

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const eventType = watch("eventType");

  // Submit as JSON object
  const internalSubmit = (data: EventFormValues) => {
    // Sederhanakan: lokasi = "city - event name" (ikut versi backend kamu)
    onSubmit({
      ...data,
      location: `${data.city} - ${data.name}`,
    } as any);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(internalSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Event Name
          </label>
          <input
            {...register("name")}
            type="text"
            className="w-full border rounded px-3 py-2"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full border rounded px-3 py-2"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Dates */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1 text-gray-700">
              Start Date
            </label>
            <input
              {...register("startDate")}
              type="date"
              className="w-full border rounded px-3 py-2"
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1 text-gray-700">
              End Date
            </label>
            <input
              {...register("endDate")}
              type="date"
              className="w-full border rounded px-3 py-2"
            />
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* Event Type & Price */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1 text-gray-700">
              Event Type
            </label>
            <select
              {...register("eventType")}
              className="w-full border rounded px-3 py-2"
              onChange={(e) => {
                setValue("eventType", e.target.value as "PAID" | "FREE");
                if (e.target.value === "FREE") setValue("price", 0);
              }}
            >
              <option value="PAID">Paid</option>
              <option value="FREE">Free</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1 text-gray-700">
              Price (IDR)
            </label>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              placeholder="e.g. 50000"
              className="w-full border rounded px-3 py-2"
              disabled={eventType === "FREE"}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
        </div>

        {/* Seats */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Capacity (seats)
          </label>
          <input
            {...register("seats", { valueAsNumber: true })}
            type="number"
            className="w-full border rounded px-3 py-2"
          />
          {errors.seats && (
            <p className="text-sm text-red-500">{errors.seats.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Category
          </label>
          <select
            {...register("category")}
            className="w-full border rounded px-3 py-2"
          >
            <option value="" disabled>
              Select category
            </option>
            {defaultCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">City</label>
          <select
            {...register("city")}
            className="w-full border rounded px-3 py-2"
          >
            <option value="" disabled>
              Select city
            </option>
            {defaultCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          {initialValues?.id ? "Update Event" : "Create Event"}
        </button>
      </form>
    </FormProvider>
  );
}
