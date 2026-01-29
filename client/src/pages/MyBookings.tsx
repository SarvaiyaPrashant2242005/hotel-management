import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CancelBookingDialog from "@/components/CancelBookingDialog";
import PaymentOptionsDialog from "@/components/PaymentOptionsDialog";
import { useToast } from "@/hooks/use-toast";

const baseUrl = "http://localhost:5000";

// allow window.Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  paymentOption?: string;
  advancePayment?: number;
  createdAt: string;
};

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [bookingForPayment, setBookingForPayment] = useState<Booking | null>(null);
  const { toast } = useToast();

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

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = async (bookingId: string, reason: string) => {
    try {
      setIsCancelling(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast({
          title: "Error",
          description: "Please login to cancel booking",
          variant: "destructive",
        });
        return;
      }

      const res = await fetch(`${baseUrl}/api/bookings/${bookingId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to cancel booking");
      }

      const data = await res.json();

      // Update bookings list
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );

      toast({
        title: "Booking Cancelled",
        description: data.message || "Your booking has been cancelled successfully.",
      });

      setShowCancelDialog(false);
      setSelectedBooking(null);
    } catch (err: any) {
      toast({
        title: "Cancellation Failed",
        description: err.message || "Failed to cancel booking",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancelBooking = (booking: Booking) => {
    // Can cancel if status is pending or confirmed (not already cancelled)
    return booking.status !== "cancelled";
  };

  const loadRazorpayScript = () =>
    new Promise<void>((resolve, reject) => {
      if (document.getElementById("razorpay-checkout-js")) {
        return resolve();
      }
      const script = document.createElement("script");
      script.id = "razorpay-checkout-js";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay"));
      document.body.appendChild(script);
    });

  const getNights = (checkIn: string, checkOut: string) => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = d2.getTime() - d1.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const handleCompletePaymentClick = (booking: Booking) => {
    setBookingForPayment(booking);
    setShowPaymentDialog(true);
  };

  const handlePaymentOptionConfirm = async (paymentOption: "pay-now" | "pay-at-hotel") => {
    if (!bookingForPayment) return;

    try {
      setIsProcessingPayment(true);
      setProcessingBookingId(bookingForPayment._id);

      const token = localStorage.getItem("token");
      const rawUser = localStorage.getItem("user");
      const user = rawUser ? JSON.parse(rawUser) : null;

      if (!token) {
        toast({
          title: "Error",
          description: "Please login to complete payment",
          variant: "destructive",
        });
        return;
      }

      // Update booking with new payment option if different
      if (bookingForPayment.paymentOption !== paymentOption) {
        const updateRes = await fetch(`${baseUrl}/api/bookings/${bookingForPayment._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentOption,
            advancePayment: paymentOption === "pay-at-hotel" 
              ? Math.round(bookingForPayment.totalPrice * 0.1) 
              : bookingForPayment.totalPrice,
          }),
        });

        if (!updateRes.ok) {
          console.warn("Failed to update payment option, continuing with original");
        }
      }

      // Determine payment amount based on payment option
      const paymentAmount = paymentOption === "pay-now" 
        ? bookingForPayment.totalPrice 
        : Math.round(bookingForPayment.totalPrice * 0.1);

      // Create Razorpay order
      const orderRes = await fetch(`${baseUrl}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          bookingId: bookingForPayment._id,
          amount: paymentAmount,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to create payment order");
      }

      const orderData = await orderRes.json();
      await loadRazorpayScript();

      const paymentDescription = paymentOption === "pay-now"
        ? `Full payment for booking`
        : `Advance payment (10%) for booking`;

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: bookingForPayment.hotel?.name || "Hotel Booking",
        description: paymentDescription,
        order_id: orderData.orderId,
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
          contact: user?.contactNo || "",
        },
        theme: {
          color: "#14b8a6",
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${baseUrl}/api/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookingForPayment._id,
              }),
            });

            if (!verifyRes.ok) {
              const err = await verifyRes.json().catch(() => ({}));
              throw new Error(err?.message || "Payment verification failed");
            }

            // Update booking in the list
            setBookings((prev) =>
              prev.map((b) =>
                b._id === bookingForPayment._id 
                  ? { ...b, status: "confirmed", paymentStatus: "paid", paymentOption } 
                  : b
              )
            );

            const successMessage = paymentOption === "pay-now"
              ? "Payment successful! Your booking is confirmed."
              : `Advance payment successful! You've paid ₹${paymentAmount.toLocaleString()} (10%). Remaining ₹${(bookingForPayment.totalPrice - paymentAmount).toLocaleString()} to be paid at hotel.`;
            
            toast({
              title: "Payment Successful",
              description: successMessage,
            });

            setShowPaymentDialog(false);
            setBookingForPayment(null);
          } catch (err: any) {
            toast({
              title: "Payment Verification Failed",
              description: err.message || "Payment verification failed",
              variant: "destructive",
            });
          } finally {
            setIsProcessingPayment(false);
            setProcessingBookingId(null);
          }
        },
        modal: {
          ondismiss: () => {
            toast({
              title: "Payment Cancelled",
              description: "You can complete payment anytime from this page.",
            });
            setIsProcessingPayment(false);
            setProcessingBookingId(null);
            setShowPaymentDialog(false);
            setBookingForPayment(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Payment Failed",
        description: err.message || "Failed to start payment",
        variant: "destructive",
      });
      setIsProcessingPayment(false);
      setProcessingBookingId(null);
    }
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
                  <p className="text-xl font-bold">₹{b.totalPrice.toLocaleString()}</p>
                  {b.paymentOption === "pay-at-hotel" && b.paymentStatus === "paid" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Paid: ₹{(b.advancePayment || Math.round(b.totalPrice * 0.1)).toLocaleString()} (10%)
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      b.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : b.status === "cancelled"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}
                  >
                    {b.status === "confirmed" ? "✓ Confirmed" : b.status === "cancelled" ? "✗ Cancelled" : "⏳ Pending"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      b.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : b.paymentStatus === "failed"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}
                  >
                    Payment: {b.paymentStatus}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Booked on {formatDate(b.createdAt)}
                </p>
                <div className="flex gap-2">
                  {b.status === "pending" && b.paymentStatus === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleCompletePaymentClick(b)}
                      disabled={isProcessingPayment && processingBookingId === b._id}
                    >
                      Complete Payment
                    </Button>
                  )}
                  {canCancelBooking(b) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelClick(b)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Cancel Booking Dialog */}
      {selectedBooking && (
        <CancelBookingDialog
          open={showCancelDialog}
          onOpenChange={(open) => {
            setShowCancelDialog(open);
            if (!open) setSelectedBooking(null);
          }}
          booking={selectedBooking}
          onConfirm={handleCancelConfirm}
          isProcessing={isCancelling}
        />
      )}

      {/* Payment Options Dialog */}
      {bookingForPayment && (
        <PaymentOptionsDialog
          open={showPaymentDialog}
          onOpenChange={(open) => {
            setShowPaymentDialog(open);
            if (!open) {
              setBookingForPayment(null);
              setProcessingBookingId(null);
            }
          }}
          roomDetails={{
            roomNumber: bookingForPayment.room?.roomNumber || "N/A",
            type: bookingForPayment.room?.type || "Room",
            pricePerNight: Math.round(bookingForPayment.totalPrice / getNights(bookingForPayment.checkIn, bookingForPayment.checkOut)),
            nights: getNights(bookingForPayment.checkIn, bookingForPayment.checkOut),
            totalPrice: bookingForPayment.totalPrice,
          }}
          onConfirm={handlePaymentOptionConfirm}
          isProcessing={isProcessingPayment}
        />
      )}
    </div>
  );
};

export default MyBookings;