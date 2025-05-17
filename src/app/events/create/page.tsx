"use client";

import { useForm, FormProvider } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const schema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  price: z.number().nonnegative(),
  start_date: z.string(),
  end_date: z.string(),
  description: z.string().min(10),
});
type FormData = z.infer<typeof schema>;

export default function CreateEventPage() {
  const methods = useForm<FormData>({ resolver: zodResolver(schema) });
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/events", data);
      toast.success("Event created!");
      router.push("/my-events");
    } catch (error) {
      toast.error("Failed to create event");
    }
  };

  return (
    <section className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create New Event</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <Input name="name" placeholder="Event Name" />
          <Input name="location" placeholder="Location" />
          <Input name="price" type="number" placeholder="Price (IDR)" />
          <Input name="start_date" type="date" />
          <Input name="end_date" type="date" />
          <Input name="description" placeholder="Description" />
          <Button type="submit" className="w-full">
            Create Event
          </Button>
        </form>
      </FormProvider>
    </section>
  );
}
