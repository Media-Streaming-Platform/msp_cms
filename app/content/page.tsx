"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddContent from "@/components/AddContent";
import MediaCard from "@/components/MediaCard";
import { Plus, Video } from "lucide-react";
import { MediaContent } from "@/types/media";
import { createContent, fetchContent } from "@/lib/api/content";
import { fetchCategories } from "@/lib/api/categories";

// Remove initialContent since we'll fetch from API
// Add loading state and useEffect to fetch data

export default function ContentPage() {
  const [content, setContent] = useState<MediaContent[]>([]);
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<MediaContent | null>(
    null
  );

  // Fetch content on component mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const data = await fetchContent();
        setContent(data.mediaList);
        console.log("Fetched content:", data.mediaList);
      } catch (error) {
        console.error("Failed to fetch content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadCategory = async () =>{
      const data = await  fetchCategories()
      setCategories(data);
    }
    loadContent();
    loadCategory();
  }, []);

  const handleAddContent = (newContent: MediaContent) => {
    // setContent([...content, newContent]);
    console.log(newContent)
    createContent(newContent)
  };

  const handleEditContent = (updatedContent: MediaContent) => {
    setContent(
      content.map((item) =>
        item._id === updatedContent._id ? updatedContent : item
      )
    );
    setEditingContent(null);
  };

  const handleDeleteContent = (id: string) => {
    setContent(content.filter((item) => item._id !== id));
  };

  const handleTogglePublish = (id: string) => {
    setContent(
      content.map((item) =>
        item._id === id ? { ...item, isPublished: !item.published } : item
      )
    );
  };

  const handleEdit = (content: MediaContent) => {
    setEditingContent(content);
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
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {content && content.map((item) => (
          <MediaCard
            key={item._id}
            content={item}
            onEdit={handleEdit}
            onDelete={handleDeleteContent}
            onTogglePublish={handleTogglePublish}
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
            <Plus className="mr-2 h-4 w-4" />
            Add Content
          </Button>
        </div>
      )}

      <AddContent
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddContent={handleAddContent}
        onEditContent={handleEditContent}
        editingContent={editingContent}
        categories={categories}
        // categories={[
        //   "Music",
        //   "Podcasts",
        //   "Movies",
        //   "TV Shows",
        //   "Education",
        //   "Health",
        //   "Travel",
        // ]}
      />
    </div>
  );
}
