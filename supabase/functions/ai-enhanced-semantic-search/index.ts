
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
    const { searchQuery, items, searchType = 'both' } = await req.json();
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    console.log('Processing enhanced semantic search with Groq...');

    // Use Groq for semantic analysis and scoring
    const chatModel = new ChatGroq({
      apiKey: groqApiKey,
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });

    // Create item summaries for analysis
    const itemSummaries = items.map((item: any, index: number) => 
      `${index}: ${item.type || item.item_name} - ${item.description} (Location: ${item.location || item.location_lost}) [ID: ${item.id}]`
    ).join('\n');

    const analysisPrompt = `
    You are an advanced semantic search engine for lost and found items. Analyze the search query against all available items and provide intelligent matching.
    
    Search Query: "${searchQuery}"
    Search Type: ${searchType}
    
    Available Items:
    ${itemSummaries}
    
    Instructions:
    1. Analyze semantic similarity between the search query and each item
    2. Consider synonyms, related terms, and contextual meaning
    3. Score each relevant match from 0-100 based on semantic similarity
    4. Only include items with score >= 30
    5. Provide reasoning for each match
    6. Extract key matching terms/phrases
    
    Respond with JSON only:
    {
      "matches": [
        {
          "id": "item_id",
          "score": 85,
          "reasoning": "Detailed explanation of why this item matches",
          "highlights": ["key", "matching", "terms"],
          "semanticScore": 0.85
        }
      ],
      "suggestions": ["search improvement tips"],
      "summary": "Analysis summary with total matches found",
      "semanticAnalysis": "Explanation of the semantic matching process used"
    }
    
    Focus on semantic understanding, not just keyword matching. Consider:
    - Synonyms (e.g., "phone" = "mobile", "cell phone", "smartphone")
    - Related terms (e.g., "book" could match "textbook", "notebook")
    - Descriptive features (e.g., "blue" items, "small" items)
    - Location context (e.g., "library" could be "study area")
    `;

    const response = await chatModel.invoke(analysisPrompt);
    
    let analysis;
    try {
      analysis = JSON.parse(response.content as string);
    } catch (parseError) {
      console.log('Failed to parse Groq response, using fallback analysis');
      
      // Fallback: simple keyword matching with basic scoring
      const fallbackMatches = items
        .map((item: any) => {
          const itemText = `${item.type || item.item_name} ${item.description} ${item.location || item.location_lost}`.toLowerCase();
          const queryWords = searchQuery.toLowerCase().split(' ').filter(word => word.length > 2);
          
          let score = 0;
          const highlights: string[] = [];
          
          queryWords.forEach(word => {
            if (itemText.includes(word)) {
              score += 25;
              highlights.push(word);
            }
          });
          
          return {
            item,
            score,
            highlights,
            reasoning: `Keyword match: found ${highlights.length} matching terms`
          };
        })
        .filter(match => match.score >= 30)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(match => ({
          id: match.item.id,
          score: Math.min(match.score, 100),
          reasoning: match.reasoning,
          highlights: match.highlights,
          semanticScore: match.score / 100
        }));

      analysis = {
        matches: fallbackMatches,
        suggestions: ["Try more specific terms", "Include color or brand information", "Add location details"],
        summary: `Found ${fallbackMatches.length} items using keyword matching (Groq analysis failed)`,
        semanticAnalysis: "Fallback keyword matching used due to parsing error"
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced semantic search:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      matches: [],
      suggestions: ["Try a simpler search", "Check spelling", "Use more descriptive terms"],
      summary: "Enhanced search encountered an error",
      semanticAnalysis: "Groq-based semantic analysis unavailable"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
