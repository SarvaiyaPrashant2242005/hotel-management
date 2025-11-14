import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type RoomStatus = "available" | "occupied" | "maintenance";

type Hotel = {
  _id: string;
  name: string;
  city: string;
  state: string;
  owner?: string | { _id?: string };
};

type ApiRoom = {
  _id: string;
  hotel: string | { _id: string; name: string; city?: string; state?: string };
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  isAvailable: boolean;
  amenities?: string[];
  title?: string;
  sizeSqft?: number;
  view?: string;
  bedType?: string;
  bathrooms?: number;
  mealPlan?: string;
  taxesAndFees?: number;
  strikePrice?: number;
  dealText?: string;
};

type RoomItem = {
  id: string;
  hotelId: string;
  hotelName: string;
  roomNumber: string;
  type: string;
  price: number;
  status: RoomStatus;
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
};

const baseUrl = "https://hotel-management-plc3.onrender.com";

export default function RoomsPage() {
  const qc = useQueryClient();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const userId =
    typeof window !== "undefined"
      ? (() => {
          const userStr = localStorage.getItem("user");
          if (!userStr) return null;
          try {
            const user = JSON.parse(userStr);
            return user.id || null;
          } catch {
            return null;
          }
        })()
      : null;

  const hotelsQuery = useQuery<Hotel[]>({
    queryKey: ["admin-hotels-for-rooms", userId],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/hotels`);
      if (!res.ok) throw new Error("Failed to load hotels");
      const data = await res.json();
      const allHotels: any[] = Array.isArray(data) ? data : [];

      if (!userId) return [];

      return allHotels.filter((h: any) => {
        const ownerId =
          typeof h.owner === "string"
            ? h.owner
            : h.owner?._id || h.owner?.toString();
        return ownerId === userId;
      });
    },
  });

  const hotels = hotelsQuery.data || [];

  const roomsQuery = useQuery<ApiRoom[]>({
    queryKey: ["admin-rooms", userId],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/rooms`);
      if (!res.ok) throw new Error("Failed to load rooms");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!userId,
  });

  const [hotelId, setHotelId] = useState<string | "all">("all");
  const [status, setStatus] = useState<RoomStatus | "all">("all");

  const [form, setForm] = useState({
    hotelId: "",
    roomNumber: "",
    type: "single" as string,
    price: "",
    capacity: "",
    status: "available" as RoomStatus,
    title: "",
    sizeSqft: "",
    view: "",
    bedType: "",
    bathrooms: "",
    amenities: "",
    mealPlan: "Breakfast Included",
  });

  const defaultHotelId = hotels[0]?._id || "";

  const rows: RoomItem[] = useMemo(() => {
    if (!roomsQuery.data || !hotels.length) return [];

    const ownerHotelIds = new Set(hotels.map((h) => h._id));

    return roomsQuery.data
      .filter((r) => {
        const hId =
          typeof r.hotel === "string" ? r.hotel : r.hotel?._id || "";
        return ownerHotelIds.has(hId);
      })
      .map((r) => {
        const hId =
          typeof r.hotel === "string" ? r.hotel : r.hotel?._id || "";
        const hotelName =
          typeof r.hotel === "object" && r.hotel?.name
            ? r.hotel.name
            : hotels.find((h) => h._id === hId)?.name || "Unknown Hotel";

        const status: RoomStatus = r.isAvailable ? "available" : "occupied";

        return {
          id: r._id,
          hotelId: hId,
          hotelName,
          roomNumber: r.roomNumber,
          type: r.type,
          price: r.price,
          status,
          title: r.title,
          sizeSqft: r.sizeSqft,
          view: r.view,
          bedType: r.bedType,
          bathrooms: r.bathrooms,
          amenities: r.amenities,
          mealPlan: r.mealPlan,
          taxesAndFees: r.taxesAndFees,
          strikePrice: r.strikePrice,
          dealText: r.dealText,
        };
      });
  }, [roomsQuery.data, hotels]);

  const list = useMemo(() => {
    return rows.filter((r) => {
      const mHotel = hotelId === "all" || r.hotelId === hotelId;
      const mStatus = status === "all" || r.status === status;
      return mHotel && mStatus;
    });
  }, [rows, hotelId, status]);

  const createRoomMutation = useMutation({
    mutationFn: async () => {
      const hId = form.hotelId || defaultHotelId;
      if (!hId || !form.roomNumber || !form.type || !form.capacity) {
        throw new Error("Missing required fields");
      }

      const payload: any = {
        hotel: hId,
        roomNumber: form.roomNumber,
        type: form.type,
        price: Number(form.price || 0),
        capacity: Number(form.capacity),
        isAvailable: form.status === "available",
        amenities: form.amenities
          ? form.amenities
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
        title: form.title || undefined,
        sizeSqft: form.sizeSqft ? Number(form.sizeSqft) : undefined,
        view: form.view || undefined,
        bedType: form.bedType || undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        mealPlan: form.mealPlan || undefined,
      };

      const res = await fetch(`${baseUrl}/api/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to create room");
      }

      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-rooms"] });
      setForm({
        hotelId: defaultHotelId,
        roomNumber: "",
        type: "single",
        price: "",
        capacity: "",
        status: "available",
        title: "",
        sizeSqft: "",
        view: "",
        bedType: "",
        bathrooms: "",
        amenities: "",
        mealPlan: "Breakfast Included",
      });
    },
  });

  const addRoom = () => {
    createRoomMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Rooms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Select
              value={hotelId === "all" ? "all" : String(hotelId)}
              onValueChange={(v) => setHotelId(v === "all" ? "all" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hotel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All hotels</SelectItem>
                {hotels.map((h) => (
                  <SelectItem key={h._id} value={h._id}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <Select
              value={form.hotelId || defaultHotelId}
              onValueChange={(v) => setForm({ ...form, hotelId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((h) => (
                  <SelectItem key={h._id} value={h._id}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Room number" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} />
            <Select
              value={form.type}
              onValueChange={(v) => setForm({ ...form, type: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="double">Double</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input
              type="number"
              placeholder="Capacity"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as RoomStatus })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addRoom} disabled={createRoomMutation.isPending}>
              {createRoomMutation.isPending ? "Adding..." : "Add Room"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Title (e.g. Premium Pool View With Balcony)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Size (sq.ft)"
              value={form.sizeSqft}
              onChange={(e) => setForm({ ...form, sizeSqft: e.target.value })}
            />
            <Input
              placeholder="View (e.g. Swimming Pool View)"
              value={form.view}
              onChange={(e) => setForm({ ...form, view: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Bed type (e.g. 1 King Bed)"
              value={form.bedType}
              onChange={(e) => setForm({ ...form, bedType: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Bathrooms"
              value={form.bathrooms}
              onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
            />
            <Input
              placeholder="Amenities (comma separated)"
              value={form.amenities}
              onChange={(e) => setForm({ ...form, amenities: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select
              value={form.mealPlan}
              onValueChange={(v) => setForm({ ...form, mealPlan: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Meal Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Breakfast Included">Breakfast Included</SelectItem>
                <SelectItem value="Breakfast & Lunch/Dinner Included">
                  Breakfast & Lunch/Dinner Included
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map(r => {
                  const h = hotels.find(h => h.id === r.hotelId);
                  return (
                    <TableRow key={r.id}>
                      <TableCell>{h?.name}</TableCell>
                      <TableCell className="font-medium">{r.roomNumber}</TableCell>
                      <TableCell>{r.type}</TableCell>
                      <TableCell className="capitalize">{r.status}</TableCell>
                      <TableCell>₹{r.price}</TableCell>
                    </TableRow>
                  );
                })}
                {list.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">No rooms found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3">
            {list.map(r => (
              <Card key={`card-${r.id}`} className="border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">ROOM TYPE</p>
                    <p className="font-semibold mt-1">{r.title || r.type}</p>
                    {r.mealPlan && (
                      <p className="text-xs text-muted-foreground mt-1">{r.mealPlan}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {typeof r.strikePrice === "number" && (
                      <p className="text-xs line-through text-muted-foreground">₹{r.strikePrice}</p>
                    )}
                    <p className="text-lg font-bold">₹{r.price}</p>
                    {typeof r.taxesAndFees === "number" && (
                      <p className="text-xs text-muted-foreground">+ ₹{r.taxesAndFees} Taxes &amp; Fees per night</p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-4">
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{hotels.find(h => h.id === r.hotelId)?.name}</p>
                    <p className="text-xs text-muted-foreground">Room {r.roomNumber} • {r.type}</p>
                    <div className="flex flex-wrap gap-2 text-xs mt-2">
                      {r.sizeSqft && <span>{r.sizeSqft} sq.ft</span>}
                      {r.view && <span>{r.view}</span>}
                      {r.bedType && <span>{r.bedType}</span>}
                      {typeof r.bathrooms === "number" && <span>{r.bathrooms} Bathroom(s)</span>}
                    </div>
                    {r.amenities && r.amenities.length > 0 && (
                      <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-1 text-xs list-disc list-inside">
                        {r.amenities.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex flex-col items-end justify-between gap-2">
                    {r.dealText && (
                      <p className="text-xs text-green-700 font-medium self-start bg-green-50 px-2 py-1 rounded">
                        {r.dealText}
                      </p>
                    )}
                    <Button className="mt-2">Book Now</Button>
                    <p className="text-xs text-muted-foreground">
                      Status: <span className="capitalize">{r.status}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
