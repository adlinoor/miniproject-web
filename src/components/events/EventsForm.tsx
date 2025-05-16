"use client";

import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/shared/InputField";
import { useEffect } from "react";

interface EventFormValues {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  seats: number;
  isFree: boolean;
}

interface EventFormProps {
  onSubmit: (values: EventFormValues) => void;
  initialValues?: EventFormValues;
}

const EventSchema = z
  .object({
    name: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    startDate: z.string().min(1, "Required"),
    endDate: z.string().min(1, "Required"),
    price: z.number().min(0, "Must be positive"),
    seats: z.number().min(1, "At least 1 seat"),
    isFree: z.boolean(),
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
    },
  });

  const { handleSubmit, setValue, watch } = methods;

  // Ensure checkbox updates reactively
  const isFree = watch("isFree");

  useEffect(() => {
    setValue("isFree", initialValues?.isFree ?? false);
  }, [initialValues?.isFree, setValue]);

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
