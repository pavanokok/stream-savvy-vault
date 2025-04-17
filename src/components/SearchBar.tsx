
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SearchBar = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const clearInput = () => {
    setUrl("");
  };

  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error("Please enter a video URL");
      return;
    }

    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }

    // For demonstration, we'll check if it's YouTube or Instagram
    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
    const isInstagram = url.includes("instagram.com");

    if (!isYouTube && !isInstagram) {
      toast.error("Only YouTube and Instagram URLs are supported");
      return;
    }

    setIsLoading(true);

    // In a real app, we would fetch video info here
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock data - in a real app, this would come from an API
      const videoData = {
        id: "sample-id",
        title: "Sample Video Title",
        thumbnail: "https://picsum.photos/seed/video/640/360",
        duration: "10:30",
        author: "Sample Author",
        url: url
      };
      
      // Navigate to preview page with video data
      navigate("/preview", { state: { video: videoData } });
    }, 1500);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-nova-gray">
          <Search className="h-5 w-5" />
        </div>
        
        <Input
          type="text"
          placeholder="Paste YouTube or Instagram video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="pl-10 pr-20 py-6 bg-nova-dark-surface text-white border-nova-purple/30 focus-visible:ring-nova-purple rounded-xl"
        />
        
        {url && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-24 text-nova-gray hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        <Button
          type="submit"
          className="absolute right-3 bg-nova-purple hover:bg-nova-purple/90 text-white rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Download"}
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
