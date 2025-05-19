import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <input
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
