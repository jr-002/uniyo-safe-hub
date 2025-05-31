
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchQuery, items, searchType = 'both' } = await req.json();
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Prepare items data for AI analysis
    const itemsContext = items.map((item: any) => ({
      id: item.id,
      type: item.type || item.item_name,
      description: item.description,
      location: item.location || item.location_lost,
      timeReported: item.timeReported || item.timeFound || item.created_at,
      status: item.status,
      metadata: {
        name: item.name || item.finderName,
        contact: item.contact || item.contact_info
      }
    }));

    const prompt = `You are an AI assistant specialized in matching lost and found items. 

Search Query: "${searchQuery}"
Search Type: ${searchType} (lost, found, or both)

Available Items:
${JSON.stringify(itemsContext, null, 2)}

Your task:
1. Analyze the search query semantically to understand what the user is looking for
2. Match items based on:
   - Item type and description similarity
   - Location proximity or relevance
   - Time relevance
   - Contextual clues (colors, brands, distinctive features)
3. Score each item from 0-100 based on relevance
4. Consider synonyms and related terms (e.g., "phone" matches "mobile", "iPhone", "smartphone")
5. Look for contextual matches (e.g., "left in library" matches items found in library)

Return a JSON response with this exact structure:
{
  "matches": [
    {
      "id": "item_id",
      "score": 85,
      "reasoning": "Brief explanation of why this item matches",
      "highlights": ["specific", "matching", "keywords"]
    }
  ],
  "suggestions": [
    "Alternative search terms or tips"
  ],
  "summary": "Brief summary of search results"
}

Only include items with score >= 30. Sort by score descending.`;

    console.log('Sending request to Groq for semantic search...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at semantic search and item matching. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from Groq API');
    }

    console.log('Groq response:', content);

    // Parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse Groq response as JSON:', content);
      // Fallback response
      analysis = {
        matches: [],
        suggestions: ["Try using more descriptive terms", "Include color, brand, or distinctive features"],
        summary: "Unable to process search query effectively"
      };
    }

    // Validate and clean the analysis
    if (!analysis.matches) analysis.matches = [];
    if (!analysis.suggestions) analysis.suggestions = [];
    if (!analysis.summary) analysis.summary = "Search completed";

    // Ensure all matches have required fields
    analysis.matches = analysis.matches.map((match: any) => ({
      id: match.id,
      score: Math.max(0, Math.min(100, match.score || 0)),
      reasoning: match.reasoning || "Potential match found",
      highlights: Array.isArray(match.highlights) ? match.highlights : []
    }));

    console.log('Semantic search completed:', analysis);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-semantic-search function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        matches: [],
        suggestions: ["Try a simpler search term", "Check spelling and try again"],
        summary: "Search encountered an error"
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
