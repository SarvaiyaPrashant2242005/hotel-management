import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type RoomForList = {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  isAvailable: boolean;
  title?: string;
  sizeSqft?: number;
  view?: string;
  bedType?: string;
  bathrooms?: number;
  amenities?: string[];
  mealPlan?: string;
  taxesAndFees?: number;
  strikePrice?: number;
  dealText?: string;
  images?: string[];
};

interface RoomListProps {
  rooms: RoomForList[];
  onBook: (room: RoomForList) => void;
  activeRoomId?: string | null;
  baseUrl?: string;
}

const RoomList = ({ rooms, onBook, activeRoomId, baseUrl = "" }: RoomListProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const apiMap = useRef<Record<string, any>>({});

  useEffect(() => {
    const id = setInterval(() => {
      Object.entries(apiMap.current).forEach(([roomId, api]) => {
        if (hoveredId && hoveredId === roomId) return; // pause on hover that room
        api?.scrollNext();
      });
    }, 4000);
    return () => clearInterval(id);
  }, [hoveredId]);

  return (
    <div className="space-y-4">
      {rooms.map((r) => {
        const imgs = r.images && r.images.length > 0 ? r.images : [
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop",
        ];
        const normalized = imgs.map((src) => (src.startsWith("http") ? src : `${baseUrl}${src}`));
        const amenitiesSafe = (r.amenities || [])
          .filter((a): a is string => typeof a === "string")
          .map((a) => a.trim())
          .filter((a) => a && a !== "[]");

        return (
          <div key={r._id} className="rounded-2xl border bg-card overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-[380px,1fr] gap-0">
              {/* Left: image carousel */}
              <div
                className="relative"
                onMouseEnter={() => setHoveredId(r._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Carousel
                  className="w-full"
                  opts={{ loop: true }}
                  setApi={(api) => {
                    if (api) apiMap.current[r._id] = api;
                  }}
                >
                  <CarouselContent>
                    {normalized.map((src, i) => (
                      <CarouselItem key={i}>
                        <div className="h-56 md:h-64 w-full overflow-hidden">
                          <img src={src} alt={`Room image ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>

              {/* Right: content */}
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{r.title || r.type}</h3>
                    <p className="text-sm text-muted-foreground">Room {r.roomNumber} • Capacity: {r.capacity} guest{r.capacity > 1 ? "s" : ""}</p>
                    {r.mealPlan && (
                      <p className="text-sm text-emerald-600 mt-1">{r.mealPlan}</p>
                    )}
                    {r.view && <p className="text-xs text-muted-foreground mt-1">{r.view}</p>}
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
                      {r.sizeSqft && <span>{r.sizeSqft} sq.ft</span>}
                      {r.bedType && <span>{r.bedType}</span>}
                      {typeof r.bathrooms === "number" && <span>{r.bathrooms} bathroom(s)</span>}
                    </div>

                    {amenitiesSafe.length > 0 && (
                      <ul className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-1 text-xs list-disc list-inside text-muted-foreground">
                        {amenitiesSafe.slice(0, 8).map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="text-right min-w-[150px]">
                    {r.dealText && (
                      <div className="inline-block bg-rose-600 text-white text-xs px-2 py-1 rounded mb-2">{r.dealText}</div>
                    )}
                    {typeof r.strikePrice === "number" && (
                      <p className="text-xs line-through text-muted-foreground">₹{r.strikePrice}</p>
                    )}
                    <p className="text-2xl font-bold">₹{r.price}</p>
                    {typeof r.taxesAndFees === "number" && (
                      <p className="text-xs text-muted-foreground">₹{(r.price + r.taxesAndFees).toLocaleString()} total<br/>includes taxes & fees</p>
                    )}
                    <Button className="mt-2" disabled={!r.isAvailable || activeRoomId === r._id} onClick={() => onBook(r)}>
                      {activeRoomId === r._id ? "Processing..." : r.isAvailable ? "Book Now" : "Unavailable"}
                    </Button>
                    <p className="text-[11px] text-muted-foreground mt-1">Status: <span className="capitalize">{r.isAvailable ? "available" : "occupied"}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomList;
