
import React, { useState, useEffect } from "react";
import { Check, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  getAvailableFormats, 
  downloadVideo, 
  recordDownload 
} from "@/utils/videoUtils";
import { supabase } from "@/integrations/supabase/client";

interface DownloadOptionsProps {
  videoUrl: string;
}

const DownloadOptions = ({ videoUrl }: DownloadOptionsProps) => {
  const [formats, setFormats] = useState<any[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Get current user session
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);
    };
    fetchUser();
  }, []);

  // Fetch available formats when component mounts
  useEffect(() => {
    const loadFormats = async () => {
      try {
        const availableFormats = await getAvailableFormats(videoUrl);
        setFormats(availableFormats);
      } catch (error) {
        toast.error('Could not load video formats');
      }
    };
    loadFormats();
  }, [videoUrl]);

  const handleDownload = async () => {
    if (!selectedFormat || !selectedQuality) {
      toast.error('Please select a format and quality');
      return;
    }

    setIsDownloading(true);
    
    try {
      // In a real app, you'd have an actual download URL
      const mockDownloadUrl = `https://example.com/download/${selectedFormat}-${selectedQuality}`;
      
      downloadVideo(mockDownloadUrl, `video.${selectedFormat}`);
      
      // Record download in Supabase
      await recordDownload(
        {
          id: 'mock-id', 
          title: 'Sample Video', 
          thumbnail: 'https://picsum.photos/200', 
          duration: '10:00', 
          author: 'Sample Author', 
          url: videoUrl
        }, 
        {
          id: `${selectedFormat}-${selectedQuality}`,
          label: `${selectedFormat.toUpperCase()} - ${selectedQuality}`,
          format: selectedFormat,
          quality: selectedQuality,
          size: '25 MB'
        },
        user?.id
      );

      toast.success('Download started!');
    } catch (error) {
      toast.error('Download failed');
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="bg-nova-dark-surface border-nova-purple/20 p-6 rounded-xl">
      <h2 className="text-xl font-semibold text-white mb-4">Download Options</h2>
      
      <div className="space-y-6">
        {/* Format selection */}
        <div>
          <h3 className="text-sm font-medium text-nova-gray mb-3">Format</h3>
          <RadioGroup 
            value={selectedFormat} 
            onValueChange={setSelectedFormat}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {formats.map((format) => (
              <div key={format.format} className="relative">
                <RadioGroupItem 
                  value={format.format} 
                  id={`format-${format.format}`} 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={`format-${format.format}`}
                  className="flex items-center justify-center px-3 py-2 border rounded-md text-center 
                    border-nova-gray/20 bg-nova-dark peer-data-[state=checked]:border-nova-purple 
                    peer-data-[state=checked]:text-nova-purple cursor-pointer transition-all text-sm"
                >
                  <div className="flex items-center">
                    {selectedFormat === format.format && <Check className="w-3 h-3 mr-2" />}
                    <span>{format.format.toUpperCase()}</span>
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
            value={selectedQuality} 
            onValueChange={setSelectedQuality}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {["360p", "480p", "720p", "1080p"].map((quality) => (
              <div key={quality} className="relative">
                <RadioGroupItem 
                  value={quality} 
                  id={`quality-${quality}`} 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={`quality-${quality}`}
                  className="flex items-center justify-center px-3 py-2 border rounded-md text-center 
                    border-nova-gray/20 bg-nova-dark peer-data-[state=checked]:border-nova-purple 
                    peer-data-[state=checked]:text-nova-purple cursor-pointer transition-all text-sm"
                >
                  <div className="flex items-center">
                    {selectedQuality === quality && <Check className="w-3 h-3 mr-2" />}
                    <span>{quality}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <Button 
          onClick={handleDownload}
          disabled={isDownloading || !selectedFormat || !selectedQuality}
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
