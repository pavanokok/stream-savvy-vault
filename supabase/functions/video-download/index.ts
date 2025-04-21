
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';
import { download } from 'https://deno.land/x/download@v2.0.2/mod.ts';
import * as path from "https://deno.land/std@0.204.0/path/mod.ts";

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

    // Here we would use yt-dlp to get the actual download URL
    // Since we can't directly use yt-dlp in Deno/Edge Functions, 
    // we'll need to set up a separate service for this
    // For now, we'll return a message indicating this limitation
    
    return new Response(
      JSON.stringify({ 
        error: "Direct downloads using yt-dlp require a separate service. Edge Functions have limitations with binary dependencies.",
        message: "Please set up a dedicated server with yt-dlp for actual YouTube downloads."
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing download:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process download' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
