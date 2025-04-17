
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

    // For YouTube URLs, we'll create a download URL with the proper format
    // In a production app, you would use a proper YouTube downloader service or API
    const videoId = videoInfo.id;
    
    // This is a simplified approach - in production, you'd use a real downloader service
    // Here we're creating a direct download URL for demonstration purposes
    const downloadUrl = `https://lovable-youtube-downloader.vercel.app/api/download?videoId=${videoId}&format=${format.format}&quality=${format.quality}`;

    return new Response(
      JSON.stringify({ 
        success: true, 
        downloadUrl,
        fileName
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
