
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChatGroq } from "https://esm.sh/@langchain/groq@0.0.14";
import { OpenAIEmbeddings } from "https://esm.sh/@langchain/openai@0.0.10";
import { MemoryVectorStore } from "https://esm.sh/@langchain/core@0.2.31/vectorstores/memory";
import { Document } from "https://esm.sh/@langchain/core@0.2.31/documents";
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
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!groqApiKey || !openaiApiKey) {
      throw new Error('API keys not configured');
    }

    // Initialize embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: openaiApiKey,
      modelName: "text-embedding-3-small"
    });

    // Create documents from items
    const documents = items.map((item: any) => new Document({
      pageContent: `${item.type || item.item_name}: ${item.description} at ${item.location || item.location_lost}`,
      metadata: {
        id: item.id,
        type: item.type || item.item_name,
        location: item.location || item.location_lost,
        timeReported: item.timeReported || item.timeFound || item.created_at,
        status: item.status
      }
    }));

    // Create vector store
    const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);

    // Perform similarity search
    const similarDocs = await vectorStore.similaritySearchWithScore(searchQuery, 5);

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
    ${similarDocs.map(([doc, score]) => 
      `- Score: ${score.toFixed(3)} | ${doc.pageContent} | Metadata: ${JSON.stringify(doc.metadata)}`
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
        matches: similarDocs
          .filter(([, score]) => score > 0.3)
          .map(([doc, score], index) => ({
            id: doc.metadata.id,
            score: Math.round((1 - score) * 100),
            reasoning: "Vector similarity match",
            highlights: [searchQuery],
            vectorScore: 1 - score
          })),
        suggestions: ["Try more descriptive terms", "Include brand names or colors"],
        summary: "Vector-based search completed",
        vectorAnalysis: `Found ${similarDocs.length} similar items using embeddings`
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
