import { useMemo, useState } from "react";
import { payments as basePayments, type PaymentItem, type PaymentMethod, type PaymentStatus } from "@/data/payments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PaymentsPage() {
  const [rows] = useState<PaymentItem[]>(basePayments);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "all">("all");
  const [method, setMethod] = useState<PaymentMethod | "all">("all");
  const [hotel, setHotel] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const hotels = useMemo(() => Array.from(new Set(basePayments.map(p => p.hotelName))), []);

  const list = useMemo(() => {
    return rows.filter(p => {
      const matchQ = !q || p.userEmail.toLowerCase().includes(q.toLowerCase());
      const matchS = status === "all" || p.status === status;
      const matchM = method === "all" || p.method === method;
      const matchH = hotel === "all" || p.hotelName === hotel;
      const t = new Date(p.date).getTime();
      const fromOk = !from || t >= new Date(from).getTime();
      const toOk = !to || t <= new Date(to).getTime();
      return matchQ && matchS && matchM && matchH && fromOk && toOk;
    });
  }, [rows, q, status, method, hotel, from, to]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <Input placeholder="Search by user email" value={q} onChange={(e) => setQ(e.target.value)} />
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={method} onValueChange={(v) => setMethod(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="netbanking">Netbanking</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hotel} onValueChange={(v) => setHotel(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Hotel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All hotels</SelectItem>
                {hotels.map(h => (<SelectItem key={h} value={h}>{h}</SelectItem>))}
              </SelectContent>
            </Select>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
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
                {list.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                    <TableCell>{p.userEmail}</TableCell>
                    <TableCell>{p.hotelName}</TableCell>
                    <TableCell className="uppercase">{p.method}</TableCell>
                    <TableCell className="capitalize">{p.status}</TableCell>
                    <TableCell>₹{p.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {list.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">No payments found</TableCell>
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
