
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

      // Fetch basic video info from YouTube oEmbed API
      const oembedResponse = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      
      if (!oembedResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'Could not fetch YouTube video information' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const oembedData = await oembedResponse.json();
      
      // Fetch additional info from the video page
      const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
      const videoPageHtml = await videoPageResponse.text();
      
      // Extract duration (approximate)
      let duration = "Unknown";
      const durationMatch = videoPageHtml.match(/"lengthSeconds":"(\d+)"/);
      if (durationMatch && durationMatch[1]) {
        const seconds = parseInt(durationMatch[1]);
        duration = formatDuration(seconds);
      }
      
      videoInfo = {
        id: videoId,
        title: oembedData.title,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        duration: duration,
        author: oembedData.author_name,
        url: url
      };
    } else if (isInstagram) {
      // For Instagram, we would need a different approach
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
