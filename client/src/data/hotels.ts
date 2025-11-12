export interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  amenities: string[];
  roomTypes: string[];
  featured?: boolean;
}

export const hotels: Hotel[] = [
  {
    id: 1,
    name: "Luxury Paradise Resort",
    location: "Maldives",
    price: 450,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    description: "Experience paradise in our overwater villas with stunning ocean views and world-class amenities.",
    amenities: ["Pool", "Spa", "Restaurant", "WiFi", "Beach Access", "Room Service"],
    roomTypes: ["Overwater Villa", "Beach Villa", "Garden Suite"],
    featured: true
  },
  {
    id: 2,
    name: "Mountain View Lodge",
    location: "Swiss Alps, Switzerland",
    price: 320,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
    description: "Cozy alpine retreat with breathtaking mountain views and premium ski-in ski-out access.",
    amenities: ["Spa", "Restaurant", "WiFi", "Ski Access", "Fireplace", "Bar"],
    roomTypes: ["Mountain Suite", "Alpine Cabin", "Deluxe Room"],
    featured: true
  },
  {
    id: 3,
    name: "Urban Boutique Hotel",
    location: "New York, USA",
    price: 280,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    description: "Modern luxury in the heart of Manhattan with rooftop bar and city skyline views.",
    amenities: ["Gym", "Restaurant", "WiFi", "Rooftop Bar", "Concierge", "Parking"],
    roomTypes: ["City View Suite", "Executive Room", "Penthouse"],
    featured: false
  },
  {
    id: 4,
    name: "Coastal Beach Resort",
    location: "Bali, Indonesia",
    price: 195,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
    description: "Tropical paradise with pristine beaches, infinity pools, and authentic Balinese hospitality.",
    amenities: ["Pool", "Spa", "Restaurant", "WiFi", "Beach Access", "Yoga Studio"],
    roomTypes: ["Beach Bungalow", "Pool Villa", "Ocean View Room"],
    featured: true
  },
  {
    id: 5,
    name: "Historic Palace Hotel",
    location: "Paris, France",
    price: 380,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
    description: "Experience Parisian elegance in a restored 18th-century palace near the Louvre.",
    amenities: ["Restaurant", "Bar", "WiFi", "Concierge", "Room Service", "Library"],
    roomTypes: ["Royal Suite", "Historic Room", "Garden View"],
    featured: false
  },
  {
    id: 6,
    name: "Desert Oasis Resort",
    location: "Dubai, UAE",
    price: 410,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop",
    description: "Luxury desert retreat featuring private pools, fine dining, and unforgettable sunsets.",
    amenities: ["Pool", "Spa", "Restaurant", "WiFi", "Desert Safari", "Fine Dining"],
    roomTypes: ["Desert Villa", "Oasis Suite", "Royal Tent"],
    featured: false
  },
  {
    id: 7,
    name: "Rainforest Eco Lodge",
    location: "Costa Rica",
    price: 220,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    description: "Sustainable luxury immersed in pristine rainforest with exotic wildlife and waterfalls.",
    amenities: ["Restaurant", "WiFi", "Nature Tours", "Spa", "Wildlife Viewing", "Hiking"],
    roomTypes: ["Treehouse Suite", "Canopy Room", "Jungle Villa"],
    featured: true
  },
  {
    id: 8,
    name: "Lakeside Retreat",
    location: "Lake Como, Italy",
    price: 340,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    description: "Romantic Italian villa with private lake access, gourmet dining, and stunning Alpine backdrop.",
    amenities: ["Restaurant", "WiFi", "Lake Access", "Spa", "Boat Rental", "Garden"],
    roomTypes: ["Lake View Suite", "Villa Room", "Garden Suite"],
    featured: false
  }
];
