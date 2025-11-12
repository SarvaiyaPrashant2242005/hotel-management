import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Hotel } from "@/data/hotels";
import { Button } from "./ui/button";

interface HotelCardProps {
  hotel: Hotel;
  index: number;
}

const HotelCard = ({ hotel, index }: HotelCardProps) => {
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
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {hotel.featured && (
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="absolute top-4 left-0 bg-secondary text-secondary-foreground px-4 py-1 font-semibold text-sm"
          >
            Featured
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 bg-secondary/20 px-2 py-1 rounded-lg">
            <FaStar className="text-secondary text-sm" />
            <span className="font-semibold text-sm">{hotel.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <FaMapMarkerAlt className="text-primary" />
          <span className="text-sm">{hotel.location}</span>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {hotel.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold text-primary">${hotel.price}</span>
            <span className="text-muted-foreground text-sm">/night</span>
          </div>
          <Link to={`/hotel/${hotel.id}`}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
