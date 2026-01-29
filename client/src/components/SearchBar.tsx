import { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch } from "react-icons/fa";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface SearchBarProps {
  onSearch?: (searchParams: SearchParams) => void;
  showResults?: boolean;
}

export interface SearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

const SearchBar = ({ onSearch, showResults = false }: SearchBarProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
  });

  const handleInputChange = (field: keyof SearchParams, value: string | number) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateDates = () => {
    if (!searchParams.checkIn || !searchParams.checkOut) {
      return true; // Allow empty dates
    }

    const checkInDate = new Date(searchParams.checkIn);
    const checkOutDate = new Date(searchParams.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      toast({
        title: "Invalid Date",
        description: "Check-in date cannot be in the past",
        variant: "destructive"
      });
      return false;
    }

    if (checkOutDate <= checkInDate) {
      toast({
        title: "Invalid Date",
        description: "Check-out date must be after check-in date",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSearch = () => {
    if (!validateDates()) {
      return;
    }

    if (searchParams.guests < 1) {
      toast({
        title: "Invalid Guest Count",
        description: "Number of guests must be at least 1",
        variant: "destructive"
      });
      return;
    }

    // If onSearch prop is provided, use it (for filtering on current page)
    if (onSearch) {
      onSearch(searchParams);
    } else {
      // Otherwise, navigate to hotels page with search params
      const params = new URLSearchParams();
      if (searchParams.location) params.set('location', searchParams.location);
      if (searchParams.checkIn) params.set('checkIn', searchParams.checkIn);
      if (searchParams.checkOut) params.set('checkOut', searchParams.checkOut);
      if (searchParams.guests) params.set('guests', searchParams.guests.toString());
      
      navigate(`/hotels?${params.toString()}`);
    }

    toast({
      title: "Searching Hotels",
      description: `Looking for hotels${searchParams.location ? ` in ${searchParams.location}` : ''}...`
    });
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="bg-card rounded-2xl shadow-hover p-6 max-w-5xl mx-auto border"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-foreground mb-2">
            Location
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-primary z-10" />
            <Input
              type="text"
              placeholder="City, hotel name..."
              value={searchParams.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="pl-10 border-border bg-background focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="relative">
          <label className="block text-sm font-medium text-foreground mb-2">
            Check-in
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-primary z-10" />
            <Input
              type="date"
              value={searchParams.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              min={getTodayDate()}
              className="pl-10 border-border bg-background focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="relative">
          <label className="block text-sm font-medium text-foreground mb-2">
            Check-out
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-primary z-10" />
            <Input
              type="date"
              value={searchParams.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              min={searchParams.checkIn || getTomorrowDate()}
              className="pl-10 border-border bg-background focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="relative">
          <label className="block text-sm font-medium text-foreground mb-2">
            Guests
          </label>
          <div className="relative">
            <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-primary z-10" />
            <Input
              type="number"
              placeholder="2"
              min="1"
              max="20"
              value={searchParams.guests}
              onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 1)}
              className="pl-10 border-border bg-background focus:ring-2 focus:ring-primary/20"
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
        <Button 
          onClick={handleSearch}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 gap-2 transition-all duration-200"
        >
          <FaSearch />
          {showResults ? "Update Search" : "Search Hotels"}
        </Button>
      </motion.div>

      {/* Search Summary */}
      {(searchParams.location || searchParams.checkIn || searchParams.checkOut) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground"
        >
          <div className="flex flex-wrap gap-2">
            {searchParams.location && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                📍 {searchParams.location}
              </span>
            )}
            {searchParams.checkIn && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                📅 {new Date(searchParams.checkIn).toLocaleDateString()}
              </span>
            )}
            {searchParams.checkOut && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                📅 {new Date(searchParams.checkOut).toLocaleDateString()}
              </span>
            )}
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">
              👥 {searchParams.guests} guest{searchParams.guests > 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchBar;
