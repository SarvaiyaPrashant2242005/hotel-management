import { useMemo, useState } from "react";
import { rooms as baseRooms, type RoomItem, RoomStatus } from "@/data/rooms";
import { hotels } from "@/data/hotels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function RoomsPage() {
  const [rows, setRows] = useState<RoomItem[]>(baseRooms);
  const [hotelId, setHotelId] = useState<number | "all">("all");
  const [status, setStatus] = useState<RoomStatus | "all">("all");

  const [form, setForm] = useState({
    hotelId: hotels[0]?.id ?? 1,
    roomNumber: "",
    type: "",
    price: "",
    status: "available" as RoomStatus,
  });

  const list = useMemo(() => {
    return rows.filter(r => {
      const mHotel = hotelId === "all" || r.hotelId === hotelId;
      const mStatus = status === "all" || r.status === status;
      return mHotel && mStatus;
    });
  }, [rows, hotelId, status]);

  const addRoom = () => {
    if (!form.roomNumber || !form.type) return;
    const next: RoomItem = {
      id: `r${rows.length + 1}`,
      hotelId: Number(form.hotelId),
      roomNumber: form.roomNumber,
      type: form.type,
      price: Number(form.price || 0),
      status: form.status,
    };
    setRows(prev => [next, ...prev]);
    setForm({ hotelId: hotels[0]?.id ?? 1, roomNumber: "", type: "", price: "", status: "available" });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Rooms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Select value={hotelId === "all" ? "all" : String(hotelId)} onValueChange={(v) => setHotelId(v === "all" ? "all" : Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Hotel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All hotels</SelectItem>
                {hotels.map(h => (
                  <SelectItem key={h.id} value={String(h.id)}>{h.name}</SelectItem>
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
            <Select value={String(form.hotelId)} onValueChange={(v) => setForm({ ...form, hotelId: Number(v) })}>
              <SelectTrigger>
                <SelectValue placeholder="Hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map(h => (
                  <SelectItem key={h.id} value={String(h.id)}>{h.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Room number" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} />
            <Input placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            <Input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
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
            <Button onClick={addRoom}>Add Room</Button>
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
        </CardContent>
      </Card>
    </div>
  );
}
