
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChatGroq } from "https://esm.sh/@langchain/groq@0.0.14";
import { OpenAIEmbeddings } from "https://esm.sh/@langchain/openai@0.0.10";

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
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!groqApiKey || !openaiApiKey) {
      throw new Error('API keys not configured');
    }

    // Initialize embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: openaiApiKey,
      modelName: "text-embedding-3-small"
    });

    console.log('Processing enhanced semantic search...');

    // Create embeddings for search query
    const queryEmbedding = await embeddings.embedQuery(searchQuery);
    
    // Create embeddings for all items and calculate similarity
    const itemsWithScores = await Promise.all(
      items.map(async (item: any) => {
        const itemText = `${item.type || item.item_name}: ${item.description} at ${item.location || item.location_lost}`;
        const itemEmbedding = await embeddings.embedQuery(itemText);
        
        // Calculate cosine similarity
        const similarity = cosineSimilarity(queryEmbedding, itemEmbedding);
        
        return {
          item,
          similarity,
          text: itemText
        };
      })
    );

    // Filter and sort by similarity
    const relevantItems = itemsWithScores
      .filter(({ similarity }) => similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    // Use Groq for intelligent analysis
    const chatModel = new ChatGroq({
      apiKey: groqApiKey,
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
    });

    const analysisPrompt = `
    Analyze these search results for lost and found items:
    
    Search Query: "${searchQuery}"
    
    Similar Items Found:
    ${relevantItems.map(({ item, similarity, text }) => 
      `- Similarity: ${similarity.toFixed(3)} | ${text} | ID: ${item.id}`
    ).join('\n')}
    
    Provide a JSON response with:
    {
      "matches": [
        {
          "id": "item_id",
          "score": 85,
          "reasoning": "Why this matches",
          "highlights": ["matching", "keywords"],
          "vectorScore": 0.85
        }
      ],
      "suggestions": ["search tips"],
      "summary": "Analysis summary",
      "vectorAnalysis": "How the vector search performed"
    }
    
    Only include items with vector similarity score > 0.3. Combine vector similarity with semantic understanding.
    `;

    const response = await chatModel.invoke(analysisPrompt);
    
    let analysis;
    try {
      analysis = JSON.parse(response.content as string);
    } catch (parseError) {
      analysis = {
        matches: relevantItems.map(({ item, similarity }, index) => ({
          id: item.id,
          score: Math.round(similarity * 100),
          reasoning: "Vector similarity match based on semantic understanding",
          highlights: [searchQuery],
          vectorScore: similarity
        })),
        suggestions: ["Try more descriptive terms", "Include brand names or colors"],
        summary: "Vector-based search completed using OpenAI embeddings",
        vectorAnalysis: `Found ${relevantItems.length} similar items using semantic embeddings`
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
      suggestions: ["Try a simpler search", "Check spelling"],
      summary: "Enhanced search encountered an error"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (normA * normB);
}
