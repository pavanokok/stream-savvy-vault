
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
  url: string;
}

// Fetch video info from our Supabase Edge Function
export const fetchVideoInfo = async (url: string): Promise<VideoInfo> => {
  const { data, error } = await supabase.functions.invoke('video-info', {
    body: { url }
  });
  
  if (error) {
    console.error('Error fetching video info:', error);
    throw new Error('Could not fetch video information');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

// Get actual available formats from our Supabase Edge Function
export const getAvailableFormats = async (url: string): Promise<DownloadFormat[]> => {
  const { data, error } = await supabase.functions.invoke('video-formats', {
    body: { url }
  });
  
  if (error) {
    console.error('Error fetching video formats:', error);
    throw new Error('Could not fetch video formats');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

// Record download in Supabase using our Edge Function
export const recordDownload = async (
  videoInfo: VideoInfo, 
  format: DownloadFormat, 
  userId?: string
) => {
  const { data, error } = await supabase.functions.invoke('video-download', {
    body: { videoInfo, format, userId }
  });
  
  if (error) {
    console.error('Error recording download:', error);
    throw error;
  }

  if (data.error) {
    throw new Error(data.error);
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
