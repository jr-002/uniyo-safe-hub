
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChatGroq } from "https://esm.sh/@langchain/groq@0.0.14";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const { description, location, reportType } = await req.json();

    const chatModel = new ChatGroq({
      apiKey: groqApiKey,
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });

    const analysisPrompt = `
Analyze this campus incident report and provide a structured assessment:

Report Description: "${description}"
Location: "${location}"
Reported Type: "${reportType}"

Provide analysis in this JSON format:
{
  "suggestedCategory": "theft|harassment|suspicious|infrastructure|safety|other",
  "priorityLevel": "low|medium|high|critical",
  "riskAssessment": "brief risk assessment in 1-2 sentences",
  "recommendedActions": ["action1", "action2"],
  "tags": ["tag1", "tag2", "tag3"]
}

Consider:
- Urgency and safety implications
- Campus security protocols
- Student welfare priorities
- Resource allocation needs

Response must be valid JSON only.
`;

    const response = await chatModel.invoke(analysisPrompt);
    
    try {
      const analysis = JSON.parse(response.content as string);
      
      return new Response(JSON.stringify({
        analysis,
        confidence: "high",
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return new Response(JSON.stringify({
        analysis: {
          suggestedCategory: reportType || "other",
          priorityLevel: "medium",
          riskAssessment: "Unable to analyze - requires manual review",
          recommendedActions: ["Manual review required", "Follow standard protocols"],
          tags: ["needs-review"]
        },
        confidence: "low",
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in ai-incident-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
