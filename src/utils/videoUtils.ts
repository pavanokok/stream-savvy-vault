
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
): Promise<{ downloadUrl: string, fileName: string, videoId: string, format: string, quality: string }> => {
  try {
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
  } catch (error) {
    console.error('Error recording download:', error);
    throw error;
  }
};

// For demo purposes, we'll create a simulated download function
// In a real app, this would connect to an actual YouTube download service
export const downloadVideo = async (videoInfo: { 
  downloadUrl: string, 
  fileName: string, 
  videoId: string,
  format: string,
  quality: string
}) => {
  try {
    // For demonstration purposes, we'll use a direct YouTube link
    // This is a workaround since we don't have a real YouTube downloader service yet
    
    // In a real application, you would fetch the video from a proper YouTube
    // download service API and then process the file download
    
    // Create a direct YouTube watch link as a fallback
    const youtubeWatchUrl = `https://www.youtube.com/watch?v=${videoInfo.videoId}`;
    
    // Open YouTube in a new tab as a fallback
    window.open(youtubeWatchUrl, '_blank');
    
    // Show a message to the user
    return {
      success: true,
      message: "Opening YouTube video in a new tab. In a production app, this would download the actual video file."
    };
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};
