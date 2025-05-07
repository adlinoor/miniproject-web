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
  id: string;
  amount: number;
  status:
    | "waiting"
    | "confirmed"
    | "done"
    | "rejected"
    | "expired"
    | "canceled";
  createdAt: string;
}

interface EventStatsProps {
  events: {
    id: string;
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
        label: "Revenue (IDR)",
        data: Array(12)
          .fill(0)
          .map((_, i) =>
            transactions
              .filter(
                (t) =>
                  new Date(t.createdAt).getMonth() === i && t.status === "done"
              )
              .reduce((sum, t) => sum + t.amount, 0)
          ),
        backgroundColor: "#4F46E5",
      },
    ],
  };

  const barOptions: ChartOptions<"bar"> = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `IDR ${Number(value).toLocaleString()}`,
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
