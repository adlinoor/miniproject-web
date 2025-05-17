import { InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        "w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition",
        className
      )}
      {...props}
    />
  );
}
