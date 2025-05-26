import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartData,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface Transaction {
  id: number;
  amount: number;
  status:
    | "WAITING_FOR_PAYMENT"
    | "WAITING_FOR_ADMIN_CONFIRMATION"
    | "DONE"
    | "REJECTED"
    | "EXPIRED"
    | "CANCELED";
  createdAt: string;
}

interface EventStatsProps {
  events: {
    id: number;
    startDate: string;
    endDate: string;
    isCancelled: boolean;
  }[];
  transactions: Transaction[];
}

export const EventStats: React.FC<EventStatsProps> = ({
  events,
  transactions,
}) => {
  // -------- Data
  const eventStatusData: ChartData<"doughnut"> = {
    labels: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
    datasets: [
      {
        data: [
          events.filter((e) => new Date(e.startDate) > new Date()).length,
          events.filter(
            (e) =>
              new Date() >= new Date(e.startDate) &&
              new Date() <= new Date(e.endDate)
          ).length,
          events.filter((e) => new Date() > new Date(e.endDate)).length,
          events.filter((e) => e.isCancelled).length,
        ],
        backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"],
      },
    ],
  };

  // -------- Monthly revenue array
  const monthlyRevenue = Array(12)
    .fill(0)
    .map((_, i) =>
      transactions
        .filter(
          (t) => new Date(t.createdAt).getMonth() === i && t.status === "DONE"
        )
        .reduce((sum, t) => sum + t.amount, 0)
    );

  // -------- Hitung max untuk Y-axis
  const maxValue = Math.max(...monthlyRevenue, 0);
  function getStepSize(maxValue: number) {
    if (maxValue <= 100_000) return 10_000;
    if (maxValue <= 1_000_000) return 100_000;
    if (maxValue <= 5_000_000) return 500_000;
    if (maxValue <= 20_000_000) return 2_000_000;
    if (maxValue <= 100_000_000) return 10_000_000;
    return 50_000_000;
  }
  const stepSize = getStepSize(maxValue);
  const suggestedMax = Math.max(
    stepSize * 2,
    Math.ceil(maxValue / stepSize) * stepSize
  );

  // -------- Bar Chart
  const revenueData: ChartData<"bar"> = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue (Rupiah)",
        data: monthlyRevenue,
        backgroundColor: "#4F46E5",
      },
    ],
  };

  const barOptions: ChartOptions<"bar"> = {
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: suggestedMax,
        ticks: {
          stepSize: stepSize,
          callback: (value) =>
            "Rp " +
            Number(value).toLocaleString("id-ID", { minimumFractionDigits: 0 }),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            return (
              label +
              ": Rp " +
              Number(value).toLocaleString("id-ID", {
                minimumFractionDigits: 0,
              })
            );
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Event Status Distribution</h3>
        <Doughnut data={eventStatusData} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Monthly Revenue</h3>
        <Bar data={revenueData} options={barOptions} />
      </div>
    </div>
  );
};
