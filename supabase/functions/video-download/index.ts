
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple YouTube video ID extractor
function extractVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Create a direct download link (this is a mock implementation)
// In production, you would integrate with a real YouTube download API
function getDirectDownloadUrl(videoId: string, format: string, quality: string): string {
  // For demonstration purposes, we're using a direct video stream URL
  // In a real implementation, you would call a YouTube download service API
  
  // Here we use YouTube's direct video stream
  // NOTE: This approach requires additional server-side processing in production
  // as YouTube doesn't provide direct download links without proper handling
  
  // For MP4 format, we can use a placeholder that indicates format and quality
  const baseUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/";
  
  // Use sample videos based on quality
  // These are actual MP4 files that will download when accessed
  let videoFile = "BigBuckBunny.mp4"; // Default to a medium size sample
  
  if (quality === "1080p" || quality === "720p") {
    videoFile = "ElephantsDream.mp4"; // Higher quality sample
  } else if (quality === "360p" || quality === "240p") {
    videoFile = "ForBiggerBlazes.mp4"; // Lower quality sample
  }
  
  return `${baseUrl}${videoFile}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoInfo, format, userId } = await req.json();
    
    if (!videoInfo || !format) {
      return new Response(
        JSON.stringify({ error: 'Video info and format are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate safe filename
    const fileName = `${videoInfo.title.replace(/[^\w\s]/gi, '')}.${format.format}`;

    // Record download in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert download record
    const { error } = await supabase
      .from('download_history')
      .insert({
        user_id: userId,
        video_title: videoInfo.title,
        video_url: videoInfo.url,
        thumbnail: videoInfo.thumbnail,
        format: format.format,
        quality: format.quality,
        size: format.size,
        status: 'completed'
      });

    if (error) {
      console.error('Error recording download:', error);
    }

    // Get a direct download URL - in production this would be from a YouTube download service
    const videoId = videoInfo.id || extractVideoId(videoInfo.url);
    const downloadUrl = getDirectDownloadUrl(videoId, format.format, format.quality);

    return new Response(
      JSON.stringify({ 
        success: true, 
        downloadUrl,
        fileName,
        videoId,
        format: format.format,
        quality: format.quality,
        directDownload: true // Flag to indicate this is a direct download
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing download:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process download' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
