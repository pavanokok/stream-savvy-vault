
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
  try {
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
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw error;
  }
};

// Get actual available formats from our Supabase Edge Function
export const getAvailableFormats = async (url: string): Promise<DownloadFormat[]> => {
  try {
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
  } catch (error) {
    console.error('Error fetching video formats:', error);
    throw error;
  }
};

// Record download in Supabase using our Edge Function
export const recordDownload = async (
  videoInfo: VideoInfo, 
  format: DownloadFormat, 
  userId?: string
): Promise<{ downloadUrl: string, fileName: string }> => {
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
export const downloadVideo = async (videoUrl: string, filename: string) => {
  try {
    // Start the file download using browser's download capability
    const response = await fetch(videoUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create a link element
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    
    // Click the link to trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    
    return true;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};
