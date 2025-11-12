import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { bookings } from "@/data/bookings";

const revenueByMonth = [
  { month: "Jun", revenue: 42000 },
  { month: "Jul", revenue: 51000 },
  { month: "Aug", revenue: 48000 },
  { month: "Sep", revenue: 55000 },
  { month: "Oct", revenue: 60000 },
  { month: "Nov", revenue: 65000 },
];

const bookingsByStatus = [
  { status: "approved", count: bookings.filter(b => b.status === "approved").length },
  { status: "pending", count: bookings.filter(b => b.status === "pending").length },
  { status: "cancelled", count: bookings.filter(b => b.status === "cancelled").length },
];

const occupancyByHotel = [
  { name: "Sunrise Residency", occupancy: 78 },
  { name: "Ocean View Suites", occupancy: 84 },
  { name: "City Center Inn", occupancy: 69 },
  { name: "Hillside Retreat", occupancy: 73 },
];

const COLORS = ["#6366F1", "#22C55E", "#EF4444"];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bookings by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bookingsByStatus} dataKey="count" nameKey="status" outerRadius={90} label>
                  {bookingsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Occupancy Rates</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={occupancyByHotel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Bar dataKey="occupancy" fill="#22C55E" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
