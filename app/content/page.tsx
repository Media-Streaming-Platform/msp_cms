"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Video,
  AudioWaveform,
  Upload,
  MoreVertical,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MediaContent {
  id: string;
  title: string;
  description: string;
  type: "video" | "audio";
  category: string;
  tags: string[];
  thumbnail: string;
  url: string;
  published: boolean;
  duration: string;
  uploadDate: string;
  views: number;
  likes: number;
}

const initialContent: MediaContent[] = [
  {
    id: "1",
    title: "Sample Music Track",
    description: "A beautiful sample music track with amazing beats",
    type: "audio",
    category: "Music",
    tags: ["music", "sample", "beats"],
    thumbnail: "/placeholder-thumbnail.jpg",
    url: "/sample-audio.mp3",
    published: true,
    duration: "3:45",
    uploadDate: "2024-01-15",
    views: 1245,
    likes: 89,
  },
  {
    id: "2",
    title: "Podcast Episode 1",
    description: "First episode of our podcast series about technology",
    type: "audio",
    category: "Podcasts",
    tags: ["podcast", "episode1", "tech"],
    thumbnail: "/placeholder-thumbnail.jpg",
    url: "/sample-podcast.mp3",
    published: true,
    duration: "45:20",
    uploadDate: "2024-01-10",
    views: 892,
    likes: 45,
  },
  {
    id: "3",
    title: "Amazing Nature Documentary",
    description: "Stunning footage of wildlife and natural landscapes",
    type: "video",
    category: "Movies",
    tags: ["nature", "documentary", "wildlife"],
    thumbnail: "/placeholder-thumbnail.jpg",
    url: "/sample-video.mp4",
    published: true,
    duration: "28:15",
    uploadDate: "2024-01-12",
    views: 4567,
    likes: 234,
  },
  {
    id: "4",
    title: "Coding Tutorial - React Basics",
    description: "Learn React fundamentals with this comprehensive tutorial",
    type: "video",
    category: "Education",
    tags: ["coding", "react", "tutorial"],
    thumbnail: "/placeholder-thumbnail.jpg",
    url: "/sample-video.mp4",
    published: false,
    duration: "15:30",
    uploadDate: "2024-01-08",
    views: 123,
    likes: 12,
  },
  {
    id: "5",
    title: "Morning Meditation",
    description: "Start your day with peaceful meditation",
    type: "audio",
    category: "Health",
    tags: ["meditation", "wellness", "morning"],
    thumbnail: "/placeholder-thumbnail.jpg",
    url: "/sample-audio.mp3",
    published: true,
    duration: "10:00",
    uploadDate: "2024-01-05",
    views: 678,
    likes: 56,
  },
  {
    id: "6",
    title: "Travel Vlog - Japan Adventure",
    description: "Exploring the beautiful landscapes of Japan",
    type: "video",
    category: "Travel",
    tags: ["travel", "japan", "vlog"],
    thumbnail: "/placeholder-thumbnail.jpg",
    url: "/sample-video.mp4",
    published: true,
    duration: "22:45",
    uploadDate: "2024-01-03",
    views: 2890,
    likes: 167,
  },
];

const categories = [
  "Music",
  "Podcasts",
  "Movies",
  "TV Shows",
  "Education",
  "Health",
  "Travel",
];

export default function ContentPage() {
  const [content, setContent] = useState<MediaContent[]>(initialContent);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<MediaContent | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "video" as "video" | "audio",
    category: "",
    tags: "",
    published: true,
  });

  const handleAddContent = () => {
    const newContent: MediaContent = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      category: formData.category,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      thumbnail: "/placeholder-thumbnail.jpg",
      url:
        formData.type === "video" ? "/sample-video.mp4" : "/sample-audio.mp3",
      published: formData.published,
      duration: "0:00",
      uploadDate: new Date().toISOString().split("T")[0],
      views: 0,
      likes: 0,
    };
    setContent([...content, newContent]);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEditContent = () => {
    if (editingContent) {
      setContent(
        content.map((item) =>
          item.id === editingContent.id
            ? {
                ...item,
                title: formData.title,
                description: formData.description,
                category: formData.category,
                tags: formData.tags.split(",").map((tag) => tag.trim()),
                published: formData.published,
              }
            : item
        )
      );
      resetForm();
      setIsDialogOpen(false);
    }
  };

  const handleDeleteContent = (id: string) => {
    setContent(content.filter((item) => item.id !== id));
  };

  const togglePublish = (id: string) => {
    setContent(
      content.map((item) =>
        item.id === id ? { ...item, published: !item.published } : item
      )
    );
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "video",
      category: "",
      tags: "",
      published: true,
    });
    setEditingContent(null);
  };

  const openEditDialog = (item: MediaContent) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      description: item.description,
      type: item.type,
      category: item.category,
      tags: item.tags.join(", "),
      published: item.published,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Media Content</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Content
            </Button>
          </DialogTrigger>
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
              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tags (comma separated)
                  </label>
                  <Input
                    placeholder="tag1, tag2, tag3"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Upload File</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop your {formData.type} file here, or click to
                    browse
                  </p>
                  <Button variant="outline" className="mt-2">
                    Browse Files
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                />
                <label className="text-sm font-medium">Published</label>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={editingContent ? handleEditContent : handleAddContent}
                disabled={!formData.title || !formData.category}
              >
                {editingContent ? "Update" : "Add"} Content
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Video Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {content.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-muted">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                {item.type === "video" ? (
                  <Video className="h-12 w-12 text-white/80" />
                ) : (
                  <AudioWaveform className="h-12 w-12 text-white/80" />
                )}
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-black/50 rounded-full p-3">
                  <Play className="h-6 w-6 text-white" fill="white" />
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  {item.duration}
                </Badge>
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <Badge
                  variant={item.published ? "default" : "secondary"}
                  className="text-xs"
                >
                  {item.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>

            {/* Content Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold line-clamp-2 flex-1 mr-2">
                  {item.title}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <a href={`/preview/${item.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View & Edit
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditDialog(item)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => togglePublish(item.id)}>
                      {item.published ? "Unpublish" : "Publish"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteContent(item.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {item.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.category}</span>
                <div className="flex items-center space-x-2">
                  <span>{item.views} views</span>
                  <span>•</span>
                  <span>{item.likes} likes</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {item.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {content.length === 0 && (
        <div className="text-center py-12">
          <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No content yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by uploading your first media file.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Content
          </Button>
        </div>
      )}
    </div>
  );
}
