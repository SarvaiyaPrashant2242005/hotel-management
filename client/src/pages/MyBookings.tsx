import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const baseUrl = "https://hotel-management-plc3.onrender.com";

type Booking = {
  _id: string;
  hotel?: {
    name: string;
    city?: string;
    state?: string;
    country?: string;
  };
  room?: {
    roomNumber: string;
    type: string;
    price?: number;
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;
        if (!token) {
          setError("Please login to view your bookings.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${baseUrl}/api/bookings/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || "Failed to load bookings");
        }
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Error loading bookings");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString();
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-12 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-2 text-center"
          >
            My Bookings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center text-muted-foreground max-w-2xl mx-auto"
          >
            View all your hotel bookings and their payment status.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {loading && (
          <p className="text-center text-muted-foreground">
            Loading bookings...
          </p>
        )}
        {error && !loading && (
          <p className="text-center text-red-500">{error}</p>
        )}
        {!loading && !error && bookings.length === 0 && (
          <p className="text-center text-muted-foreground">
            You have no bookings yet.
          </p>
        )}

        <div className="space-y-4">
          {bookings.map((b) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl border shadow-soft p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  {b.hotel?.name || "Hotel"}
                </p>
                <p className="text-lg font-semibold">
                  {b.hotel?.city && b.hotel?.state
                    ? `${b.hotel.city}, ${b.hotel.state}`
                    : ""}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Room {b.room?.roomNumber || ""} • {b.room?.type || "Room"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Check-in: {formatDate(b.checkIn)} • Check-out:{" "}
                  {formatDate(b.checkOut)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Total Amount
                  </p>
                  <p className="text-xl font-bold">₹{b.totalPrice}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    Booking: {b.status}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      b.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : b.paymentStatus === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    Payment: {b.paymentStatus}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Booked on {formatDate(b.createdAt)}
                </p>
                <Button variant="outline" size="sm" disabled>
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MyBookings;