"use client";

import { InputHTMLAttributes, forwardRef, useId, ForwardedRef } from "react";
import { useFormContext, FieldError, FieldValues, Path } from "react-hook-form";
import clsx from "clsx";

interface InputFieldProps<TFormValues extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<TFormValues>;
  error?: FieldError;
}

function InputFieldInner<TFormValues extends FieldValues>(
  { label, name, error, ...rest }: InputFieldProps<TFormValues>,
  ref: ForwardedRef<HTMLInputElement>
) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFormValues>();

  const fieldError = error ?? (errors?.[name] as FieldError | undefined);
  const id = useId();

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        {...register(name)}
        {...rest}
        ref={ref}
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
}

const InputField = forwardRef(InputFieldInner) as <
  TFormValues extends FieldValues
>(
  props: InputFieldProps<TFormValues> & { ref?: ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof InputFieldInner>;

export default InputField;
