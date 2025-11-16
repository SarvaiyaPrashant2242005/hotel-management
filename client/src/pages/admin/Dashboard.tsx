import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const baseUrl = "https://hotel-management-plc3.onrender.com";

type Booking = {
  _id: string;
  hotel?: {
    _id: string;
    name: string;
  };
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
};

const COLORS = ["#6366F1", "#22C55E", "#EF4444"];

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;
        if (!token) {
          setBookings([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${baseUrl}/api/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          setBookings([]);
        } else {
          const data = await res.json();
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const revenueByMonth = useMemo(() => {
    const map = new Map<string, number>();
    bookings
      .filter((b) => b.paymentStatus === "paid")
      .forEach((b) => {
        const d = new Date(b.createdAt);
        if (Number.isNaN(d.getTime())) return;
        const key = d.toLocaleString("default", { month: "short" });
        map.set(key, (map.get(key) || 0) + (b.totalPrice || 0));
      });

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, revenue]) => ({ month, revenue }));
  }, [bookings]);

  const bookingsByStatus = useMemo(() => {
    const statuses = ["confirmed", "pending", "cancelled"] as const;
    return statuses.map((s) => ({
      status: s,
      count: bookings.filter((b) => b.status === s).length,
    }));
  }, [bookings]);

  const occupancyByHotel = useMemo(() => {
    const countMap = new Map<string, { name: string; count: number }>();
    bookings.forEach((b) => {
      const id = b.hotel?._id || "unknown";
      const name = b.hotel?.name || "Unknown Hotel";
      const current = countMap.get(id) || { name, count: 0 };
      current.count += 1;
      countMap.set(id, current);
    });

    const values = Array.from(countMap.values());
    if (!values.length) return [];

    const max = Math.max(...values.map((v) => v.count)) || 1;

    return values.map((v) => ({
      name: v.name,
      occupancy: Math.round((v.count / max) * 100),
    }));
  }, [bookings]);

  return (
    <div className="space-y-6">
      {loading && (
        <p className="text-muted-foreground text-sm">
          Loading dashboard data...
        </p>
      )}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (Paid Bookings)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {revenueByMonth.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No revenue data yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366F1"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No bookings yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingsByStatus}
                    dataKey="count"
                    nameKey="status"
                    outerRadius={90}
                    label
                  >
                    {bookingsByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Occupancy (Bookings per Hotel)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {occupancyByHotel.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hotel occupancy data yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyByHotel}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip />
                <Bar dataKey="occupancy" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}