import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/components/Loader";

const baseUrl = "https://hotel-management-plc3.onrender.com";

type Booking = {
  _id: string;
  user?: { fullName: string; email: string };
  hotel?: { name: string };
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
};

type PaymentRow = {
  id: string;
  userEmail: string;
  hotelName: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  method: "razorpay";
  date: string;
};

export default function PaymentsPage() {
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "paid" | "pending" | "failed">(
    "all"
  );
  const [hotel, setHotel] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;
        if (!token) {
          setRows([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${baseUrl}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setRows([]);
        } else {
          const json = await res.json();
          const data: Booking[] = Array.isArray(json)
            ? json
            : Array.isArray(json?.bookings)
            ? json.bookings
            : [];

          const mapped: PaymentRow[] = data.map((b) => ({
            id: b._id,
            userEmail: b.user?.email || "",
            hotelName: b.hotel?.name || "Hotel",
            amount: b.totalPrice || 0,
            status: b.paymentStatus,
            method: "razorpay",
            date: b.createdAt,
          }));
          setRows(mapped);
        }
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const hotels = useMemo(
    () => Array.from(new Set(rows.map((p) => p.hotelName))),
    [rows]
  );

  const list = useMemo(() => {
    return rows.filter((p) => {
      const matchQ =
        !q ||
        p.userEmail.toLowerCase().includes(q.toLowerCase()) ||
        p.hotelName.toLowerCase().includes(q.toLowerCase());
      const matchS = status === "all" || p.status === status;
      const matchH = hotel === "all" || p.hotelName === hotel;
      const t = new Date(p.date).getTime();
      const fromOk = !from || t >= new Date(from).getTime();
      const toOk = !to || t <= new Date(to).getTime();
      return matchQ && matchS && matchH && fromOk && toOk;
    });
  }, [rows, q, status, hotel, from, to]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="py-10 flex items-center justify-center">
              <Loader label="Loading payments..." />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input
              placeholder="Search by user or hotel"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hotel} onValueChange={(v) => setHotel(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Hotel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All hotels</SelectItem>
                {hotels.map((h) => (
                  <SelectItem value={h} key={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{formatDate(p.date)}</TableCell>
                    <TableCell>{p.userEmail}</TableCell>
                    <TableCell>{p.hotelName}</TableCell>
                    <TableCell className="uppercase">
                      {p.method}
                    </TableCell>
                    <TableCell className="capitalize">
                      {p.status}
                    </TableCell>
                    <TableCell>₹{p.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {list.length === 0 && !loading && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}