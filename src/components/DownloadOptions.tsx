
import React, { useState, useEffect } from "react";
import { Check, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  getAvailableFormats, 
  downloadVideo, 
  recordDownload,
  DownloadFormat
} from "@/utils/videoUtils";
import { supabase } from "@/integrations/supabase/client";

interface DownloadOptionsProps {
  videoUrl: string;
  videoInfo: any;
}

const DownloadOptions = ({ videoUrl, videoInfo }: DownloadOptionsProps) => {
  const [formats, setFormats] = useState<DownloadFormat[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [availableFormats, setAvailableFormats] = useState<string[]>([]);

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
      setIsLoading(true);
      try {
        const availableFormats = await getAvailableFormats(videoUrl);
        setFormats(availableFormats);
        
        // Extract unique format types and qualities
        const formatTypes = [...new Set(availableFormats.map(format => format.format))];
        const qualityTypes = [...new Set(availableFormats.map(format => format.quality))];
        
        setAvailableFormats(formatTypes);
        setAvailableQualities(qualityTypes);
        
        // Auto-select first format and quality if available
        if (formatTypes.length > 0) {
          setSelectedFormat(formatTypes[0]);
        }
        if (qualityTypes.length > 0) {
          setSelectedQuality(qualityTypes[0]);
        }
      } catch (error) {
        console.error('Error loading formats:', error);
        toast.error(error instanceof Error ? error.message : 'Could not load video formats');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (videoUrl) {
      loadFormats();
    }
  }, [videoUrl]);

  const handleDownload = async () => {
    if (!selectedFormat || !selectedQuality) {
      toast.error('Please select a format and quality');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(10); // Start progress
    
    try {
      // Find the selected format object
      const selectedFormatObj = formats.find(
        f => f.format === selectedFormat && f.quality === selectedQuality
      );
      
      if (!selectedFormatObj) {
        throw new Error('Selected format not available');
      }
      
      setDownloadProgress(30); // Update progress
      
      // Record download and get download URL
      const downloadData = await recordDownload(
        videoInfo,
        selectedFormatObj,
        user?.id
      );
      
      setDownloadProgress(60); // Update progress
      
      // Start the actual download
      await downloadVideo(
        downloadData.downloadUrl,
        downloadData.fileName
      );
      
      setDownloadProgress(100); // Complete progress
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error instanceof Error ? error.message : 'Download failed');
    } finally {
      // Reset download state after a delay to show the complete progress
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1500);
    }
  };

  // Get file size for the selected format and quality
  const getSelectedFormatSize = (): string => {
    const selectedFormatObj = formats.find(
      f => f.format === selectedFormat && f.quality === selectedQuality
    );
    return selectedFormatObj?.size || 'Unknown';
  };

  return (
    <Card className="bg-nova-dark-surface border-nova-purple/20 p-6 rounded-xl">
      <h2 className="text-xl font-semibold text-white mb-4">Download Options</h2>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-nova-purple mb-4"></div>
          <p className="text-nova-gray">Loading available formats...</p>
        </div>
      ) : formats.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-nova-gray">No formats available for this video</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Format selection */}
          <div>
            <h3 className="text-sm font-medium text-nova-gray mb-3">Format</h3>
            <RadioGroup 
              value={selectedFormat} 
              onValueChange={setSelectedFormat}
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {availableFormats.map((format) => (
                <div key={format} className="relative">
                  <RadioGroupItem 
                    value={format} 
                    id={`format-${format}`} 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor={`format-${format}`}
                    className="flex items-center justify-center px-3 py-2 border rounded-md text-center 
                      border-nova-gray/20 bg-nova-dark peer-data-[state=checked]:border-nova-purple 
                      peer-data-[state=checked]:text-nova-purple cursor-pointer transition-all text-sm"
                  >
                    <div className="flex items-center">
                      {selectedFormat === format && <Check className="w-3 h-3 mr-2" />}
                      <span>{format.toUpperCase()}</span>
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
              {availableQualities.map((quality) => (
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
          
          {selectedFormat && selectedQuality && (
            <div className="bg-nova-dark/50 p-3 rounded-lg">
              <p className="text-sm text-nova-gray flex justify-between">
                <span>File size:</span>
                <span className="text-white">{getSelectedFormatSize()}</span>
              </p>
            </div>
          )}
          
          {isDownloading && (
            <div className="space-y-2">
              <Progress value={downloadProgress} className="h-2" />
              <p className="text-sm text-nova-gray text-center">
                {downloadProgress < 100 ? 'Preparing download...' : 'Starting download...'}
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleDownload}
            disabled={isDownloading || !selectedFormat || !selectedQuality}
            className="w-full bg-nova-purple hover:bg-nova-purple/90 text-white py-6 rounded-xl flex items-center justify-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>{isDownloading ? "Downloading..." : "Download Now"}</span>
          </Button>
        </div>
      )}
    </Card>
  );
};

export default DownloadOptions;
