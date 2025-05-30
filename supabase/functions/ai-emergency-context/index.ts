
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
import { ChatGroq } from "https://esm.sh/@langchain/groq@0.0.14";

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
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const { userId, location, emergencyType, additionalContext } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, department, emergency_contact')
      .eq('user_id', userId)
      .single();

    // Get recent incident reports in the area for context
    const { data: recentIncidents } = await supabase
      .from('incident_reports')
      .select('category, description, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(3);

    // Initialize Groq LLM
    const chatModel = new ChatGroq({
      apiKey: groqApiKey,
      model: "mixtral-8x7b-32768",
      temperature: 0.3,
    });

    const contextPrompt = `
You are an AI assistant for UniUyo Campus Emergency Response. Generate a concise emergency context report for first responders.

User Information:
- Name: ${profile?.full_name || 'Unknown'}
- Department: ${profile?.department || 'Unknown'}
- Emergency Contact: ${profile?.emergency_contact || 'None on file'}

Emergency Details:
- Type: ${emergencyType || 'General Emergency'}
- Location: ${location?.latitude && location?.longitude ? `${location.latitude}, ${location.longitude}` : 'Location unavailable'}
- Additional Context: ${additionalContext || 'None provided'}

Recent Campus Incidents (last 24h):
${recentIncidents?.map(incident => `- ${incident.category}: ${incident.description.substring(0, 100)}...`).join('\n') || 'No recent incidents'}

Generate a brief, professional emergency context report (2-3 sentences) that would help campus security and emergency responders assess the situation and respond appropriately. Include any relevant safety considerations.
`;

    const response = await chatModel.invoke(contextPrompt);
    
    // Log the emergency context generation
    console.log('Emergency context generated for user:', userId);

    return new Response(JSON.stringify({ 
      emergencyContext: response.content,
      timestamp: new Date().toISOString(),
      userProfile: {
        name: profile?.full_name,
        department: profile?.department,
        emergencyContact: profile?.emergency_contact
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-emergency-context function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      emergencyContext: 'AI context generation unavailable. Please proceed with standard emergency protocols.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
