import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaWifi, FaSwimmingPool, FaSpa, FaUtensils, FaArrowLeft } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hotels } from "@/data/hotels";
import { Button } from "@/components/ui/button";

const amenityIcons: Record<string, any> = {
  "WiFi": FaWifi,
  "Pool": FaSwimmingPool,
  "Spa": FaSpa,
  "Restaurant": FaUtensils,
};

const HotelDetail = () => {
  const { id } = useParams();
  const hotel = hotels.find((h) => h.id === Number(id));

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Hotel Not Found</h1>
          <Link to="/hotels">
            <Button>Back to Hotels</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[60vh] mt-16">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link to="/hotels">
              <Button variant="ghost" className="text-white hover:text-white/80 mb-4">
                <FaArrowLeft className="mr-2" />
                Back to Hotels
              </Button>
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4"
            >
              {hotel.name}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 text-white"
            >
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span className="text-lg">{hotel.location}</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
                <FaStar />
                <span className="font-bold">{hotel.rating}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-soft"
            >
              <h2 className="text-3xl font-bold mb-4">About This Hotel</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {hotel.description}
              </p>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-soft"
            >
              <h2 className="text-3xl font-bold mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity, index) => {
                  const Icon = amenityIcons[amenity] || FaWifi;
                  return (
                    <motion.div
                      key={amenity}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl hover:bg-primary/10 transition-colors"
                    >
                      <Icon className="text-primary text-xl" />
                      <span className="font-medium">{amenity}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Room Types */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-soft"
            >
              <h2 className="text-3xl font-bold mb-6">Available Room Types</h2>
              <div className="space-y-4">
                {hotel.roomTypes.map((room, index) => (
                  <motion.div
                    key={room}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-muted/50 rounded-xl border-l-4 border-primary hover:bg-primary/10 transition-colors"
                  >
                    <span className="font-medium text-lg">{room}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-hover sticky top-24"
            >
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-primary mb-2">
                  ${hotel.price}
                </div>
                <div className="text-muted-foreground">per night</div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Guests</label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="2"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                  />
                </div>
              </div>

              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6">
                Book Now
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Free cancellation up to 24 hours before check-in
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
