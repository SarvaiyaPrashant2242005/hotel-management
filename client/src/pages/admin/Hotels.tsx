import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Phone, MapPin } from "lucide-react";

type Hotel = {
  _id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contactNumber: string;
  images?: string[];
  owner?: string;
};

const baseUrl = "https://hotel-management-plc3.onrender.com";

export default function HotelsPage() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    contactNumber: "",
    imageUrl: "",
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userId = typeof window !== "undefined" 
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
    queryKey: ["admin-hotels", userId],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/hotels`);
      if (!res.ok) throw new Error("Failed to load hotels");
      const data = await res.json();
      const allHotels = Array.isArray(data) ? data : [];
      
      if (!userId) return [];
      
      const filtered = allHotels.filter((h: any) => {
        const hotelOwnerId = typeof h.owner === 'string' ? h.owner : h.owner?._id || h.owner?.toString();
        return hotelOwnerId === userId;
      });
      
      return filtered;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: Omit<Hotel, "_id"> & { imageUrl?: string }) => {
      const res = await fetch(`${baseUrl}/api/hotels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: payload.name,
          description: payload.description,
          address: payload.address,
          city: payload.city,
          state: payload.state,
          country: payload.country,
          contactNumber: payload.contactNumber,
          images: payload.imageUrl ? [payload.imageUrl] : [],
        }),
      });
      if (!res.ok) throw new Error((await res.json())?.message || "Create failed");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-hotels"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Hotel> & { imageUrl?: string } }) => {
      const res = await fetch(`${baseUrl}/api/hotels/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...payload,
          images: payload.imageUrl ? [payload.imageUrl] : undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json())?.message || "Update failed");
      return res.json();
    },
    onSuccess: () => {
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["admin-hotels"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${baseUrl}/api/hotels/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error((await res.json())?.message || "Delete failed");
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-hotels"] }),
  });

  const list = useMemo(() => {
    const q = query.toLowerCase();
    const items = hotelsQuery.data || [];
    return items.filter((h) =>
      !q ||
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.state.toLowerCase().includes(q) ||
      h.country.toLowerCase().includes(q)
    );
  }, [hotelsQuery.data, query]);

  const resetForm = () => setForm({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    contactNumber: "",
    imageUrl: "",
  });

  const handleSubmit = () => {
    if (!form.name || !form.description || !form.address || !form.city || !form.state || !form.country || !form.contactNumber) return;
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: form });
    } else {
      createMutation.mutate(form as any);
    }
    resetForm();
  };

  const startEdit = (h: Hotel) => {
    setEditingId(h._id);
    setForm({
      name: h.name,
      description: h.description,
      address: h.address,
      city: h.city,
      state: h.state,
      country: h.country,
      contactNumber: h.contactNumber,
      imageUrl: (h.images && h.images[0]) || "",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Manage Hotels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Input placeholder="Hotel Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <Input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <Input placeholder="Contact Number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
            <Input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
          <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <textarea 
            placeholder="Description" 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full min-h-20 px-3 py-2 text-sm rounded-md border border-input bg-background"
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingId ? "Update Hotel" : "Add Hotel"}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={() => { setEditingId(null); resetForm(); }}>Cancel</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Input 
          placeholder="Search by name, city, state, or country..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
        <span className="text-sm text-muted-foreground">
          {list.length} {list.length === 1 ? 'hotel' : 'hotels'} found
        </span>
      </div>

      {hotelsQuery.isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading hotels...</p>
        </div>
      )}

      {!hotelsQuery.isLoading && list.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hotels found. Add your first hotel above!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!hotelsQuery.isLoading && list.map((hotel) => (
          <Card key={hotel._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video w-full bg-gray-100 overflow-hidden">
              {hotel.images && hotel.images[0] ? (
                <img 
                  src={hotel.images[0]} 
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="text-gray-400 text-4xl">🏨</span>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{hotel.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{hotel.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {hotel.address}, {hotel.city}, {hotel.state}, {hotel.country}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">{hotel.contactNumber}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => startEdit(hotel)}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${hotel.name}"?`)) {
                      deleteMutation.mutate(hotel._id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}