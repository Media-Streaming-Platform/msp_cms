"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MediaContent } from "@/types/media";

interface AddContentProps {
  isUploading: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddContent: (
    content: FormData,
    files: { media: File | null; thumbnail: File | null }
  ) => Promise<void>;
  onEditContent: (
    content: FormData,
    files: { media: File | null; thumbnail: File | null }
  ) => Promise<void>;
  editingContent: MediaContent | null;
  categories: { _id: string; name: string }[];
}

export default function AddContent({
  isUploading,
  isOpen,
  onOpenChange,
  onAddContent,
  onEditContent,
  editingContent,
  categories,
}: AddContentProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "video" as "video" | "audio",
    category: { _id: "", name: "" },
    published: true,
  });

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Reset when opening or editing
  useEffect(() => {
    if (!isOpen) return;

    if (editingContent) {
      setFormData({
        title: editingContent.title,
        description: editingContent.description,
        type: editingContent.type,
        category:
          typeof editingContent.category === "object"
            ? editingContent.category
            : { _id: editingContent.category as string, name: "" },
        published: editingContent.published,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        type: "video",
        category: { _id: "", name: "" },
        published: true,
      });
      setMediaFile(null);
      setThumbnailFile(null);
    }
  }, [isOpen, editingContent]);

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("category", formData.category._id);
    formDataToSend.append("categoryId", formData.category._id);

    formDataToSend.append("published", String(formData.published));

    if (mediaFile) formDataToSend.append("file", mediaFile);
    if (thumbnailFile) formDataToSend.append("thumbnail", thumbnailFile);
    if (editingContent?._id) formDataToSend.append("_id", editingContent._id);

    try {
      if (editingContent) {
        await onEditContent(formDataToSend, {
          media: mediaFile,
          thumbnail: thumbnailFile,
        });
      } else {
        await onAddContent(formDataToSend, {
          media: mediaFile,
          thumbnail: thumbnailFile,
        });
      }
      // Don’t close the dialog here — parent will handle it when done
    } catch (error) {
      console.error("Failed to submit content:", error);
    }
  };

  const isFormValid =
    formData.title.trim() &&
    formData.category._id &&
    (editingContent ? true : mediaFile);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !isUploading && onOpenChange(open)}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingContent ? "Edit Content" : "Add New Content"}
          </DialogTitle>
          <DialogDescription>
            {editingContent
              ? "Update the media content details below."
              : "Fill in the details for the new media content."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Enter title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={isUploading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isUploading}
            />
          </div>

          {/* Type & Category */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value: "video" | "audio") =>
                  setFormData({ ...formData, type: value })
                }
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={formData.category._id}
                onValueChange={(value) => {
                  const selectedCategory = categories.find(
                    (c) => c._id === value
                  );
                  if (selectedCategory)
                    setFormData({ ...formData, category: selectedCategory });
                }}
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Files */}
          <div className="flex gap-2">
            <div className="w-1/3">
              <label className="text-sm font-medium">
                Upload {formData.type}
              </label>
              <input
                type="file"
                accept={formData.type === "video" ? "video/*" : "audio/*"}
                onChange={(e) =>
                  setMediaFile(e.target.files ? e.target.files[0] : null)
                }
                disabled={isUploading}
                className="border-2 border-dashed rounded-lg py-7 text-center w-full cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Upload thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setThumbnailFile(e.target.files ? e.target.files[0] : null)
                }
                disabled={isUploading}
                className="border-2 border-dashed rounded-lg py-6 text-center w-full cursor-pointer"
              />
            </div>
          </div>

          {/* Publish */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.published}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, published: checked })
              }
              disabled={isUploading}
            />
            <label className="text-sm font-medium">Publish</label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!isFormValid || isUploading}>
            {isUploading
              ? "Uploading..."
              : editingContent
              ? "Update Content"
              : "Add Content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
