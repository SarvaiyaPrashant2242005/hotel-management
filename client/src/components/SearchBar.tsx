import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch } from "react-icons/fa";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SearchBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="bg-card rounded-2xl shadow-hover p-6 max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-foreground mb-2">
            Location
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <Input
              type="text"
              placeholder="Where are you going?"
              className="pl-10 border-border bg-background"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="relative">
          <label className="block text-sm font-medium text-foreground mb-2">
            Check-in
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <Input
              type="date"
              className="pl-10 border-border bg-background"
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="relative">
          <label className="block text-sm font-medium text-foreground mb-2">
            Check-out
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <Input
              type="date"
              className="pl-10 border-border bg-background"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="relative">
          <label className="block text-sm font-medium text-foreground mb-2">
            Guests
          </label>
          <div className="relative">
            <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <Input
              type="number"
              placeholder="2"
              min="1"
              className="pl-10 border-border bg-background"
            />
          </div>
        </div>
      </div>

      {/* Search Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6"
      >
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 gap-2">
          <FaSearch />
          Search Hotels
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SearchBar;
