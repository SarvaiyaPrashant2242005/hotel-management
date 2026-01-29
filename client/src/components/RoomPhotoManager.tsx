import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, Move, Eye, Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RoomPhotoManagerProps {
  roomId: string;
  images: string[];
  baseUrl?: string;
  onImagesUpdate?: (images: string[]) => void;
}

const baseApiUrl = "http://localhost:5000";

export default function RoomPhotoManager({ 
  roomId, 
  images, 
  baseUrl = baseApiUrl, 
  onImagesUpdate 
}: RoomPhotoManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const qc = useQueryClient();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Add new images mutation
  const addImagesMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append("images", file));

      const res = await fetch(`${baseUrl}/api/rooms/${roomId}`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to add images");
      }

      return res.json();
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-rooms"] });
      onImagesUpdate?.(data.room.images);
      setNewImages([]);
      toast({ title: "Images added successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error adding images", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Delete specific image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (imageIndex: number) => {
      const res = await fetch(`${baseUrl}/api/rooms/${roomId}/images/${imageIndex}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to delete image");
      }

      return res.json();
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-rooms"] });
      onImagesUpdate?.(data.room.images);
      toast({ title: "Image deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting image", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Reorder images mutation
  const reorderImagesMutation = useMutation({
    mutationFn: async (newOrder: string[]) => {
      const res = await fetch(`${baseUrl}/api/rooms/${roomId}/images/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ imageOrder: newOrder }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to reorder images");
      }

      return res.json();
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-rooms"] });
      onImagesUpdate?.(data.room.images);
      toast({ title: "Images reordered successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error reordering images", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newOrder = [...images];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);

    reorderImagesMutation.mutate(newOrder);
    setDraggedIndex(null);
  };

  const handleAddImages = () => {
    if (newImages.length > 0) {
      addImagesMutation.mutate(newImages);
    }
  };

  const handleDeleteImage = (index: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      deleteImageMutation.mutate(index);
    }
  };

  const getImageUrl = (src: string) => {
    return src.startsWith("http") ? src : `${baseUrl}${src}`;
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Room Photos ({images.length})</h4>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(true)}>
            <Upload className="h-4 w-4 mr-1" />
            Manage Photos
          </Button>
        </div>
        
        {images.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.slice(0, 4).map((src, idx) => (
              <img
                key={idx}
                src={getImageUrl(src)}
                alt={`Room image ${idx + 1}`}
                className="h-16 w-20 object-cover rounded border cursor-pointer hover:opacity-80"
                onClick={() => setPreviewImage(getImageUrl(src))}
              />
            ))}
            {images.length > 4 && (
              <div className="h-16 w-20 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                +{images.length - 4} more
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">No photos uploaded</div>
        )}
      </div>

      {/* Photo Management Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Room Photos</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Add New Images */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h5 className="font-medium">Add New Photos</h5>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setNewImages(e.target.files ? Array.from(e.target.files) : [])}
                  />
                  {newImages.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {newImages.length} file(s) selected
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {newImages.map((file, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${idx + 1}`}
                              className="h-20 w-24 object-cover rounded border"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0"
                              onClick={() => setNewImages(prev => prev.filter((_, i) => i !== idx))}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={handleAddImages}
                        disabled={addImagesMutation.isPending}
                      >
                        {addImagesMutation.isPending ? "Adding..." : "Add Photos"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Existing Images */}
            {images.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Current Photos</h5>
                      <p className="text-sm text-muted-foreground">
                        Drag to reorder • Click to preview
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative group cursor-move"
                          draggable
                          onDragStart={() => handleDragStart(idx)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, idx)}
                        >
                          <img
                            src={getImageUrl(src)}
                            alt={`Room image ${idx + 1}`}
                            className="w-full h-32 object-cover rounded border"
                          />
                          
                          {/* Image overlay with actions */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setPreviewImage(getImageUrl(src))}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteImage(idx)}
                              disabled={deleteImageMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Image order indicator */}
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {idx + 1}
                          </div>
                          
                          {/* Primary image indicator */}
                          {idx === 0 && (
                            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto max-h-[70vh] object-contain rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}