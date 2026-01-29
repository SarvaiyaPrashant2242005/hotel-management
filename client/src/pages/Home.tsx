import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar, { SearchParams } from "@/components/SearchBar";
import HotelCard, { PublicHotel } from "@/components/HotelCard";
import FeaturedSlider from "@/components/FeaturedSlider";

const baseUrl = "https://hotel-management-plc3.onrender.com";

const Home = () => {
  const [hotels, setHotels] = useState<PublicHotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<PublicHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/hotels`);
        if (!res.ok) throw new Error("Failed to load hotels");
        const data = await res.json();
        const hotelList = Array.isArray(data) ? data : [];
        setHotels(hotelList);
        setFilteredHotels(hotelList);
      } catch {
        setHotels([]);
        setFilteredHotels([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = async (searchParams: SearchParams) => {
    setSearchActive(true);
    
    try {
      let url = `${baseUrl}/api/hotels`;
      if (searchParams.location) {
        url += `?location=${encodeURIComponent(searchParams.location)}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to search hotels");
      const data = await res.json();
      const searchResults = Array.isArray(data) ? data : [];
      setFilteredHotels(searchResults);
    } catch {
      setFilteredHotels([]);
    }
  };

  const clearSearch = () => {
    setSearchActive(false);
    setFilteredHotels(hotels);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop"
            alt="Luxury Hotel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Find Your Perfect Stay
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/90 mb-4 max-w-2xl mx-auto"
          >
            Discover amazing hotels worldwide and create unforgettable memories
          </motion.p>

          {(() => {
            try {
              const raw = localStorage.getItem("user");
              const user = raw ? JSON.parse(raw) : null;
              return user?.fullName ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="text-lg md:text-xl text-white/90 mb-8"
                >
                  Welcome, {user.fullName}
                </motion.div>
              ) : null;
            } catch {
              return null;
            }
          })()}

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Search Results Section (shown when search is active) */}
      {searchActive && (
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                Search Results ({filteredHotels.length})
              </h2>
              <button
                onClick={clearSearch}
                className="text-primary hover:text-primary/80 underline"
              >
                Clear Search
              </button>
            </div>

            {filteredHotels.length === 0 ? (
              <p className="text-center text-muted-foreground text-lg">
                No hotels found matching your search criteria.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHotels.map((hotel, index) => (
                  <HotelCard key={hotel._id} hotel={hotel} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* Featured Hotels Slider (hidden when search is active) */}
      {!searchActive && (
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Featured Hotels
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Handpicked luxury accommodations just for you
            </p>
            {!loading && hotels.length > 0 && (
              <FeaturedSlider hotels={hotels} />
            )}
            {!loading && hotels.length === 0 && (
              <p className="text-center text-muted-foreground">
                No featured hotels available yet.
              </p>
            )}
          </motion.div>
        </section>
      )}

      {/* All Hotels Grid (hidden when search is active) */}
      {!searchActive && (
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Explore All Hotels
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Browse our collection of stunning properties
            </p>

            {loading && (
              <div className="text-center text-muted-foreground">
                Loading hotels...
              </div>
            )}

            {!loading && hotels.length === 0 && (
              <div className="text-center text-muted-foreground">
                No hotels available.
              </div>
            )}

            {!loading && hotels.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotels.map((hotel, index) => (
                  <HotelCard key={hotel._id} hotel={hotel} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* Stats Section (hidden when search is active) */}
      {!searchActive && (
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "500+", label: "Hotels Worldwide" },
                { number: "10K+", label: "Happy Guests" },
                { number: "50+", label: "Countries" },
                { number: "4.9", label: "Average Rating" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className="text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-primary-foreground/80 text-lg">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Home;