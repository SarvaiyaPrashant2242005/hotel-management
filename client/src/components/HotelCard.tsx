import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export type PublicHotel = {
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

interface HotelCardProps {
  hotel: PublicHotel;
  index: number;
}

const HotelCard = ({ hotel, index }: HotelCardProps) => {
  const image =
    hotel.images && hotel.images[0]
      ? hotel.images[0]
      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <FaMapMarkerAlt className="text-primary" />
          <span className="text-sm">
            {hotel.city}, {hotel.state}, {hotel.country}
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {hotel.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {hotel.address}
          </div>
          <Link to={`/hotel/${hotel._id}`}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              View Rooms
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;