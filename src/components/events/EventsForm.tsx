"use client";

import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/shared/InputField";
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
    setValue,
    register,
    watch,
    formState: { errors },
  } = methods;

  const eventType = watch("eventType");
  const city = watch("city");
  const category = watch("category");

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
        <InputField<EventFormValues> label="Event Name" name="name" />
        <InputField<EventFormValues> label="Description" name="description" />
        <InputField<EventFormValues>
          label="Start Date"
          name="startDate"
          type="date"
        />
        <InputField<EventFormValues>
          label="End Date"
          name="endDate"
          type="date"
        />
        <InputField<EventFormValues>
          label="Capacity"
          name="seats"
          type="number"
        />

        {/* Event Type */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Event Type
          </label>
          <select
            {...register("eventType")}
            defaultValue="PAID"
            className="w-full border rounded-lg px-3 py-2 text-gray-700"
            onChange={(e) => {
              const value = e.target.value as "PAID" | "FREE";
              setValue("eventType", value);
              if (value === "FREE") setValue("price", 0);
            }}
          >
            <option value="PAID">Paid</option>
            <option value="FREE">Free</option>
          </select>
        </div>

        {/* Price only if Paid */}
        {eventType === "PAID" && (
          <InputField<EventFormValues>
            label="Price (IDR)"
            name="price"
            type="number"
            placeholder="e.g. 50000"
          />
        )}

        {/* Category Select */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Category
          </label>
          <select
            {...register("category")}
            defaultValue=""
            className="w-full border rounded-lg px-3 py-2 text-gray-700"
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
            <InputField<EventFormValues>
              name="category"
              label="Custom Category"
              value={customCategory}
              onChange={(e) => {
                setCustomCategory(e.target.value);
                setValue("category", e.target.value);
              }}
            />
          )}
        </div>

        {/* City Select */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">City</label>
          <select
            {...register("city")}
            defaultValue=""
            className="w-full border rounded-lg px-3 py-2 text-gray-700"
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
            <InputField<EventFormValues>
              name="city"
              label="Custom City"
              value={customCity}
              onChange={(e) => {
                setCustomCity(e.target.value);
                setValue("city", e.target.value);
              }}
            />
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Event Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreviewUrl(URL.createObjectURL(file));
                setValue("image", file);
              }
            }}
            className="w-full border rounded-lg px-3 py-2"
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
