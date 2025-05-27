import { InputHTMLAttributes, forwardRef, useState } from "react";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).slice(2);
    const [show, setShow] = useState(false);

    const inputType = type === "password" ? (show ? "text" : "password") : type;

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
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={clsx(
              "input",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-[var(--primary)]",
              type === "password" && "pr-14",
              className
            )}
            {...props}
          />
          {type === "password" && (
            <button
              type="button"
              tabIndex={-1}
              className={clsx(
                "absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded",
                "bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              )}
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? "Hide" : "Show"}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error.message}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
