import { useMemo, useState } from "react";
import { bookings as rawBookings, BookingStatus, type BookingItem } from "@/data/bookings";
import { users } from "@/data/users";
import { hotels as hotelsAll } from "@/data/hotels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function BookingsPage() {
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [hotel, setHotel] = useState<string>("all");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [rows, setRows] = useState(rawBookings);

  const [form, setForm] = useState<{
    userId: string;
    hotelId: number | "";
    checkIn: string;
    checkOut: string;
    amount: string;
    status: BookingStatus;
  }>({ userId: users[0]?.id ?? "", hotelId: hotelsAll[0]?.id ?? "", checkIn: "", checkOut: "", amount: "", status: "pending" });

  const hotelNames = useMemo(() => Array.from(new Set(rawBookings.map(b => b.hotelName))), []);

  const bookings = useMemo(() => {
    return rows.filter(b => {
      const matchStatus = status === "all" || b.status === status;
      const matchHotel = hotel === "all" || b.hotelName === hotel;
      const ci = new Date(b.checkIn).getTime();
      const fromOk = !from || ci >= new Date(from).getTime();
      const toOk = !to || ci <= new Date(to).getTime();
      return matchStatus && matchHotel && fromOk && toOk;
    });
  }, [rows, status, hotel, from, to]);

  const handleApprove = (id: string) => {
    setRows(prev => prev.map(b => (b.id === id ? { ...b, status: "approved" as const } : b)));
  };

  const handleCancel = (id: string) => {
    setRows(prev => prev.map(b => (b.id === id ? { ...b, status: "cancelled" as const } : b)));
  };

  const addBooking = () => {
    if (!form.userId || !form.hotelId || !form.checkIn || !form.checkOut) return;
    const u = users.find(u => u.id === form.userId);
    const h = hotelsAll.find(h => h.id === Number(form.hotelId));
    if (!u || !h) return;
    const next: BookingItem = {
      id: `b${rows.length + 1}`,
      userName: u.name,
      userEmail: u.email,
      hotelName: h.name,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      amount: Number(form.amount || 0),
      status: form.status,
    };
    setRows(prev => [next, ...prev]);
    setForm({ userId: users[0]?.id ?? "", hotelId: hotelsAll[0]?.id ?? "", checkIn: "", checkOut: "", amount: "", status: "pending" });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Booking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <Select value={form.userId} onValueChange={(v) => setForm({ ...form, userId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map(u => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(form.hotelId)} onValueChange={(v) => setForm({ ...form, hotelId: Number(v) })}>
              <SelectTrigger>
                <SelectValue placeholder="Select hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotelsAll.map(h => (
                  <SelectItem key={h.id} value={String(h.id)}>{h.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} />
            <Input type="date" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} />
            <Input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as BookingStatus })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button onClick={addBooking}>Add Booking</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Booking Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hotel} onValueChange={(v) => setHotel(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Hotel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All hotels</SelectItem>
                {hotelNames.map(h => (
                  <SelectItem value={h} key={h}>{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            <div />
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="font-medium">{b.userName}</div>
                      <div className="text-xs text-muted-foreground">{b.userEmail}</div>
                    </TableCell>
                    <TableCell>{b.hotelName}</TableCell>
                    <TableCell>{new Date(b.checkIn).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(b.checkOut).toLocaleDateString()}</TableCell>
                    <TableCell className="capitalize">{b.status}</TableCell>
                    <TableCell>₹{b.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleApprove(b.id)} disabled={b.status === "approved"}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleCancel(b.id)} disabled={b.status === "cancelled"}>Cancel</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">No bookings found</TableCell>
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
