import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type RoomForSlider = {
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

interface RoomSliderProps {
  rooms: RoomForSlider[];
  onBook: (room: RoomForSlider) => void;
  activeRoomId?: string | null;
  baseUrl?: string;
}

const RoomSlider = ({ rooms, onBook, activeRoomId, baseUrl = "" }: RoomSliderProps) => {
  // Simple autoplay: advance every 4s, pause on hover
  const [isHover, setIsHover] = useState(false);
  const apiRef = useRef<any>(null);
  const [openRoomId, setOpenRoomId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHover) {
        apiRef.current?.scrollNext();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isHover]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Carousel
        className="w-full"
        opts={{ loop: true, align: "start" }}
        setApi={(api) => (apiRef.current = api)}
      >
        <CarouselContent>
          {rooms.map((r) => {
            const imgs = r.images && r.images.length > 0 ? r.images : [
              "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop",
            ];
            const first = imgs[0];
            const firstUrl = first.startsWith("http") ? first : `${baseUrl}${first}`;

            return (
              <CarouselItem key={r._id} className="md:basis-1/2 lg:basis-1/3">
                <div className="bg-card rounded-xl shadow-soft border overflow-hidden h-full flex flex-col">
                  <div
                    className="relative h-44 w-full overflow-hidden cursor-pointer"
                    onClick={() => setOpenRoomId(r._id)}
                  >
                    <img src={firstUrl} alt={r.title || r.type} className="w-full h-full object-cover" />
                    {r.dealText && (
                      <span className="absolute left-3 top-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        {r.dealText}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col gap-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground tracking-wider">ROOM TYPE</p>
                      <h4 className="text-lg font-semibold">{r.title || r.type}</h4>
                      <p className="text-xs text-muted-foreground">
                        Room {r.roomNumber} • Capacity: {r.capacity} guest{r.capacity > 1 ? "s" : ""}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs mt-2 text-muted-foreground">
                        {r.sizeSqft && <span>{r.sizeSqft} sq.ft</span>}
                        {r.view && <span>{r.view}</span>}
                        {r.bedType && <span>{r.bedType}</span>}
                        {typeof r.bathrooms === "number" && <span>{r.bathrooms} bathroom(s)</span>}
                      </div>
                    </div>

                    {(() => {
                      const safe = (r.amenities || [])
                        .filter((a): a is string => typeof a === "string")
                        .map((a) => a.trim())
                        .filter((a) => a && a !== "[]");
                      return safe.length > 0 ? (
                        <ul className="mt-1 grid grid-cols-2 gap-1 text-[11px] list-disc list-inside text-muted-foreground">
                          {safe.slice(0, 6).map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      ) : null;
                    })()}

                    <div className="mt-auto flex items-end justify-between gap-2">
                      <div>
                        {typeof r.strikePrice === "number" && (
                          <p className="text-xs line-through text-muted-foreground">₹{r.strikePrice}</p>
                        )}
                        <p className="text-2xl font-bold">₹{r.price}</p>
                        {typeof r.taxesAndFees === "number" && (
                          <p className="text-xs text-muted-foreground">+ ₹{r.taxesAndFees} taxes & fees/night</p>
                        )}
                        <p className="text-[11px] text-muted-foreground">
                          Status: <span className="capitalize">{r.isAvailable ? "available" : "occupied"}</span>
                        </p>
                      </div>
                      <Button
                        className="mt-1"
                        disabled={!r.isAvailable || activeRoomId === r._id}
                        onClick={() => onBook(r)}
                      >
                        {activeRoomId === r._id ? "Processing..." : "Book Now"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-6" />
        <CarouselNext className="-right-6" />
      </Carousel>

      {rooms.map((r) => {
        const isOpen = openRoomId === r._id;
        if (!isOpen) return null;
        const imgs = r.images && r.images.length > 0 ? r.images : [
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop",
        ];
        const normalized = imgs.map((src) => (src.startsWith("http") ? src : `${baseUrl}${src}`));
        return (
          <Dialog open={isOpen} onOpenChange={(o) => !o && setOpenRoomId(null)} key={`dlg-${r._id}`}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-black/5">
                  <Carousel className="w-full" opts={{ loop: true }}>
                    <CarouselContent>
                      {normalized.map((src, i) => (
                        <CarouselItem key={i}>
                          <div className="h-64 md:h-80 w-full overflow-hidden">
                            <img src={src} alt={`Room image ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </div>
                <div className="p-6 space-y-3">
                  <DialogHeader>
                    <DialogTitle>{r.title || r.type}</DialogTitle>
                    <DialogDescription>
                      Room {r.roomNumber} • Capacity: {r.capacity} guest{r.capacity > 1 ? "s" : ""}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {r.sizeSqft && <span>{r.sizeSqft} sq.ft</span>}
                    {r.view && <span>{r.view}</span>}
                    {r.bedType && <span>{r.bedType}</span>}
                    {typeof r.bathrooms === "number" && <span>{r.bathrooms} bathroom(s)</span>}
                  </div>

                  {r.amenities && r.amenities.length > 0 && (
                    <ul className="grid grid-cols-2 gap-1 text-sm list-disc list-inside text-muted-foreground">
                      {r.amenities.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-2 flex items-end justify-between">
                    <div>
                      {typeof r.strikePrice === "number" && (
                        <p className="text-xs line-through text-muted-foreground">₹{r.strikePrice}</p>
                      )}
                      <p className="text-2xl font-bold">₹{r.price}</p>
                      {typeof r.taxesAndFees === "number" && (
                        <p className="text-xs text-muted-foreground">+ ₹{r.taxesAndFees} taxes & fees/night</p>
                      )}
                    </div>
                    <Button onClick={() => onBook(r)} disabled={!r.isAvailable}>
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
};

export default RoomSlider;
