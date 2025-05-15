type Props = {
  status:
    | "waiting_payment"
    | "waiting_confirmation"
    | "done"
    | "rejected"
    | "expired"
    | "canceled";
};

const statusColor: Record<Props["status"], string> = {
  waiting_payment: "bg-yellow-400",
  waiting_confirmation: "bg-orange-400",
  done: "bg-green-500",
  rejected: "bg-red-500",
  expired: "bg-gray-500",
  canceled: "bg-gray-300",
};

export default function TransactionStatusBadge({ status }: Props) {
  return (
    <span
      className={`px-3 py-1 text-sm text-white rounded ${statusColor[status]}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
