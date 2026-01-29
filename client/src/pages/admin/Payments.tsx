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
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";

const baseUrl = "http://localhost:5000";

type Booking = {
  _id: string;
  user?: { fullName: string; email: string };
  hotel?: { name: string };
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod?: string;
  paymentOption?: string;
  advancePayment?: number;
  createdAt: string;
};

type PaymentRow = {
  id: string;
  userEmail: string;
  hotelName: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  method: string;
  paymentOption?: string;
  advancePayment?: number;
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
  const { toast } = useToast();

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
            method: b.paymentMethod || "razorpay",
            paymentOption: b.paymentOption,
            advancePayment: b.advancePayment,
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

  const totalAmount = useMemo(() => {
    return list.reduce((sum, p) => sum + p.amount, 0);
  }, [list]);

  const paidAmount = useMemo(() => {
    return list.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  }, [list]);

  const pendingAmount = useMemo(() => {
    return list.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  }, [list]);

  const statusColors = {
    paid: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    failed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  const downloadCSV = () => {
    const headers = [
      "Transaction ID",
      "Date",
      "User Email",
      "Hotel",
      "Payment Method",
      "Payment Option",
      "Amount Paid",
      "Total Amount",
      "Status",
    ];

    const rows = list.map((p) => [
      p.id,
      formatDate(p.date),
      p.userEmail,
      p.hotelName,
      p.method,
      p.paymentOption || "pay-now",
      p.paymentOption === "pay-at-hotel" ? (p.advancePayment || Math.round(p.amount * 0.1)) : p.amount,
      p.amount,
      p.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `payments_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Complete",
      description: `Downloaded ${list.length} payment records as CSV`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground mt-1">Track all payment transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="shadow-lg border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold mt-1">₹{totalAmount.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold mt-1 text-green-600">₹{paidAmount.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">₹{pendingAmount.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Transaction History</CardTitle>
              <p className="text-sm text-muted-foreground">{list.length} transactions found</p>
            </div>
            <Button onClick={downloadCSV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="py-10 flex items-center justify-center">
              <Loader label="Loading payments..." />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Input
              placeholder="Search by user or hotel"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="lg:col-span-2"
            />
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">✓ Paid</SelectItem>
                <SelectItem value="pending">⏳ Pending</SelectItem>
                <SelectItem value="failed">✗ Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hotel} onValueChange={(v) => setHotel(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Hotel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hotels</SelectItem>
                {hotels.map((h) => (
                  <SelectItem value={h} key={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 lg:col-span-5">
              <Input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="From"
              />
              <Input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="To"
              />
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-900">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Hotel</TableHead>
                    <TableHead className="font-semibold">Method</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((p) => (
                    <TableRow key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                      <TableCell className="font-medium">{formatDate(p.date)}</TableCell>
                      <TableCell>{p.userEmail}</TableCell>
                      <TableCell>{p.hotelName}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                          p.method === "razorpay" 
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        }`}>
                          {p.method}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[p.status]}`}>
                          {p.status}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold">
                        <div>₹{p.amount.toLocaleString()}</div>
                        {p.paymentOption === "pay-at-hotel" && p.status === "paid" && (
                          <div className="text-xs text-muted-foreground font-normal">
                            Paid: ₹{(p.advancePayment || Math.round(p.amount * 0.1)).toLocaleString()} (10%)
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {list.length === 0 && !loading && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No payments found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}