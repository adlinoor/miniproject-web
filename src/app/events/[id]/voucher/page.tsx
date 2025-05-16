"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

type FormData = {
  code: string;
  discount: number;
  start_date: string;
  end_date: string;
};

export default function CreateVoucherPage() {
  const params = useParams();
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post(`/api/events/${params.id}/vouchers`, data);
      toast.success("Voucher created!");
    } catch {
      toast.error("Failed to create voucher.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Voucher</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("code")}
          placeholder="Voucher Code"
          className="input"
        />
        <input
          type="number"
          {...register("discount", { valueAsNumber: true })}
          placeholder="Discount Amount (IDR)"
          className="input"
        />
        <input type="date" {...register("start_date")} className="input" />
        <input type="date" {...register("end_date")} className="input" />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
}
