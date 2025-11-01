"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  Video,
  AudioWaveform,
  Play,
  MoreVertical,
} from "lucide-react";
import { MediaContent } from "@/types/media";
import Image from "next/image";

interface MediaCardProps {
  content: MediaContent;
  onEdit: (content: MediaContent) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
}

export default function MediaCard({
  content,
  onEdit,
  onDelete,
}: MediaCardProps) {
  const getDuration = () => {
    if (content.duration) return content.duration;
    return content.type === "video" ? "12:34" : "03:45";
  };

  return (
    <div className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted ">
        <Image
          src={content.thumbnail}
          alt={content.title}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          {content.type === "audio" && (
            <AudioWaveform className="h-12 w-12 text-white/80" />
          )}
        </div>

        {/* Play Button Overlay */}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity ">
          <a
            href={`/preview/${content._id}`}
            className="no-underline w-full h-full flex items-center justify-center bg-none"
          >
            <div className="bg-black/50 rounded-full p-3">
              <Play className="h-6 w-6 text-white" fill="white" />
            </div>
          </a>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="text-xs">
            {getDuration()}
          </Badge>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <Badge
            variant={content.published ? "default" : "secondary"}
            className="text-xs"
          >
            {content.published ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-2">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center flex-1 gap-2">
            <div className="flex items-center justify-center h-6 w-6 bg-secondary rounded-md">
              {content.type === "video" ? (
                <Video className="h-4 w-4 text-white/80" />
              ) : (
                <AudioWaveform className="h-4 w-4 text-white/80" />
              )}
            </div>
            <h3 className="font-semibold line-clamp-2 flex-1 mr-2">
              {content.title}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(content)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onDelete(content._id!)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {content.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{content.category}</span>
          <div className="flex items-center space-x-2">
            <span>•</span>
            <span>{content.views} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
