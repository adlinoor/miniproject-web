"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "react-hot-toast";

interface EventData {
  id: number;
  title: string;
  startDate: string;
}

interface MonthlyCount {
  month: string;
  count: number;
}

const MONTHS = [
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
];

export default function OrganizerEventChart() {
  const [data, setData] = useState<MonthlyCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.get("/events/organizer/my-events");
        const events: EventData[] = (res.data?.data ||
          res.data ||
          []) as EventData[];

        // Hitung jumlah event per bulan
        const monthly: Record<string, number> = {};
        events.forEach((e) => {
          const date = new Date(e.startDate);
          const key = MONTHS[date.getMonth()];
          monthly[key] = (monthly[key] || 0) + 1;
        });

        // Pastikan 12 bulan selalu muncul
        const result: MonthlyCount[] = MONTHS.map((month) => ({
          month,
          count: monthly[month] || 0,
        }));

        setData(result);
      } catch (err) {
        toast.error("Failed to fetch event data");
        console.error("❌ Chart fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-4">Events Created per Month</h2>
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : data.every((d) => d.count === 0) ? (
        <p className="text-gray-600">No event data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "#fff", borderRadius: 8 }}
              formatter={(value: any) => [`${value} events`, "Events"]}
            />
            <Legend />
            <Bar
              dataKey="count"
              name="Events"
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
