
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VideoInfo } from "@/lib/types";
import { Clock, Calendar, Eye } from "lucide-react";

interface VideoInfoCardProps {
  videoInfo: VideoInfo;
}

const VideoInfoCard: React.FC<VideoInfoCardProps> = ({ videoInfo }) => {
  return (
    <Card className="w-full overflow-hidden border-none shadow-md">
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={videoInfo.thumbnailUrl}
          alt={videoInfo.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-xl mb-2 line-clamp-2">{videoInfo.title}</h3>
        <p className="text-muted-foreground mb-3">{videoInfo.creator}</p>
        
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{videoInfo.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{videoInfo.publishedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{videoInfo.viewCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoInfoCard;
