"use client";

import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const EventSchema = z
  .object({
    name: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    startDate: z.string().min(1, "Required"),
    endDate: z.string().min(1, "Required"),
    price: z.number().min(0, "Must be positive"),
    seats: z.number().min(1, "At least 1 seat"),
    eventType: z.enum(["PAID", "FREE"]),
    category: z.string().min(1, "Required"),
    city: z.string().min(1, "Required"),
    image: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end <= start) {
      ctx.addIssue({
        path: ["endDate"],
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
      });
    }
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
    defaultValues: initialValues || {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      price: 0,
      seats: 1,
      eventType: "PAID",
      category: "",
      city: "",
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
  const category = watch("category");
  const city = watch("city");

  const [customCity, setCustomCity] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues?.eventType === "FREE") {
      setValue("price", 0);
    }
  }, [initialValues?.eventType, setValue]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        encType="multipart/form-data"
      >
        {/* Basic inputs */}
        {[
          { label: "Event Name", name: "name", type: "text" },
          { label: "Description", name: "description", type: "text" },
          { label: "Start Date", name: "startDate", type: "date" },
          { label: "End Date", name: "endDate", type: "date" },
          { label: "Capacity", name: "seats", type: "number" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-medium mb-1 text-gray-700">
              {field.label}
            </label>
            <input
              {...register(field.name as keyof EventFormValues)}
              type={field.type}
              className="w-full border rounded px-3 py-2"
            />
            {errors[field.name as keyof EventFormValues] && (
              <p className="text-sm text-red-500 mt-1">
                {(errors[field.name as keyof EventFormValues] as any)?.message}
              </p>
            )}
          </div>
        ))}

        {/* Event Type */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Event Type
          </label>
          <select
            {...register("eventType")}
            onChange={(e) => {
              const value = e.target.value as "PAID" | "FREE";
              setValue("eventType", value);
              if (value === "FREE") setValue("price", 0);
            }}
            className="w-full border rounded px-3 py-2"
          >
            <option value="PAID">Paid</option>
            <option value="FREE">Free</option>
          </select>
        </div>

        {eventType === "PAID" && (
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Price (IDR)
            </label>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              placeholder="e.g. 50000"
              className="w-full border rounded px-3 py-2"
            />
            {errors.price && (
              <p className="text-sm text-red-500 mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Category
          </label>
          <select
            {...register("category")}
            className="w-full border rounded px-3 py-2"
            onChange={(e) => {
              const value = e.target.value;
              setValue("category", value);
              if (value === "Other") setCustomCategory("");
            }}
          >
            <option value="" disabled>
              Select a category
            </option>
            {defaultCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {category === "Other" && (
            <input
              value={customCategory}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCustomCategory(e.target.value);
                setValue("category", e.target.value);
              }}
              className="w-full mt-2 border rounded px-3 py-2"
              placeholder="Custom Category"
            />
          )}
        </div>

        {/* City */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">City</label>
          <select
            {...register("city")}
            className="w-full border rounded px-3 py-2"
            onChange={(e) => {
              const value = e.target.value;
              setValue("city", value);
              if (value === "Other") setCustomCity("");
            }}
          >
            <option value="" disabled>
              Select a city
            </option>
            {defaultCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {city === "Other" && (
            <input
              value={customCity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCustomCity(e.target.value);
                setValue("city", e.target.value);
              }}
              className="w-full mt-2 border rounded px-3 py-2"
              placeholder="Custom City"
            />
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Event Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreviewUrl(URL.createObjectURL(file));
                setValue("image", file);
              }
            }}
            className="w-full border rounded px-3 py-2"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-3 w-full max-h-64 object-cover rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {initialValues?.id ? "Update Event" : "Create Event"}
        </button>
      </form>
    </FormProvider>
  );
}
