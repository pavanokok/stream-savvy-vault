
import { supabase } from "@/integrations/supabase/client";

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  url: string;
}

export interface DownloadFormat {
  id: string;
  label: string;
  format: string;
  quality: string;
  size: string;
}

// Simulate fetching video info from a real source
export const fetchVideoInfo = async (url: string): Promise<VideoInfo> => {
  // In a real app, this would call an external API or backend service
  const response = await fetch(`/api/video-info?url=${encodeURIComponent(url)}`);
  
  if (!response.ok) {
    throw new Error('Could not fetch video information');
  }

  return response.json();
};

// Get actual available formats for a video
export const getAvailableFormats = async (url: string): Promise<DownloadFormat[]> => {
  // In a real app, this would call an external service to get actual formats
  const response = await fetch(`/api/video-formats?url=${encodeURIComponent(url)}`);
  
  if (!response.ok) {
    throw new Error('Could not fetch video formats');
  }

  return response.json();
};

// Record download in Supabase
export const recordDownload = async (
  videoInfo: VideoInfo, 
  format: DownloadFormat, 
  userId?: string
) => {
  const { data, error } = await supabase
    .from('download_history')
    .insert({
      user_id: userId,
      video_title: videoInfo.title,
      video_url: videoInfo.url,
      thumbnail: videoInfo.thumbnail,
      format: format.format,
      quality: format.quality,
      status: 'completed'
    });

  if (error) {
    console.error('Error recording download:', error);
    throw error;
  }

  return data;
};

// Trigger browser download
export const downloadVideo = (videoUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = videoUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
