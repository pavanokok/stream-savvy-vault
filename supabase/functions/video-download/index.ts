
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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

    // Since we don't have a real YouTube downloader backend yet, we'll use a direct YouTube URL
    // with a format indicator for demo purposes. In production, this would be a real download URL.
    const videoId = videoInfo.id;
    
    // For demonstration, we'll use a YouTube embed URL which at least won't throw a CORS error
    // This doesn't actually download the video, but in production you'd integrate with a
    // proper YouTube download service here
    const downloadUrl = `https://www.youtube.com/embed/${videoId}`;

    return new Response(
      JSON.stringify({ 
        success: true, 
        downloadUrl,
        fileName,
        videoId,
        format: format.format,
        quality: format.quality
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
