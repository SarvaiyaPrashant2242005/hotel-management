import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Phone, MapPin, Building2, Search, Image as ImageIcon } from "lucide-react";

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
  const [open, setOpen] = useState(false);
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
    setOpen(false);
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
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotels</h1>
          <p className="text-muted-foreground mt-1">Manage your hotel properties</p>
        </div>
        <Button 
          onClick={() => { setEditingId(null); resetForm(); setOpen(true); }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Building2 className="w-4 h-4 mr-2" />
          Add Hotel
        </Button>
      </div>

      {/* Search & Stats */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, city, state, or country..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <Building2 className="w-4 h-4" />
              <span className="font-semibold">{list.length}</span>
              <span className="text-sm">{list.length === 1 ? 'hotel' : 'hotels'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditingId(null); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              {editingId ? "Edit Hotel" : "Add New Hotel"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {editingId ? "Update hotel information" : "Fill in the details to add a new hotel"}
            </p>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hotel Name *</label>
                  <Input 
                    placeholder="e.g., Grand Plaza Hotel" 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Number *</label>
                  <Input 
                    placeholder="e.g., +1 234 567 8900" 
                    value={form.contactNumber} 
                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} 
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Location</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Address *</label>
                <Input 
                  placeholder="e.g., 123 Main Street" 
                  value={form.address} 
                  onChange={(e) => setForm({ ...form, address: e.target.value })} 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City *</label>
                  <Input 
                    placeholder="e.g., New York" 
                    value={form.city} 
                    onChange={(e) => setForm({ ...form, city: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">State *</label>
                  <Input 
                    placeholder="e.g., NY" 
                    value={form.state} 
                    onChange={(e) => setForm({ ...form, state: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country *</label>
                  <Input 
                    placeholder="e.g., USA" 
                    value={form.country} 
                    onChange={(e) => setForm({ ...form, country: e.target.value })} 
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Description</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hotel Description *</label>
                <textarea 
                  placeholder="Describe your hotel, amenities, and unique features..." 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full min-h-32 px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Image */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Media</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image URL
                </label>
                <Input 
                  placeholder="https://example.com/hotel-image.jpg" 
                  value={form.imageUrl} 
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} 
                />
                {form.imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border">
                    <img 
                      src={form.imageUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => { setOpen(false); setEditingId(null); }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  "Saving..."
                ) : editingId ? (
                  "Update Hotel"
                ) : (
                  "Add Hotel"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {!hotelsQuery.isLoading && list.map((hotel) => (
          <Card key={hotel._id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-200">
            <div className="relative aspect-video w-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
              {hotel.images && hotel.images[0] ? (
                <img 
                  src={hotel.images[0]} 
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                  <Building2 className="w-16 h-16 text-blue-200" />
                </div>
              )}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-blue-600 shadow-lg">
                Active
              </div>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{hotel.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{hotel.description}</p>
              
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-sm p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {hotel.address}, {hotel.city}, {hotel.state}, {hotel.country}
                  </span>
                </div>
                
                <div className="flex items-center gap-2.5 text-sm p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <Phone className="w-4 h-4 flex-shrink-0 text-green-600" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{hotel.contactNumber}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                  onClick={() => startEdit(hotel)}
                >
                  <Pencil className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="hover:bg-red-600"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${hotel.name}"?`)) {
                      deleteMutation.mutate(hotel._id);
                    }
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
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