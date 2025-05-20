import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).slice(2);

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          className={clsx(
            "w-full p-2 border rounded bg-white focus:outline-none transition",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[var(--primary)]",
            className
          )}
          {...props}
        />

        {error && <p className="text-sm text-red-500">{error.message}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
