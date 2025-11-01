"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Eye,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  ThumbsUp,
  Share2,
  Download,
  Edit,
  Save,
  X,
} from "lucide-react";

// Mock data for the preview page
const mockMediaData = {
  id: "1",
  title: "Amazing Nature Documentary - Wildlife in 4K",
  description:
    "Experience the breathtaking beauty of nature with this stunning 4K documentary. Follow the journey of wildlife through different seasons and landscapes. This video showcases incredible footage of animals in their natural habitats, from the dense rainforests to the vast savannas.",
  type: "video",
  category: "Documentary",
  tags: ["nature", "wildlife", "4k", "documentary", "animals", "earth"],
  url: "/sample-video.mp4",
  published: true,
  duration: "28:15",
  uploadDate: "2024-01-15",
  views: 12450,
  likes: 892,
  shares: 234,
  completionRate: 78,
  engagement: 65,
  avgWatchTime: "22:30",
};

export default function PreviewPage({ params }: { params: { id: string } }) {
  const [mediaData, setMediaData] = useState(mockMediaData);
  const [isEditing, setIsEditing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [editForm, setEditForm] = useState({
    title: mediaData.title,
    description: mediaData.description,
    tags: mediaData.tags.join(", "),
    published: mediaData.published,
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSave = () => {
    setMediaData({
      ...mediaData,
      title: editForm.title,
      description: editForm.description,
      tags: editForm.tags.split(",").map((tag) => tag.trim()),
      published: editForm.published,
    });
    setIsEditing(false);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const analyticsData = [
    {
      label: "Total Views",
      value: mediaData.views.toLocaleString(),
      change: "+12%",
      icon: Eye,
    },

    {
      label: "Completion Rate",
      value: `${mediaData.completionRate}%`,
      change: "+5%",
      icon: Download,
    },
    {
      label: "Engagement Rate",
      value: `${mediaData.engagement}%`,
      change: "+3%",
      icon: Eye,
    },
    {
      label: "Avg Watch Time",
      value: mediaData.avgWatchTime,
      change: "+2%",
      icon: Play,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Content Preview</h1>
            <p className="text-muted-foreground">
              Manage and analyze your media content
            </p>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - YouTube-style Layout */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            <Card className="overflow-hidden group">
              <CardContent className="p-0">
                <div className="relative bg-black aspect-video">
                  {/* Actual Video Player */}
                  <video
                    ref={videoRef}
                    className="w-full h-full"
                    poster="/placeholder-thumbnail.jpg"
                    onClick={handlePlayPause}
                  >
                    <source src={"/robot.mp4"} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Custom Controls appears when hover over the video */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient to-t from-black/80  bg-black/30 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={handlePlayPause}
                        >
                          {isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" fill="white" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={handleMute}
                        >
                          {isMuted ? (
                            <VolumeX className="h-5 w-5" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                        </Button>

                        <div className="text-white text-sm">
                          0:00 / {mediaData.duration}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Settings className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Maximize className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Video Information */}
            <Card>
              <CardContent className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="text-xl font-bold border-0 text-2xl p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="resize-none border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Input
                      value={editForm.tags}
                      onChange={(e) =>
                        setEditForm({ ...editForm, tags: e.target.value })
                      }
                      placeholder="Enter tags separated by commas"
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editForm.published}
                        onCheckedChange={(checked) =>
                          setEditForm({ ...editForm, published: checked })
                        }
                      />
                      <label className="text-sm font-medium">Published</label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold">{mediaData.title}</h1>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{mediaData.views.toLocaleString()} views</span>
                        <span>•</span>
                        <span>{mediaData.uploadDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          {mediaData.likes}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-4 border-t">
                      <Badge
                        variant={mediaData.published ? "default" : "secondary"}
                      >
                        {mediaData.published ? "Published" : "Draft"}
                      </Badge>
                      <Badge variant="outline">{mediaData.category}</Badge>
                      <Badge variant="outline">{mediaData.duration}</Badge>
                    </div>

                    <div>
                      <p className="text-muted-foreground leading-relaxed">
                        {mediaData.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {mediaData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Eye className="w-5 h-5 mr-2" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-2xl font-bold">{item.value}</p>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-500">
                        {item.change}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Content ID:</span>
                  <span className="font-mono">{mediaData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge>{mediaData.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{mediaData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{mediaData.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Upload Date:</span>
                  <span>{mediaData.uploadDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={mediaData.published ? "default" : "secondary"}
                  >
                    {mediaData.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download Source File
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Thumbnail
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
