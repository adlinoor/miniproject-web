import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-full font-medium text-sm sm:text-base transition px-5 py-2",
        variant === "primary"
          ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
          : "bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--secondary-hover)]",
        className
      )}
      {...props}
    />
  );
}
