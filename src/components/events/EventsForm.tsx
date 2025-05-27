"use client";

import React, { useRef, useState, useEffect } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";

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
  ticketTypes: z
    .array(
      z.object({
        type: z.string().min(1, "Ticket type is required"),
        price: z
          .number({ invalid_type_error: "Price must be a number" })
          .min(0),
        quantity: z
          .number({ invalid_type_error: "Quantity must be a number" })
          .min(1),
      })
    )
    .min(1, "At least one ticket type is required"),
  // image: z.any().optional(), // DEPRECATED, use images
  images: z.any().optional(), // handle images as FileList or array
});

export type EventFormValues = z.infer<typeof EventSchema>;

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

interface EventFormProps {
  onSubmit: (data: FormData) => void;
  initialValues?: Partial<EventFormValues> & {
    id?: string;
    imageUrls?: string[];
  };
}

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
      ticketTypes: initialValues?.ticketTypes ?? [
        {
          type: "",
          price: 0,
          quantity: 1,
        },
      ],
    },
  });

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketTypes",
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        price: initialValues.price ?? 0,
        seats: initialValues.seats ?? 1,
        eventType: initialValues.eventType ?? "PAID",
        ticketTypes:
          initialValues.ticketTypes && initialValues.ticketTypes.length > 0
            ? initialValues.ticketTypes
            : [
                {
                  type: "",
                  price: 0,
                  quantity: 1,
                },
              ],
      });
    }
  }, [initialValues, reset]);

  const eventType = watch("eventType");

  // Images Preview
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialValues?.imageUrls ?? []
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setNewImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (idx: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit as FormData (with file and stringified ticketTypes)
  const internalSubmit = (data: EventFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append(
      "price",
      data.eventType === "FREE" ? "0" : String(data.price)
    );
    formData.append("seats", String(data.seats));
    formData.append("eventType", data.eventType);
    formData.append("category", data.category);
    formData.append("city", data.city);
    formData.append("location", data.city);
    formData.append("ticketTypes", JSON.stringify(data.ticketTypes));
    // Add new images to FormData
    newImages.forEach((file) => formData.append("images", file));
    onSubmit(formData);
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

        {/* Images (Multiple Upload) */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Event Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleImageChange}
            className="block w-full"
          />
          <div className="flex gap-2 mt-2">
            {imagePreviews.map((url, idx) => (
              <div key={idx} className="relative">
                <img
                  src={url}
                  alt={`preview-${idx}`}
                  className="h-16 w-16 object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded"
                  onClick={() => handleRemoveImage(idx)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Types (Dynamic) */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Ticket Types
          </label>
          {fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-end mb-2">
              <input
                {...register(`ticketTypes.${idx}.type`)}
                placeholder="Type"
                className="w-1/3 border rounded px-2 py-1"
              />
              <input
                {...register(`ticketTypes.${idx}.price`, {
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="Price"
                className="w-1/3 border rounded px-2 py-1"
              />
              <input
                {...register(`ticketTypes.${idx}.quantity`, {
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="quantity"
                className="w-1/3 border rounded px-2 py-1"
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="bg-red-100 hover:bg-red-300 rounded px-2 text-red-700"
              >
                -
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ type: "", price: 0, quantity: 1 })}
          >
            Add Ticket Type
          </Button>
          {errors.ticketTypes && (
            <p className="text-sm text-red-500">
              {(errors.ticketTypes as any).message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full">
          {initialValues?.id ? "Update Event" : "Create Event"}
        </Button>
      </form>
    </FormProvider>
  );
}
