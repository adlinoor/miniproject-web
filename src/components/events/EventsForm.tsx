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
    isFree: z.boolean(),
    category: z.string().min(1, "Required"),
    city: z.string().min(1, "Required"),
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

export interface EventFormProps {
  onSubmit: (values: EventFormValues) => void;
  initialValues?: EventFormValues & { id?: string };
}

const defaultCategories = [
  "Music",
  "Workshop",
  "Seminar",
  "Tech",
  "Education",
  "Business",
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
      isFree: false,
      category: "",
      city: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = methods;

  const isFree = watch("isFree");
  const city = watch("city");

  const [customCity, setCustomCity] = useState("");

  useEffect(() => {
    setValue("isFree", initialValues?.isFree ?? false);
    if (initialValues?.city && !defaultCities.includes(initialValues.city)) {
      setValue("city", "Other");
      setCustomCity(initialValues.city);
    }
  }, [initialValues?.isFree, initialValues?.city, setValue]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <InputField<EventFormValues> label="Price" name="price" type="number" />
        <InputField<EventFormValues> label="Seats" name="seats" type="number" />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFree"
            checked={isFree}
            onChange={(e) => setValue("isFree", e.target.checked)}
          />
          <label htmlFor="isFree">This event is free</label>
        </div>

        {/* Category Select */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Category
          </label>
          <select
            {...register("category")}
            defaultValue=""
            className="w-full border rounded-lg px-3 py-2 text-gray-700"
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
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* City Select */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">City</label>
          <select
            {...register("city")}
            className="w-full border rounded-lg px-3 py-2 text-gray-700"
            defaultValue=""
            onChange={(e) => {
              setValue("city", e.target.value);
              if (e.target.value !== "Other") {
                setCustomCity("");
              }
            }}
          >
            <option value="" disabled>
              Select a city
            </option>
            {defaultCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        {city === "Other" && (
          <InputField<EventFormValues>
            label="Custom City"
            name="city"
            value={customCity}
            onChange={(e) => {
              setCustomCity(e.target.value);
              setValue("city", e.target.value);
            }}
          />
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {initialValues?.id ? "Update Event" : "Create Event"}
        </button>
      </form>
    </FormProvider>
  );
}
