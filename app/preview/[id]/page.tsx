"use client";

import { useState, useRef, useEffect } from "react";
import Hls from "hls.js";
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
  AudioWaveform,
  Video,
} from "lucide-react";
import { fetchSingleContent } from "@/lib/api/content";
import { useParams } from "next/navigation";

interface MediaContent {
  _id: string;
  title: string;
  description: string;
  type: "video" | "audio";
  categories: string | null;
  filePath: string;
  thumbnail: string;
  isPublished: boolean;
  numberOfViews: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  likes?: number;
  shares?: number;
  completionRate?: number;
  engagement?: number;
  avgWatchTime?: string;
}

export default function PreviewPage() {
  const params = useParams();
  const id = params.id as string;

  const [mediaData, setMediaData] = useState<MediaContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hls, setHls] = useState<Hls | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    tags: "",
    published: true,
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSingleContent(id);
        setMediaData(data);
        setEditForm({
          title: data.title,
          description: data.description,
          tags: data.tags?.join(", ") || "",
          published: data.isPublished,
        });
      } catch (err) {
        console.error("Error fetching single content:", err);
        setError("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchContent();
    }
  }, [id]);

  // Initialize HLS.js for video streaming
  useEffect(() => {
    if (!mediaData || !videoRef.current) return;

    const video = videoRef.current;
    const isHls = mediaData.filePath.endsWith(".m3u8");

    if (isHls && Hls.isSupported()) {
      const hlsInstance = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hlsInstance.loadSource(
        `${process.env.NEXT_PUBLIC_BASE_URL}${mediaData.filePath}`
      );
      hlsInstance.attachMedia(video);

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest parsed");
      });

      hlsInstance.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
      });

      setHls(hlsInstance);

      return () => {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      };
    } else if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari and other browsers that support native HLS
      video.src = `${process.env.NEXT_PUBLIC_BASE_URL}${mediaData.filePath}`;
    }
  }, [mediaData]);

  // Get full URLs for media files
  const getMediaUrl = () => {
    if (!mediaData?.filePath) return "";
    return `${process.env.NEXT_PUBLIC_BASE_URL}${mediaData.filePath}`;
  };

  const getThumbnailUrl = () => {
    if (!mediaData?.thumbnail) return "/placeholder-thumbnail.jpg";
    return `${process.env.NEXT_PUBLIC_BASE_URL}${mediaData.thumbnail}`;
  };

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSave = () => {
    if (mediaData) {
      setMediaData({
        ...mediaData,
        title: editForm.title,
        description: editForm.description,
        isPublished: editForm.published,
        tags: editForm.tags.split(",").map((tag) => tag.trim()),
      });
      setIsEditing(false);
      // TODO: Add API call to update content
    }
  };

  // Calculate derived analytics data
  const analyticsData = [
    {
      label: "Total Views",
      value: mediaData?.numberOfViews.toLocaleString() || "0",
      change: "+12%",
      icon: Eye,
    },
    {
      label: "Likes",
      value: (mediaData?.likes || 0).toLocaleString(),
      change: "+8%",
      icon: ThumbsUp,
    },
    {
      label: "Shares",
      value: (mediaData?.shares || 0).toLocaleString(),
      change: "+15%",
      icon: Share2,
    },
    {
      label: "Completion Rate",
      value: `${mediaData?.completionRate || 0}%`,
      change: "+5%",
      icon: Download,
    },
    {
      label: "Engagement Rate",
      value: `${mediaData?.engagement || 0}%`,
      change: "+3%",
      icon: Eye,
    },
    {
      label: "Avg Watch Time",
      value: mediaData?.avgWatchTime || "0:00",
      change: "+2%",
      icon: Play,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error || !mediaData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || "Content not found"}</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isAudio = mediaData.type === "audio";

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
            {/* Media Player */}
            <Card className="overflow-hidden group">
              <CardContent className="p-0">
                <div
                  className={`relative bg-black ${
                    isAudio ? "aspect-video" : "aspect-video"
                  }`}
                >
                  {isAudio ? (
                    // Audio Player UI
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white p-8">
                        <AudioWaveform className="h-24 w-24 mx-auto mb-4 text-blue-400" />
                        <h3 className="text-xl font-semibold mb-2">
                          Now Playing
                        </h3>
                        <p className="text-lg mb-4">{mediaData.title}</p>
                        <div className="w-full max-w-md mx-auto">
                          {/* Progress Bar for Audio */}
                          <div className="mb-4">
                            <input
                              type="range"
                              min="0"
                              max={duration || 0}
                              value={currentTime}
                              onChange={handleSeek}
                              className="w-full h-2 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                            />
                          </div>

                          {/* Audio Controls */}
                          <div className="flex items-center justify-center space-x-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/20"
                              onClick={handlePlayPause}
                            >
                              {isPlaying ? (
                                <Pause className="h-8 w-8" />
                              ) : (
                                <Play className="h-8 w-8" fill="white" />
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/20"
                              onClick={handleMute}
                            >
                              {isMuted ? (
                                <VolumeX className="h-6 w-6" />
                              ) : (
                                <Volume2 className="h-6 w-6" />
                              )}
                            </Button>

                            {/* Volume Slider */}
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={volume}
                              onChange={handleVolumeChange}
                              className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                            />

                            <div className="text-white text-sm">
                              {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Video Player
                    <>
                      <video
                        ref={videoRef}
                        className="w-full h-full"
                        poster={getThumbnailUrl()}
                        onClick={handlePlayPause}
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        controls={false}
                      >
                        <source
                          src={getMediaUrl()}
                          type="application/x-mpegURL"
                        />
                        Your browser does not support the video tag.
                      </video>

                      {/* Custom Video Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                          />
                        </div>

                        <div className="flex items-center justify-between">
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

                            {/* Volume Slider */}
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={volume}
                              onChange={handleVolumeChange}
                              className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                            />

                            <div className="text-white text-sm">
                              {formatTime(currentTime)} / {formatTime(duration)}
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
                              onClick={handleFullscreen}
                            >
                              <Maximize className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Hidden audio element for audio files */}
                  {isAudio && (
                    <audio
                      ref={videoRef}
                      onLoadedMetadata={handleLoadedMetadata}
                      onTimeUpdate={handleTimeUpdate}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      className="hidden"
                    >
                      <source src={getMediaUrl()} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Media Information */}
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
                        <span>
                          {mediaData.numberOfViews.toLocaleString()} views
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(mediaData.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          {mediaData.likes || 0}
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
                        variant={
                          mediaData.isPublished ? "default" : "secondary"
                        }
                      >
                        {mediaData.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Badge variant="outline">
                        {mediaData.categories || "Uncategorized"}
                      </Badge>
                      <Badge variant="outline">{mediaData.type}</Badge>
                    </div>

                    <div>
                      <p className="text-muted-foreground leading-relaxed">
                        {mediaData.description}
                      </p>
                    </div>

                    {mediaData.tags && mediaData.tags.length > 0 && (
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
                    )}
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
                  <span className="font-mono">{mediaData._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge>{mediaData.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{mediaData.categories || "Uncategorized"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Upload Date:</span>
                  <span>
                    {new Date(mediaData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>
                    {new Date(mediaData.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={mediaData.isPublished ? "default" : "secondary"}
                  >
                    {mediaData.isPublished ? "Published" : "Draft"}
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
