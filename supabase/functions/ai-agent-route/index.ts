
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChatGroq } from "https://esm.sh/@langchain/groq@0.0.14";
import { AgentExecutor, createReactAgent } from "https://esm.sh/@langchain/core@0.2.31/agents";
import { DynamicTool } from "https://esm.sh/@langchain/core@0.2.31/tools";
import { PromptTemplate } from "https://esm.sh/@langchain/core@0.2.31/prompts";

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

    const llm = new ChatGroq({
      apiKey: groqApiKey,
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });

    // Define tools for the agent
    const weatherTool = new DynamicTool({
      name: "get_weather",
      description: "Get current weather conditions for route planning",
      func: async () => {
        // Simulate weather API call
        const conditions = ['clear', 'cloudy', 'rainy', 'windy'];
        const temp = Math.floor(Math.random() * 15) + 20; // 20-35°C
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        return `Current weather: ${condition}, ${temp}°C. ${condition === 'rainy' ? 'Consider covered routes.' : condition === 'clear' ? 'Good visibility conditions.' : 'Standard visibility.'}`;
      },
    });

    const campusEventsTool = new DynamicTool({
      name: "check_campus_events",
      description: "Check for ongoing campus events that might affect route safety",
      func: async () => {
        const events = [
          'No major events scheduled',
          'Student orientation in progress - high foot traffic near admin building',
          'Evening sports activities - well-lit sports complex area',
          'Maintenance work near library - temporary detour required',
          'Security patrol increase during exam period'
        ];
        return events[Math.floor(Math.random() * events.length)];
      },
    });

    const securityStatusTool = new DynamicTool({
      name: "security_status",
      description: "Get current campus security status and patrol information",
      func: async () => {
        const statuses = [
          'Normal security level - regular patrols active',
          'Enhanced security - additional patrols in response to recent incident',
          'Security escort service available until 10 PM',
          'Emergency response time: 3-5 minutes campus-wide'
        ];
        return statuses[Math.floor(Math.random() * statuses.length)];
      },
    });

    const routeHistoryTool = new DynamicTool({
      name: "route_history",
      description: "Check historical safety data for this route",
      func: async (input: string) => {
        // Simulate route history lookup
        const riskLevels = ['low', 'low', 'medium', 'low', 'low']; // Mostly low risk
        const incidents = Math.floor(Math.random() * 3); // 0-2 incidents
        return `Route to ${input}: ${incidents} incidents reported in last 30 days. Historical risk level: ${riskLevels[Math.floor(Math.random() * riskLevels.length)]}. Well-lit path with regular security presence.`;
      },
    });

    const tools = [weatherTool, campusEventsTool, securityStatusTool, routeHistoryTool];

    // Create the React agent prompt
    const prompt = PromptTemplate.fromTemplate(`
    You are a campus safety agent for University of Uyo. Analyze the requested route using available tools and provide comprehensive safety recommendations.

    User Profile: {userProfile}
    Route: From {currentLocation} to {destination}
    Planned Duration: {duration} minutes
    Current Time: {currentTime}

    Use the available tools to gather information and then provide a detailed route analysis in JSON format:
    {{
      "riskLevel": "low|medium|high|critical",
      "riskFactors": ["factor1", "factor2"],
      "safetyTips": ["tip1", "tip2"],
      "recommendedDuration": number_in_minutes,
      "alternativeRoutes": ["route1", "route2"],
      "emergencyContacts": ["contact1", "contact2"],
      "checkpointSuggestions": ["checkpoint1", "checkpoint2"],
      "timeOfDayRisk": "low|medium|high",
      "weatherConsiderations": "weather_advice",
      "campusSpecificAdvice": "advice",
      "toolsUsed": ["tool1", "tool2"],
      "agentReasoning": "explanation of analysis process"
    }}

    Available tools: {tools}

    {agent_scratchpad}

    Question: Analyze the safety of traveling from {currentLocation} to {destination} in {duration} minutes.
    `);

    // Create the agent
    const agent = await createReactAgent({
      llm,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
    });

    // Execute the agent
    const result = await agentExecutor.invoke({
      userProfile: JSON.stringify(userProfile),
      currentLocation: currentLocation || 'Campus location',
      destination,
      duration,
      currentTime: new Date().toLocaleString(),
    });

    // Parse the agent's response
    let analysis;
    try {
      // Extract JSON from the agent's response
      const jsonMatch = result.output.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in agent response');
      }
    } catch (parseError) {
      console.error('Failed to parse agent response:', result.output);
      // Fallback analysis
      analysis = {
        riskLevel: 'medium',
        riskFactors: ['Agent analysis unavailable'],
        safetyTips: ['Use well-lit paths', 'Keep emergency contacts ready'],
        recommendedDuration: duration + 10,
        alternativeRoutes: ['Main campus route'],
        emergencyContacts: ['Campus Security: 080-SECURITY'],
        checkpointSuggestions: ['Library', 'Student Center'],
        timeOfDayRisk: 'medium',
        weatherConsiderations: 'Check weather conditions',
        campusSpecificAdvice: 'Stay alert and inform someone of your route',
        toolsUsed: ['fallback'],
        agentReasoning: 'Fallback analysis due to parsing error'
      };
    }

    return new Response(JSON.stringify({
      analysis,
      timestamp: new Date().toISOString(),
      agentOutput: result.output
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in agent-based route analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: {
        riskLevel: 'medium',
        riskFactors: ['Agent analysis unavailable'],
        safetyTips: ['Use standard safety precautions'],
        recommendedDuration: 30,
        alternativeRoutes: [],
        emergencyContacts: ['Campus Security'],
        checkpointSuggestions: [],
        timeOfDayRisk: 'medium',
        weatherConsiderations: 'Check current conditions',
        campusSpecificAdvice: 'Follow campus safety guidelines',
        toolsUsed: ['none'],
        agentReasoning: 'Error occurred during analysis'
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
