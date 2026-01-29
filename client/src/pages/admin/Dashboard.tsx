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
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/Loader";
import { TrendingUp, DollarSign, Calendar, Users, Building2, ArrowUpRight, ArrowDownRight } from "lucide-react";

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

const COLORS = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B"];

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

  const totalRevenue = useMemo(() => {
    return bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  }, [bookings]);

  const confirmedBookings = useMemo(() => {
    return bookings.filter((b) => b.status === "confirmed").length;
  }, [bookings]);

  const pendingBookings = useMemo(() => {
    return bookings.filter((b) => b.status === "pending").length;
  }, [bookings]);

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Confirmed Bookings",
      value: confirmedBookings,
      change: "+8.2%",
      trend: "up",
      icon: Calendar,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      change: "-3.1%",
      trend: "down",
      icon: Users,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      change: "+5.4%",
      trend: "up",
      icon: Building2,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {loading && (
        <div className="py-10 flex items-center justify-center">
          <Loader label="Loading dashboard data..." />
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-blue-100">Here's what's happening with your hotels today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      <TrendIcon className="w-4 h-4" />
                      <span className="font-medium">{stat.change}</span>
                      <span className="text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Revenue Trend
            </CardTitle>
            <p className="text-sm text-muted-foreground">Monthly revenue from paid bookings</p>
          </CardHeader>
          <CardContent className="h-80">
            {revenueByMonth.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No revenue data yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Bookings by Status
            </CardTitle>
            <p className="text-sm text-muted-foreground">Distribution of booking statuses</p>
          </CardHeader>
          <CardContent className="h-80">
            {bookings.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No bookings yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingsByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {bookingsByStatus.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Occupancy Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            Hotel Occupancy
          </CardTitle>
          <p className="text-sm text-muted-foreground">Booking distribution across hotels</p>
        </CardHeader>
        <CardContent className="h-96">
          {occupancyByHotel.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No hotel occupancy data yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyByHotel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis unit="%" stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="occupancy" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}