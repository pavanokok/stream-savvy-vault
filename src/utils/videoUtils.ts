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
): Promise<{ downloadUrl: string, fileName: string, videoId: string, format: string, quality: string, directDownload: boolean }> => {
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

    // For now, return YouTube URL since we need a separate service for yt-dlp
    return {
      downloadUrl: `https://www.youtube.com/watch?v=${videoInfo.id}`,
      fileName: `${videoInfo.title}.${format.format}`,
      videoId: videoInfo.id,
      format: format.format,
      quality: format.quality,
      directDownload: false
    };
  } catch (error) {
    console.error('Error recording download:', error);
    throw error;
  }
};

// Handle the actual video download
export const downloadVideo = async (videoInfo: { 
  downloadUrl: string, 
  fileName: string, 
  videoId: string,
  format: string,
  quality: string,
  directDownload?: boolean
}) => {
  try {
    // If it's a direct download, we'll use the browser's fetch API
    if (videoInfo.directDownload) {
      // Start the file download
      const response = await fetch(videoInfo.downloadUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = videoInfo.fileName;
      
      // Add to the DOM and trigger the download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return {
        success: true,
        message: "Download started"
      };
    } else {
      // Open YouTube as a fallback if direct download isn't available
      const youtubeWatchUrl = `https://www.youtube.com/watch?v=${videoInfo.videoId}`;
      window.open(youtubeWatchUrl, '_blank');
      
      return {
        success: true,
        message: "Opening YouTube video in a new tab. In a production app, this would download the actual video file."
      };
    }
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};
