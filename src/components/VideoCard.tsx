
import React from "react";
import { Card } from "@/components/ui/card";
import { Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    author: string;
    url: string;
  };
}

const VideoCard = ({ video }: VideoCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/preview", { state: { video } });
  };

  return (
    <Card className="video-card bg-nova-dark-surface border-nova-purple/20 overflow-hidden rounded-xl">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-medium line-clamp-2 mb-2" title={video.title}>
          {video.title}
        </h3>
        
        <div className="flex items-center text-nova-gray text-sm mb-3">
          <User className="h-3 w-3 mr-1" />
          <span>{video.author}</span>
        </div>
        
        <Button 
          onClick={handleClick}
          className="w-full bg-nova-purple hover:bg-nova-purple/90 text-white"
        >
          Download
        </Button>
      </div>
    </Card>
  );
};

export default VideoCard;
