"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";
import { useFormContext, FieldError, FieldValues, Path } from "react-hook-form";
import clsx from "clsx";

interface InputFieldProps<TFormValues extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<TFormValues>;
  error?: FieldError;
}

const InputField = <TFormValues extends FieldValues>({
  label,
  name,
  error,
  ...rest
}: InputFieldProps<TFormValues>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFormValues>();

  const fieldError = error ?? (errors?.[name] as FieldError | undefined);
  const id = useId(); // for unique accessibility

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        {...register(name)}
        {...rest}
        className={clsx(
          "w-full p-2 border rounded",
          fieldError ? "border-red-500" : "border-gray-300"
        )}
      />
      {fieldError && (
        <p className="text-red-500 text-sm mt-1">* {fieldError.message}</p>
      )}
    </div>
  );
};

export default forwardRef(InputField) as <TFormValues extends FieldValues>(
  props: InputFieldProps<TFormValues> & { ref?: React.Ref<HTMLInputElement> }
) => ReturnType<typeof InputField>;
