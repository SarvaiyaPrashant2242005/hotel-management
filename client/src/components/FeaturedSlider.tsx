import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { hotels } from "@/data/hotels";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const FeaturedSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredHotels = hotels.filter((hotel) => hotel.featured);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredHotels.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredHotels.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredHotels.length) % featuredHotels.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredHotels.length);
  };

  if (featuredHotels.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl h-[500px] shadow-hover">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full"
        >
          {/* Background Image */}
          <img
            src={featuredHotels[currentIndex].image}
            alt={featuredHotels[currentIndex].name}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-secondary text-secondary-foreground px-4 py-1 rounded-full font-semibold text-sm">
                  Featured
                </span>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <FaStar className="text-secondary" />
                  <span className="text-white font-semibold">
                    {featuredHotels[currentIndex].rating}
                  </span>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {featuredHotels[currentIndex].name}
              </h2>

              <p className="text-white/90 text-lg mb-2">
                {featuredHotels[currentIndex].location}
              </p>

              <p className="text-white/80 mb-6 line-clamp-2">
                {featuredHotels[currentIndex].description}
              </p>

              <div className="flex items-center gap-4">
                <div className="text-white">
                  <span className="text-4xl font-bold">
                    ${featuredHotels[currentIndex].price}
                  </span>
                  <span className="text-white/80 ml-2">/night</span>
                </div>
                <Link to={`/hotel/${featuredHotels[currentIndex].id}`}>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Book Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all"
      >
        <FaChevronRight />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredHotels.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSlider;
