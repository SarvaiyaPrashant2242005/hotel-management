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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const baseUrl = "http://localhost:5000";

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
  paymentMethod?: string;
  paymentOption?: string;
  advancePayment?: number;
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

  const [showOfflineDialog, setShowOfflineDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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

  const handleMarkOfflinePayment = (booking: Booking) => {
    setSelectedBooking(booking);
    setPaymentMethod("cash");
    setPaymentNotes("");
    setShowOfflineDialog(true);
  };

  const handleConfirmOfflinePayment = async () => {
    if (!selectedBooking) return;

    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/api/bookings/${selectedBooking._id}/mark-payment-offline`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod,
          notes: paymentNotes,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to mark payment");
      }

      const data = await res.json();

      // Update bookings list
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id
            ? { ...b, paymentStatus: "paid", status: "confirmed", paymentMethod }
            : b
        )
      );

      toast({
        title: "Payment Marked",
        description: "Payment has been marked as received successfully.",
      });

      setShowOfflineDialog(false);
      setSelectedBooking(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to mark payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCSV = () => {
    const headers = [
      "Booking ID",
      "Guest Name",
      "Guest Email",
      "Hotel",
      "Room",
      "Check-in",
      "Check-out",
      "Total Amount",
      "Status",
      "Payment Status",
      "Payment Method",
      "Booking Date",
    ];

    const rows = filtered.map((b) => [
      b._id,
      b.user?.fullName || "",
      b.user?.email || "",
      b.hotel?.name || "",
      b.room ? `#${b.room.roomNumber} ${b.room.type}` : "",
      formatDate(b.checkIn),
      formatDate(b.checkOut),
      b.totalPrice,
      b.status,
      b.paymentStatus,
      b.paymentMethod || "razorpay",
      formatDate(b.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Complete",
      description: `Downloaded ${filtered.length} bookings as CSV`,
    });
  };

  const statusColors = {
    confirmed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  const paymentColors = {
    paid: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    pending: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    failed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage all hotel reservations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
        {/* Hotel list (left) */}
        <Card className="h-max shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Filter by Hotel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={hotelId === "all" ? "default" : "outline"}
              className={hotelId === "all" ? "w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600" : "w-full justify-start"}
              onClick={() => setHotelId("all")}
            >
              All Hotels ({filtered.length})
            </Button>
            {hotelList.map((h) => (
              <Button
                key={h.id}
                variant={hotelId === h.id ? "default" : "outline"}
                className={hotelId === h.id ? "w-full flex-col items-start h-auto py-3 bg-gradient-to-r from-blue-600 to-indigo-600" : "w-full flex-col items-start h-auto py-3"}
                onClick={() => setHotelId(h.id)}
              >
                <span className="font-medium">{h.name}</span>
                {h.subtitle && (
                  <span className="text-xs opacity-80">
                    {h.subtitle}
                  </span>
                )}
              </Button>
            ))}
            {hotelList.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hotels found.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Bookings (right) */}
        <div className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">All Bookings</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{filtered.length} bookings found</p>
                </div>
                <Button onClick={downloadCSV} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Loading bookings...</p>
                </div>
              )}

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">✓ Confirmed</SelectItem>
                    <SelectItem value="pending">⏳ Pending</SelectItem>
                    <SelectItem value="cancelled">✗ Cancelled</SelectItem>
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
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="paid">💳 Paid</SelectItem>
                    <SelectItem value="pending">⏳ Pending</SelectItem>
                    <SelectItem value="failed">✗ Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="From date"
                />
                <Input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="To date"
                />
              </div>

              {/* Table */}
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-900">
                        <TableHead className="font-semibold">Guest</TableHead>
                        <TableHead className="font-semibold">Hotel</TableHead>
                        <TableHead className="font-semibold">Room</TableHead>
                        <TableHead className="font-semibold">Check-in</TableHead>
                        <TableHead className="font-semibold">Check-out</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Payment</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((b) => (
                        <TableRow key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                          <TableCell>
                            <div className="font-medium">
                              {b.user?.fullName || "Guest"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {b.user?.email}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{b.hotel?.name}</TableCell>
                          <TableCell>
                            {b.room
                              ? `#${b.room.roomNumber} • ${b.room.type}`
                              : "-"}
                          </TableCell>
                          <TableCell>{formatDate(b.checkIn)}</TableCell>
                          <TableCell>{formatDate(b.checkOut)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[b.status]}`}>
                              {b.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentColors[b.paymentStatus]}`}>
                                {b.paymentStatus}
                              </span>
                              {b.paymentMethod && b.paymentMethod !== "razorpay" && (
                                <div className="text-xs text-muted-foreground">
                                  via {b.paymentMethod}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            <div>₹{b.totalPrice.toLocaleString()}</div>
                            {b.paymentOption === "pay-at-hotel" && b.paymentStatus === "paid" && (
                              <div className="text-xs text-muted-foreground">
                                Advance: ₹{(b.advancePayment || Math.round(b.totalPrice * 0.1)).toLocaleString()}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {b.paymentStatus === "pending" && b.status !== "cancelled" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkOfflinePayment(b)}
                              >
                                <CreditCard className="w-3 h-3 mr-1" />
                                Mark Paid
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filtered.length === 0 && !loading && (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No bookings found matching your filters
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
      </div>

      {/* Offline Payment Dialog */}
      <Dialog open={showOfflineDialog} onOpenChange={setShowOfflineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Payment as Received</DialogTitle>
            <DialogDescription>
              Record offline payment for this booking
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-4">
              {/* Booking Details */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">Booking Details</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guest:</span>
                    <span className="font-medium">{selectedBooking.user?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hotel:</span>
                    <span>{selectedBooking.hotel?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room:</span>
                    <span>
                      {selectedBooking.room
                        ? `#${selectedBooking.room.roomNumber} ${selectedBooking.room.type}`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Amount:</span>
                    <span className="font-bold text-lg">
                      ₹{selectedBooking.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card (POS)</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="offline">Other Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="payment-notes">Notes (Optional)</Label>
                <Textarea
                  id="payment-notes"
                  placeholder="Add any notes about this payment..."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowOfflineDialog(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConfirmOfflinePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Confirm Payment"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}