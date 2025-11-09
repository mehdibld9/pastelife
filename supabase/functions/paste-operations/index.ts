// Supabase Edge Function for secure paste operations
// This demonstrates how to handle private paste access and mutations server-side

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const operation = url.searchParams.get('operation');
    const slug = url.searchParams.get('slug');

    // View private paste
    if (operation === 'view' && slug) {
      const { token } = await req.json();

      const { data, error } = await supabase
        .from('pastes')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: 'Paste not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify secret token for private pastes
      if (data.privacy === 'private' && data.secret_token !== token) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Increment view count
      await supabase
        .from('pastes')
        .update({ views: data.views + 1 })
        .eq('slug', slug);

      const { secret_token, ...pasteData } = data;

      return new Response(
        JSON.stringify({ ...pasteData, views: data.views + 1 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Edit paste
    if (operation === 'edit' && slug) {
      const { token, title, content, language, privacy } = await req.json();

      // Verify token
      const { data: existingPaste } = await supabase
        .from('pastes')
        .select('secret_token')
        .eq('slug', slug)
        .single();

      if (!existingPaste || existingPaste.secret_token !== token) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabase
        .from('pastes')
        .update({ title, content, language, privacy })
        .eq('slug', slug)
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to update paste' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { secret_token, ...pasteData } = data;

      return new Response(
        JSON.stringify(pasteData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Delete paste
    if (operation === 'delete' && slug) {
      const { token } = await req.json();

      // Verify token
      const { data: existingPaste } = await supabase
        .from('pastes')
        .select('secret_token')
        .eq('slug', slug)
        .single();

      if (!existingPaste || existingPaste.secret_token !== token) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error } = await supabase
        .from('pastes')
        .delete()
        .eq('slug', slug);

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to delete paste' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid operation' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
