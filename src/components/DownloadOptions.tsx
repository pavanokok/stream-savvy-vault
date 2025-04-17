
import React, { useState } from "react";
import { Check, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DownloadOptionsProps {
  videoUrl: string;
}

const DownloadOptions = ({ videoUrl }: DownloadOptionsProps) => {
  const [format, setFormat] = useState("mp4");
  const [quality, setQuality] = useState("720p");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    
    // In a real app, this would trigger an API call to download the video
    // For now, we'll just simulate a delay and show a success message
    
    toast.info(`Starting download in ${format} format at ${quality} quality`);
    
    setTimeout(() => {
      setIsDownloading(false);
      toast.success("Download completed successfully!");
    }, 3000);
  };

  return (
    <Card className="bg-nova-dark-surface border-nova-purple/20 p-6 rounded-xl">
      <h2 className="text-xl font-semibold text-white mb-4">Download Options</h2>
      
      <div className="space-y-6">
        {/* Format selection */}
        <div>
          <h3 className="text-sm font-medium text-nova-gray mb-3">Format</h3>
          <RadioGroup 
            value={format} 
            onValueChange={setFormat}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {["mp4", "webm", "mp3", "aac"].map((item) => (
              <div key={item} className="relative">
                <RadioGroupItem 
                  value={item} 
                  id={`format-${item}`} 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={`format-${item}`}
                  className="flex items-center justify-center px-3 py-2 border rounded-md text-center 
                    border-nova-gray/20 bg-nova-dark peer-data-[state=checked]:border-nova-purple 
                    peer-data-[state=checked]:text-nova-purple cursor-pointer transition-all text-sm"
                >
                  <div className="flex items-center">
                    {format === item && <Check className="w-3 h-3 mr-2" />}
                    <span>{item.toUpperCase()}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Quality selection */}
        <div>
          <h3 className="text-sm font-medium text-nova-gray mb-3">Quality</h3>
          <RadioGroup 
            value={quality} 
            onValueChange={setQuality}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {["360p", "480p", "720p", "1080p"].map((item) => (
              <div key={item} className="relative">
                <RadioGroupItem 
                  value={item} 
                  id={`quality-${item}`} 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={`quality-${item}`}
                  className="flex items-center justify-center px-3 py-2 border rounded-md text-center 
                    border-nova-gray/20 bg-nova-dark peer-data-[state=checked]:border-nova-purple 
                    peer-data-[state=checked]:text-nova-purple cursor-pointer transition-all text-sm"
                >
                  <div className="flex items-center">
                    {quality === item && <Check className="w-3 h-3 mr-2" />}
                    <span>{item}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <Button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full bg-nova-purple hover:bg-nova-purple/90 text-white py-6 rounded-xl flex items-center justify-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>{isDownloading ? "Downloading..." : "Download Now"}</span>
        </Button>
      </div>
    </Card>
  );
};

export default DownloadOptions;
