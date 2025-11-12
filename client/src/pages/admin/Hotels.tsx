import { useMemo, useState } from "react";
import { hotels as baseHotels, type Hotel } from "@/data/hotels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function HotelsPage() {
  const [rows, setRows] = useState<Hotel[]>(baseHotels);
  const [query, setQuery] = useState("");

  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    rating: "",
    image: "",
  });

  const list = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter(h => !q || h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q));
  }, [rows, query]);

  const addHotel = () => {
    if (!form.name || !form.location) return;
    const next: Hotel = {
      id: rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1,
      name: form.name,
      location: form.location,
      price: Number(form.price || 0),
      rating: Number(form.rating || 0),
      image: form.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      description: "",
      amenities: [],
      roomTypes: [],
    };
    setRows(prev => [next, ...prev]);
    setForm({ name: "", location: "", price: "", rating: "", image: "" });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Hotels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input placeholder="Search by name or location" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input type="number" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-3">
            <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <Button onClick={addHotel}>Add Hotel</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map(h => (
                  <TableRow key={h.id}>
                    <TableCell className="font-medium">{h.name}</TableCell>
                    <TableCell>{h.location}</TableCell>
                    <TableCell>₹{h.price}</TableCell>
                    <TableCell>{h.rating}</TableCell>
                  </TableRow>
                ))}
                {list.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">No hotels found</TableCell>
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
