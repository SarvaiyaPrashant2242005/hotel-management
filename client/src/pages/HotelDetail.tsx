import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const baseUrl = "https://hotel-management-plc3.onrender.com";

// allow window.Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

type PublicHotel = {
  _id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contactNumber: string;
  images?: string[];
};

type RoomStatus = "available" | "occupied" | "maintenance";

type Room = {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  isAvailable: boolean;
  title?: string;
  sizeSqft?: number;
  view?: string;
  bedType?: string;
  bathrooms?: number;
  amenities?: string[];
  mealPlan?: string;
  taxesAndFees?: number;
  strikePrice?: number;
  dealText?: string;
  images?: string[];
};

const HotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState<PublicHotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // booking/payment state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [hotelRes, roomsRes] = await Promise.all([
          fetch(`${baseUrl}/api/hotels/${id}`),
          fetch(`${baseUrl}/api/rooms/hotel/${id}`),
        ]);

        if (!hotelRes.ok) throw new Error("Failed to load hotel");
        if (!roomsRes.ok) throw new Error("Failed to load rooms");

        const hotelData = await hotelRes.json();
        const roomsData = await roomsRes.json();

        setHotel(hotelData as PublicHotel);

        // API returns: { count, rooms: Room[] }
        const extractedRooms = Array.isArray(roomsData)
          ? roomsData
          : Array.isArray(roomsData.rooms)
          ? roomsData.rooms
          : [];

        setRooms(extractedRooms);
      } catch (err: any) {
        setError(err.message || "Error loading hotel or rooms");
        setHotel(null);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

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

  const getNights = (start: string, end: string) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = d2.getTime() - d1.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const handleBookRoom = async (room: Room) => {
    try {
      if (!hotel) return;

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const rawUser =
        typeof window !== "undefined"
          ? localStorage.getItem("user")
          : null;

      if (!token) {
        const redirect = encodeURIComponent(window.location.pathname + window.location.search);
        return navigate(`/login?redirect=${redirect}`, { replace: true });
      }

      const user = rawUser ? JSON.parse(rawUser) : null;

      if (!checkIn || !checkOut) {
        alert("Please select check-in and check-out dates.");
        return;
      }

      const nights = getNights(checkIn, checkOut);
      if (nights <= 0) {
        alert("Check-out date must be after check-in date.");
        return;
      }

      const basePerNight = room.price + (room.taxesAndFees || 0);
      const totalPrice = basePerNight * nights;

      setActiveRoomId(room._id);

      // 1) Create booking
      const bookingRes = await fetch(`${baseUrl}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotelId: hotel._id,
          roomId: room._id,
          checkIn,
          checkOut,
          totalPrice,
        }),
      });

      if (!bookingRes.ok) {
        const err = await bookingRes.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to create booking");
      }

      const bookingData = await bookingRes.json();
      const bookingId = bookingData?.booking?._id || bookingData?._id;

      if (!bookingId) {
        throw new Error("Booking ID missing from response");
      }

      // 2) Create Razorpay order
      const orderRes = await fetch(`${baseUrl}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to create payment order");
      }

      const orderData = await orderRes.json();
      await loadRazorpayScript();

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: hotel.name,
        description: `Booking for room ${room.roomNumber}`,
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
                bookingId,
              }),
            });

            if (!verifyRes.ok) {
              const err = await verifyRes.json().catch(() => ({}));
              alert(err?.message || "Payment verification failed");
              return;
            }

            alert("Payment successful! Your booking is confirmed.");
          } catch (err: any) {
            alert(err?.message || "Payment verification failed");
          } finally {
            setActiveRoomId(null);
          }
        },
        modal: {
          ondismiss: () => {
            setActiveRoomId(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to start payment");
      setActiveRoomId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading hotel and rooms...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-3">Hotel Not Found</h1>
            {error && (
              <p className="text-red-500 mb-3 text-sm">{error}</p>
            )}
            <Link to="/hotels">
              <Button>Back to Hotels</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const image =
    hotel.images && hotel.images[0]
      ? hotel.images[0]
      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop";

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[40vh] mt-16">
        <img
          src={image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <Link to="/hotels">
              <Button variant="ghost" className="text-white hover:text-white/80 mb-4">
                Back to Hotels
              </Button>
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-2"
            >
              {hotel.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/90 text-lg"
            >
              {hotel.city}, {hotel.state}, {hotel.country}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Hotel info + rooms */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          {/* Rooms list */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <h2 className="text-3xl font-bold mb-2">Available Rooms</h2>
              <p className="text-muted-foreground">
                Choose a room type that suits your stay.
              </p>
            </motion.div>

            {rooms.length === 0 && (
              <div className="text-muted-foreground text-center py-8">
                No rooms available for this hotel yet.
              </div>
            )}

            {rooms.map((r) => {
              const status: RoomStatus = r.isAvailable
                ? "available"
                : "occupied";

              return (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-xl shadow-soft p-6 border"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      {r.images && r.images.length > 0 && (
                        <div className="mb-2">
                          <div className="flex gap-2 overflow-x-auto">
                            {r.images.map((src, idx) => {
                              const url = src.startsWith("http")
                                ? src
                                : `${baseUrl}${src}`;
                              return (
                                <img
                                  key={idx}
                                  src={url}
                                  alt={`Room image ${idx + 1}`}
                                  className="h-24 w-32 object-cover rounded border"
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        ROOM TYPE
                      </p>
                      <p className="font-semibold mt-1 text-lg">
                        {r.title || r.type}
                      </p>
                      {r.mealPlan && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {r.mealPlan}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Room {r.roomNumber} • Capacity: {r.capacity} guest
                        {r.capacity > 1 ? "s" : ""}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs mt-2 text-muted-foreground">
                        {r.sizeSqft && <span>{r.sizeSqft} sq.ft</span>}
                        {r.view && <span>{r.view}</span>}
                        {r.bedType && <span>{r.bedType}</span>}
                        {typeof r.bathrooms === "number" && (
                          <span>{r.bathrooms} bathroom(s)</span>
                        )}
                      </div>
                      {r.amenities && r.amenities.length > 0 && (
                        <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-1 text-xs list-disc list-inside text-muted-foreground">
                          {r.amenities.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {typeof r.strikePrice === "number" && (
                        <p className="text-xs line-through text-muted-foreground">
                          ₹{r.strikePrice}
                        </p>
                      )}
                      <p className="text-2xl font-bold">
                        ₹{r.price}
                      </p>
                      {typeof r.taxesAndFees === "number" && (
                        <p className="text-xs text-muted-foreground">
                          + ₹{r.taxesAndFees} taxes &amp; fees per night
                        </p>
                      )}
                      {r.dealText && (
                        <p className="text-xs text-green-700 font-medium self-start bg-green-50 px-2 py-1 rounded">
                          {r.dealText}
                        </p>
                      )}
                      <Button
                        className="mt-1"
                        disabled={!r.isAvailable || activeRoomId === r._id}
                        onClick={() => handleBookRoom(r)}
                      >
                        {activeRoomId === r._id ? "Processing..." : "Book Now"}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Status:{" "}
                        <span className="capitalize">{status}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Hotel info + booking inputs */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl shadow-soft p-6"
            >
              <h3 className="text-xl font-semibold mb-2">Hotel Info</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {hotel.description}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Address: </span>
                {hotel.address}, {hotel.city}, {hotel.state},{" "}
                {hotel.country}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <span className="font-medium">Contact: </span>
                {hotel.contactNumber}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl shadow-soft p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold">Booking Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value) || 1)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Select dates and guests, then choose a room and click{" "}
                <span className="font-medium">Book Now</span>.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HotelDetail;