"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddContent from "@/components/AddContent";
import MediaCard from "@/components/MediaCard";
import { Plus, Video } from "lucide-react";
import { MediaContent } from "@/types/media";
import { createContent, deleteContent, fetchContent } from "@/lib/api/content";
import { fetchCategories } from "@/lib/api/categories";

export default function ContentPage() {
  const [content, setContent] = useState<MediaContent[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<MediaContent | null>(
    null
  );

  // Fetch content & categories
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [contentData, categoryData] = await Promise.all([
          fetchContent(),
          fetchCategories(),
        ]);
        setContent(contentData.mediaList);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Add content with loading state
  const handleAddContent = async (formData: FormData) => {
    try {
      setUploading(true);
      const newContent = await createContent(formData);
      setContent((prev) => [...prev, newContent]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleEditContent = async (formData: FormData) => {
    try {
      setUploading(true);
      const updatedContent = await createContent(formData); // replace with your update API if exists
      setContent((prev) =>
        prev.map((item) =>
          item._id === updatedContent._id ? updatedContent : item
        )
      );
      setIsDialogOpen(false);
      setEditingContent(null);
    } catch (error) {
      console.error("Edit failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      await deleteContent(id);
      setContent((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (item: MediaContent) => {
    setEditingContent(item);
    setIsDialogOpen(true);
  };

  const handleOpenAddDialog = () => {
    setEditingContent(null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Media Content</h1>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Content
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {content.map((item) => (
          <MediaCard
            key={item._id}
            content={item}
            onEdit={handleEdit}
            onDelete={handleDeleteContent}
            onTogglePublish={() => {}}
          />
        ))}
      </div>

      {content.length === 0 && (
        <div className="text-center py-12">
          <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No content yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by uploading your first media file.
          </p>
          <Button onClick={handleOpenAddDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Content
          </Button>
        </div>
      )}

      <AddContent
        isUploading={uploading}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddContent={handleAddContent}
        onEditContent={handleEditContent}
        editingContent={editingContent}
        categories={categories}
      />
    </div>
  );
}
