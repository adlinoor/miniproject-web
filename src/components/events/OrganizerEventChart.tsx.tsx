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

export default function OrganizerEventChart() {
  const [data, setData] = useState<MonthlyCount[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/organizer/my-events");
        const events: EventData[] = res.data.data || [];

        const monthly: Record<string, number> = {};

        events.forEach((e) => {
          const date = new Date(e.startDate);
          const key = date.toLocaleString("default", { month: "short" });
          monthly[key] = (monthly[key] || 0) + 1;
        });

        const orderedMonths = [
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

        const result: MonthlyCount[] = orderedMonths
          .filter((m) => monthly[m])
          .map((month) => ({ month, count: monthly[month] }));

        setData(result);
      } catch (err) {
        toast.error("Failed to fetch event data");
        console.error("❌ Chart fetch failed:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-4">Events Created per Month</h2>
      {data.length === 0 ? (
        <p className="text-gray-600">No event data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
