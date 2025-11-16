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

const baseUrl = "https://hotel-management-plc3.onrender.com";

type Hotel = {
  _id: string;
  name: string;
  city?: string;
  state?: string;
};

type Booking = {
  _id: string;
  hotel: { _id: string; name: string };
  user: { fullName: string; email: string };
  room?: { roomNumber: string; type: string };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
};

export default function BookingsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [hotelId, setHotelId] = useState<string>("all");
  const [status, setStatus] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [paymentStatus, setPaymentStatus] = useState<
    "all" | "pending" | "paid" | "failed"
  >("all");
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
          setBookings([]);
          setHotels([]);
          setLoading(false);
          return;
        }

        const [hotelsRes, bookingsRes] = await Promise.all([
          fetch(`${baseUrl}/api/hotels`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${baseUrl}/api/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const hotelsData = hotelsRes.ok ? await hotelsRes.json() : [];
        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];

        setHotels(Array.isArray(hotelsData) ? hotelsData : []);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch {
        setHotels([]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const hotelList = useMemo(() => {
    return hotels.map((h) => ({
      id: h._id,
      name: h.name,
      subtitle:
        h.city && h.state ? `${h.city}, ${h.state}` : h.city || h.state || "",
    }));
  }, [hotels]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchHotel = hotelId === "all" || b.hotel?._id === hotelId;
      const matchStatus = status === "all" || b.status === status;
      const matchPay =
        paymentStatus === "all" || b.paymentStatus === paymentStatus;

      const ci = new Date(b.checkIn).getTime();
      const fromOk = !from || ci >= new Date(from).getTime();
      const toOk = !to || ci <= new Date(to).getTime();

      return matchHotel && matchStatus && matchPay && fromOk && toOk;
    });
  }, [bookings, hotelId, status, paymentStatus, from, to]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">
      {/* Hotel list (left) */}
      <Card className="h-max">
        <CardHeader>
          <CardTitle>Hotels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={hotelId === "all" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setHotelId("all")}
          >
            All hotels
          </Button>
          {hotelList.map((h) => (
            <Button
              key={h.id}
              variant={hotelId === h.id ? "default" : "outline"}
              className="w-full flex-col items-start"
              onClick={() => setHotelId(h.id)}
            >
              <span className="font-medium">{h.name}</span>
              {h.subtitle && (
                <span className="text-xs text-muted-foreground">
                  {h.subtitle}
                </span>
              )}
            </Button>
          ))}
          {hotelList.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground">
              No hotels found.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Bookings (right) */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
              <p className="text-sm text-muted-foreground">
                Loading bookings...
              </p>
            )}

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={paymentStatus}
                onValueChange={(v) => setPaymentStatus(v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
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

            {/* Table */}
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((b) => (
  <TableRow key={b._id}>
    <TableCell>
      <div className="font-medium">
        {b.user?.fullName || "Guest"}
      </div>
      <div className="text-xs text-muted-foreground">
        {b.user?.email}
      </div>
    </TableCell>
    <TableCell>{b.hotel?.name}</TableCell>
    <TableCell>
      {b.room
        ? `#${b.room.roomNumber} • ${b.room.type}`
        : "-"}
    </TableCell>
    <TableCell>{formatDate(b.checkIn)}</TableCell>
    <TableCell>{formatDate(b.checkOut)}</TableCell>
    <TableCell className="capitalize">
      {b.status}
    </TableCell>
    <TableCell className="capitalize">
      {b.paymentStatus}
    </TableCell>
    <TableCell>₹{b.totalPrice}</TableCell>
  </TableRow>   // ✅ correct closing
))}
          
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}