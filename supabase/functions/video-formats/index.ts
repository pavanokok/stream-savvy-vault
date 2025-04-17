
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import ytdl from 'https://esm.sh/ytdl-core@4.11.5';

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

    // Get info from YouTube
    const info = await ytdl.getInfo(url);
    
    // Process formats
    const availableFormats = [];
    const formatTypes = ['mp4', 'webm'];
    const qualities = ['144p', '240p', '360p', '480p', '720p', '1080p'];
    
    formatTypes.forEach(format => {
      qualities.forEach(quality => {
        // Find formats matching this combination
        const matchingFormats = info.formats.filter(f => 
          f.container === format && 
          f.qualityLabel === quality &&
          f.hasVideo &&
          f.hasAudio
        );
        
        if (matchingFormats.length > 0) {
          // Take the first matching format
          const selectedFormat = matchingFormats[0];
          
          availableFormats.push({
            id: `${format}-${quality}`,
            label: `${format.toUpperCase()} - ${quality}`,
            format: format,
            quality: quality,
            size: formatBytes(selectedFormat.contentLength),
            url: selectedFormat.url
          });
        }
      });
    });
    
    // If no combined formats, try to add video-only formats
    if (availableFormats.length === 0) {
      formatTypes.forEach(format => {
        qualities.forEach(quality => {
          const matchingFormats = info.formats.filter(f => 
            f.container === format && 
            f.qualityLabel === quality &&
            f.hasVideo
          );
          
          if (matchingFormats.length > 0) {
            const selectedFormat = matchingFormats[0];
            
            availableFormats.push({
              id: `${format}-${quality}`,
              label: `${format.toUpperCase()} - ${quality} (Video Only)`,
              format: format,
              quality: quality,
              size: formatBytes(selectedFormat.contentLength),
              url: selectedFormat.url
            });
          }
        });
      });
    }

    // Add audio-only formats
    const audioFormats = info.formats.filter(f => 
      f.hasAudio && !f.hasVideo && 
      (f.container === 'mp4' || f.container === 'webm')
    );

    if (audioFormats.length > 0) {
      audioFormats.forEach(format => {
        availableFormats.push({
          id: `${format.container}-audio`,
          label: `${format.container.toUpperCase()} - Audio Only`,
          format: format.container,
          quality: 'audio',
          size: formatBytes(format.contentLength),
          url: format.url
        });
      });
    }

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

// Helper function to format bytes
function formatBytes(bytes: string | null): string {
  if (!bytes) return 'Unknown';
  
  const bytesNum = parseInt(bytes);
  if (isNaN(bytesNum)) return 'Unknown';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytesNum === 0) return '0 Byte';
  
  const i = Math.floor(Math.log(bytesNum) / Math.log(1024));
  return Math.round(bytesNum / Math.pow(1024, i)) + ' ' + sizes[i];
}
