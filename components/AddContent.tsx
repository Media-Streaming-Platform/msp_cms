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
import { Plus, Upload } from "lucide-react";
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
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddContent: (content: MediaContent) => void;
  onEditContent: (content: MediaContent) => void;
  editingContent: MediaContent | null;
  categories: string[];
}

export default function AddContent({
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
    category: "",
    published: true,
  });

  // Reset form when dialog opens/closes or editingContent changes
  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = setTimeout(() => {
      if (editingContent) {
        setFormData({
          title: editingContent.title,
          description: editingContent.description,
          type: editingContent.type,
          category: editingContent.category,
          published: editingContent.published,
        });
      } else {
        setFormData({
          title: "",
          description: "",
          type: "video",
          category: "",
          published: true,
        });
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [isOpen, editingContent]);

  const handleSubmit = () => {
    const contentData: MediaContent = {
      _id: editingContent?._id,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      category: formData.category,
      thumbnail: "/placeholder-thumbnail.jpg",
      filepath:
        formData.type === "video" ? "/sample-video.mp4" : "/sample-audio.mp3",
      published: formData.published,
      views: editingContent?.views || 0,
      likes: editingContent?.likes || 0,
      duration:
        editingContent?.duration ||
        (formData.type === "video" ? "12:34" : "03:45"),
      uploadDate:
        editingContent?.uploadDate || new Date().toISOString().split("T")[0],
    };

    if (editingContent) {
      onEditContent(contentData);
    } else {
      onAddContent(contentData);
    }

    onOpenChange(false);
  };

  const isFormValid = formData.title.trim() && formData.category.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Enter title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value: "video" | "audio") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 flex items-stretch gap-2">
            <div className="w-1/4">
              <label className="text-sm font-medium">
                Upload {formData.type}
              </label>
              <div className="border-2 border-dashed rounded-lg py-7 text-center">
                <Upload className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drop your {formData.type} file here
                </p>
                <Button variant="outline" className="mt-2">
                  Browse
                </Button>
              </div>
            </div>
            <div className="flex-1 w-3/4">
              <label className="text-sm font-medium">Upload thumbnail</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop your thumbnail file here, or click to browse
                </p>
                <Button variant="outline" className="mt-2">
                  Browse Files
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.published}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, published: checked })
              }
            />
            <label className="text-sm font-medium">Publish</label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {editingContent ? "Update" : "Add"} Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
