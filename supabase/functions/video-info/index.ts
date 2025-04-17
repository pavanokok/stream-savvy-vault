
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import ytdl from 'https://esm.sh/ytdl-core@4.11.5';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if URL is from YouTube
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    // Check if URL is from Instagram
    const isInstagram = url.includes('instagram.com');

    if (!isYouTube && !isInstagram) {
      return new Response(
        JSON.stringify({ error: 'Only YouTube and Instagram URLs are supported' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let videoInfo;

    if (isYouTube) {
      // Get info from YouTube
      const info = await ytdl.getInfo(url);
      
      videoInfo = {
        id: info.videoDetails.videoId,
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails[0]?.url || '',
        duration: formatDuration(parseInt(info.videoDetails.lengthSeconds)),
        author: info.videoDetails.author.name,
        url: url
      };
    } else if (isInstagram) {
      // For Instagram, we would need a different library or API
      // For now, return a placeholder with the URL for demonstration
      return new Response(
        JSON.stringify({ error: 'Instagram videos are not yet supported' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(videoInfo),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching video info:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch video info' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to format duration in seconds to MM:SS
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
