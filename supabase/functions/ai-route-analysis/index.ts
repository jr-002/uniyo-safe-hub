
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, duration, currentLocation, userProfile } = await req.json();
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not found');
    }

    const prompt = `You are a campus safety AI assistant for University of Uyo. Analyze this travel route and provide safety intelligence.

User Profile: ${JSON.stringify(userProfile)}
Current Location: ${currentLocation || 'Campus location'}
Destination: ${destination}
Planned Duration: ${duration} minutes
Current Time: ${new Date().toLocaleString()}

Provide a comprehensive route analysis in the following JSON format:
{
  "riskLevel": "low|medium|high|critical",
  "riskFactors": ["factor1", "factor2"],
  "safetyTips": ["tip1", "tip2"],
  "recommendedDuration": number_in_minutes,
  "alternativeRoutes": ["route1", "route2"],
  "emergencyContacts": ["contact1", "contact2"],
  "checkpointSuggestions": ["checkpoint1", "checkpoint2"],
  "timeOfDayRisk": "low|medium|high",
  "weatherConsiderations": "brief_weather_advice",
  "campusSpecificAdvice": "uniuyo_specific_safety_tips"
}

Consider factors like:
- Time of day safety on campus
- Common campus routes and their safety levels
- Weather conditions if applicable
- Duration appropriateness for the route
- Campus security presence areas
- Well-lit vs poorly lit areas
- Popular vs isolated routes`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a campus safety AI that provides intelligent route analysis for University of Uyo students. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0]?.message?.content;

    if (!analysisText) {
      throw new Error('No analysis generated');
    }

    // Parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      // Fallback analysis if JSON parsing fails
      analysis = {
        riskLevel: 'medium',
        riskFactors: ['Unable to analyze route details'],
        safetyTips: ['Stay on well-lit paths', 'Keep emergency contacts ready'],
        recommendedDuration: duration + 10,
        alternativeRoutes: ['Main campus route'],
        emergencyContacts: ['Campus Security: 080-SECURITY'],
        checkpointSuggestions: ['Library', 'Student Center'],
        timeOfDayRisk: 'medium',
        weatherConsiderations: 'Check weather conditions',
        campusSpecificAdvice: 'Stay alert and inform someone of your route'
      };
    }

    return new Response(JSON.stringify({
      analysis,
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-route-analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: {
        riskLevel: 'medium',
        riskFactors: ['Analysis unavailable'],
        safetyTips: ['Use standard safety precautions'],
        recommendedDuration: 30,
        alternativeRoutes: [],
        emergencyContacts: ['Campus Security'],
        checkpointSuggestions: [],
        timeOfDayRisk: 'medium',
        weatherConsiderations: 'Check current conditions',
        campusSpecificAdvice: 'Follow campus safety guidelines'
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
