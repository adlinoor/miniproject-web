"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";

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
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/organizer/my-events`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const events: EventData[] = res.data;
        const monthly: Record<string, number> = {};

        events.forEach((e) => {
          const date = new Date(e.startDate);
          const key = date.toLocaleString("default", { month: "short" });
          monthly[key] = (monthly[key] || 0) + 1;
        });

        const result: MonthlyCount[] = Object.entries(monthly).map(
          ([month, count]) => ({
            month,
            count,
          })
        );

        setData(result);
      } catch (err) {
        toast.error("Failed to fetch event data");
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-4">Events Created per Month</h2>
      {data.length === 0 ? (
        <p>No event data yet.</p>
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
