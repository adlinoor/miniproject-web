import clsx from "clsx";

type BadgeProps = {
  status: "waiting" | "done" | "rejected";
  children?: React.ReactNode;
};

export default function Badge({ status, children }: BadgeProps) {
  const colorMap = {
    waiting: "bg-yellow-100 text-yellow-800",
    done: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <span className={clsx("text-xs font-semibold px-2.5 py-0.5 rounded", colorMap[status])}>
      {children || status.toUpperCase()}
    </span>
  );
}
