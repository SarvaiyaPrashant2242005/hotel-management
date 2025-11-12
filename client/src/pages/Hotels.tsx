import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
import SearchBar from "@/components/SearchBar";
import { hotels } from "@/data/hotels";

const Hotels = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-center mb-6"
          >
            All Hotels
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center text-muted-foreground text-lg mb-8"
          >
            Discover your perfect accommodation
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SearchBar />
          </motion.div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel, index) => (
            <HotelCard key={hotel.id} hotel={hotel} index={index} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Hotels;
