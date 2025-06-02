
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChatGroq } from "https://esm.sh/@langchain/groq@0.0.14";
import { BufferMemory } from "https://esm.sh/@langchain/core@0.2.31/memory";
import { ConversationChain } from "https://esm.sh/@langchain/core@0.2.31/chains";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Store memories for each user session
const userMemories = new Map();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const { userId, emergencyType, additionalContext, sessionId } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user profile and emergency history
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, department, emergency_contact')
      .eq('user_id', userId)
      .single();

    const { data: emergencyHistory } = await supabase
      .from('incident_reports')
      .select('category, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: emergencyContacts } = await supabase
      .from('emergency_contacts')
      .select('name, phone_number, relationship')
      .eq('user_id', userId)
      .limit(3);

    // Get or create memory for this user session
    let memory = userMemories.get(sessionId || userId);
    if (!memory) {
      memory = new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
      });
      userMemories.set(sessionId || userId, memory);
    }

    // Initialize Groq LLM
    const chatModel = new ChatGroq({
      apiKey: groqApiKey,
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    // Create conversation chain with memory
    const chain = new ConversationChain({
      llm: chatModel,
      memory: memory,
    });

    const contextPrompt = `
    You are an AI emergency assistant with memory for University of Uyo Campus. Remember previous interactions and build context.

    Current Emergency Situation:
    - Type: ${emergencyType || 'General Emergency'}
    - Additional Context: ${additionalContext || 'None provided'}

    User Profile:
    - Name: ${profile?.full_name || 'Unknown'}
    - Department: ${profile?.department || 'Unknown'}
    - Primary Emergency Contact: ${profile?.emergency_contact || 'None on file'}

    Emergency Contacts on File:
    ${emergencyContacts?.map(contact => `- ${contact.name} (${contact.relationship}): ${contact.phone_number}`).join('\n') || 'No emergency contacts registered'}

    Recent Emergency History:
    ${emergencyHistory?.map(incident => `- ${incident.category}: ${incident.description.substring(0, 100)}... (${new Date(incident.created_at).toLocaleDateString()})`).join('\n') || 'No recent incidents'}

    Based on this information and our previous conversations (if any), generate a comprehensive emergency context report that:
    1. Considers the user's history and patterns
    2. References known contacts and preferences
    3. Provides personalized emergency response guidance
    4. Suggests relevant resources based on past incidents

    Keep the response concise but comprehensive (3-4 sentences).
    `;

    const response = await chain.call({ input: contextPrompt });

    // Save this interaction to memory
    await memory.saveContext(
      { input: `Emergency: ${emergencyType}, Context: ${additionalContext}` },
      { output: response.response }
    );

    return new Response(JSON.stringify({ 
      emergencyContext: response.response,
      timestamp: new Date().toISOString(),
      userProfile: {
        name: profile?.full_name,
        department: profile?.department,
        emergencyContact: profile?.emergency_contact
      },
      memoryContext: {
        hasHistory: emergencyHistory && emergencyHistory.length > 0,
        hasContacts: emergencyContacts && emergencyContacts.length > 0,
        sessionActive: true
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in memory-enhanced emergency context:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      emergencyContext: 'AI context generation with memory unavailable. Please proceed with standard emergency protocols.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
