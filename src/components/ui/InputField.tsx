"use client";

import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  type?: string;
}

export default function InputField({
  name,
  label,
  type = "text",
  ...rest
}: InputFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = (errors[name]?.message || "") as string;

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>
      <input
        type={type}
        {...register(name)}
        {...rest}
        className="w-full p-2 border border-gray-300 rounded"
      />
      {errorMessage && <p className="text-red-500 text-sm">*{errorMessage}</p>}
    </div>
  );
}
