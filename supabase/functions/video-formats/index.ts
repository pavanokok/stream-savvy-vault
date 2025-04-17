
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    if (!isYouTube) {
      return new Response(
        JSON.stringify({ error: 'Only YouTube URLs are supported for format retrieval' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get YouTube video ID
    let videoId;
    if (url.includes('youtube.com/watch?v=')) {
      videoId = new URL(url).searchParams.get('v');
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }

    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Could not extract YouTube video ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For demonstration, we'll provide a limited set of formats
    // In a real implementation, you'd need to use a proper API to get this info
    const availableFormats = [
      {
        id: 'mp4-360p',
        label: 'MP4 - 360p',
        format: 'mp4',
        quality: '360p',
        size: '10 MB',
        url: `https://www.youtube.com/watch?v=${videoId}`
      },
      {
        id: 'mp4-720p',
        label: 'MP4 - 720p',
        format: 'mp4',
        quality: '720p',
        size: '25 MB',
        url: `https://www.youtube.com/watch?v=${videoId}`
      },
      {
        id: 'webm-360p',
        label: 'WEBM - 360p',
        format: 'webm',
        quality: '360p',
        size: '8 MB',
        url: `https://www.youtube.com/watch?v=${videoId}`
      },
      {
        id: 'webm-720p',
        label: 'WEBM - 720p',
        format: 'webm',
        quality: '720p',
        size: '20 MB',
        url: `https://www.youtube.com/watch?v=${videoId}`
      },
      {
        id: 'mp4-audio',
        label: 'MP4 - Audio Only',
        format: 'mp4',
        quality: 'audio',
        size: '3 MB',
        url: `https://www.youtube.com/watch?v=${videoId}`
      }
    ];

    return new Response(
      JSON.stringify(availableFormats),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching video formats:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch video formats' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
