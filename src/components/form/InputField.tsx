"use client";

import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import clsx from "clsx";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: FieldError;
}

export default function InputField({
  label,
  name,
  error,
  ...rest
}: InputFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block font-medium mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        {...rest}
        className={clsx(
          "w-full p-2 border rounded",
          error ? "border-red-500" : "border-gray-300"
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1">* {error.message}</p>}
    </div>
  );
}
