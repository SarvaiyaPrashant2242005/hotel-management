import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard, { PublicHotel } from "@/components/HotelCard";
import SearchBar, { SearchParams } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const baseUrl = "http://localhost:5000";

const Hotels = () => {
  const [hotels, setHotels] = useState<PublicHotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<PublicHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentSearch, setCurrentSearch] = useState<SearchParams>({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '2')
  });

  // Load all hotels
  const loadHotels = async (searchQuery?: string) => {
    try {
      setLoading(true);
      let url = `${baseUrl}/api/hotels`;
      if (searchQuery) {
        url += `?location=${encodeURIComponent(searchQuery)}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load hotels");
      const data = await res.json();
      const hotelList = Array.isArray(data) ? data : [];
      setHotels(hotelList);
      setFilteredHotels(hotelList);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error loading hotels");
      setHotels([]);
      setFilteredHotels([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search from SearchBar component
  const handleSearch = (newSearchParams: SearchParams) => {
    setCurrentSearch(newSearchParams);
    
    // Update URL parameters
    const params = new URLSearchParams();
    if (newSearchParams.location) params.set('location', newSearchParams.location);
    if (newSearchParams.checkIn) params.set('checkIn', newSearchParams.checkIn);
    if (newSearchParams.checkOut) params.set('checkOut', newSearchParams.checkOut);
    if (newSearchParams.guests) params.set('guests', newSearchParams.guests.toString());
    setSearchParams(params);

    // Filter hotels based on search
    filterHotels(newSearchParams);
    
    // If location search, also fetch from backend
    if (newSearchParams.location) {
      loadHotels(newSearchParams.location);
    }
  };

  // Filter hotels based on search criteria
  const filterHotels = (searchCriteria: SearchParams) => {
    let filtered = [...hotels];

    // Note: Date and guest filtering would typically be done with room availability
    // For now, we'll just filter by location on the frontend as well
    if (searchCriteria.location) {
      const locationLower = searchCriteria.location.toLowerCase();
      filtered = filtered.filter(hotel => 
        hotel.name.toLowerCase().includes(locationLower) ||
        hotel.city.toLowerCase().includes(locationLower) ||
        hotel.state.toLowerCase().includes(locationLower) ||
        hotel.country.toLowerCase().includes(locationLower) ||
        hotel.address.toLowerCase().includes(locationLower)
      );
    }

    setFilteredHotels(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    const emptySearch = { location: '', checkIn: '', checkOut: '', guests: 2 };
    setCurrentSearch(emptySearch);
    setSearchParams(new URLSearchParams());
    setFilteredHotels(hotels);
  };

  // Load hotels on component mount and when URL params change
  useEffect(() => {
    const location = searchParams.get('location');
    if (location) {
      loadHotels(location);
    } else {
      loadHotels();
    }
  }, []);

  // Update filtered hotels when hotels change
  useEffect(() => {
    if (currentSearch.location || currentSearch.checkIn || currentSearch.checkOut) {
      filterHotels(currentSearch);
    } else {
      setFilteredHotels(hotels);
    }
  }, [hotels, currentSearch]);

  const hasActiveFilters = currentSearch.location || currentSearch.checkIn || currentSearch.checkOut;

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
            <SearchBar onSearch={handleSearch} showResults={true} />
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-12">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              {loading ? "Searching..." : `${filteredHotels.length} hotel${filteredHotels.length !== 1 ? 's' : ''} found`}
            </h2>
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Filters:</span>
                {currentSearch.location && (
                  <Badge variant="secondary">📍 {currentSearch.location}</Badge>
                )}
                {currentSearch.checkIn && (
                  <Badge variant="secondary">📅 {new Date(currentSearch.checkIn).toLocaleDateString()}</Badge>
                )}
                {currentSearch.checkOut && (
                  <Badge variant="secondary">📅 {new Date(currentSearch.checkOut).toLocaleDateString()}</Badge>
                )}
                <Badge variant="secondary">👥 {currentSearch.guests} guest{currentSearch.guests > 1 ? 's' : ''}</Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-muted-foreground py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            Loading hotels...
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center text-red-500 py-8">{error}</div>
        )}

        {/* No Results */}
        {!loading && !error && filteredHotels.length === 0 && hotels.length > 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              No hotels match your search criteria
            </div>
            <Button onClick={clearFilters} variant="outline">
              Clear filters to see all hotels
            </Button>
          </div>
        )}

        {/* No Hotels Available */}
        {!loading && !error && hotels.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No hotels available.
          </div>
        )}

        {/* Hotels Grid */}
        {!loading && !error && filteredHotels.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredHotels.map((hotel, index) => (
              <HotelCard key={hotel._id} hotel={hotel} index={index} />
            ))}
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Hotels;