
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChatGroq } from "https://esm.sh/@langchain/groq@0.0.14";
import { LLMChain } from "https://esm.sh/@langchain/core@0.2.31/chains";
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

    // Step 1: Categorization Chain
    const categorizationPrompt = PromptTemplate.fromTemplate(`
    Analyze this incident report and categorize it precisely:
    
    Description: {description}
    Location: {location}
    Reported Type: {reportType}
    
    Categorize into one of: theft, harassment, suspicious_activity, infrastructure, safety_hazard, medical, security, other
    
    Respond with JSON only:
    {{
      "category": "category_name",
      "confidence": "high|medium|low",
      "reasoning": "brief explanation"
    }}
    `);

    const categorizationChain = new LLMChain({
      llm: chatModel,
      prompt: categorizationPrompt,
    });

    // Step 2: Risk Assessment Chain
    const riskPrompt = PromptTemplate.fromTemplate(`
    Assess the risk level for this categorized incident:
    
    Category: {category}
    Description: {description}
    Location: {location}
    Categorization Confidence: {confidence}
    
    Assess risk level: low, medium, high, critical
    
    Respond with JSON only:
    {{
      "riskLevel": "risk_level",
      "riskFactors": ["factor1", "factor2"],
      "urgency": "immediate|within_hour|within_day|routine",
      "reasoning": "risk assessment explanation"
    }}
    `);

    const riskChain = new LLMChain({
      llm: chatModel,
      prompt: riskPrompt,
    });

    // Step 3: Response Recommendations Chain
    const responsePrompt = PromptTemplate.fromTemplate(`
    Generate response recommendations for this assessed incident:
    
    Category: {category}
    Risk Level: {riskLevel}
    Urgency: {urgency}
    Location: {location}
    Risk Factors: {riskFactors}
    
    Provide specific, actionable recommendations for UniUyo campus safety.
    
    Respond with JSON only:
    {{
      "immediateActions": ["action1", "action2"],
      "investigationSteps": ["step1", "step2"],
      "preventionMeasures": ["measure1", "measure2"],
      "resourcesNeeded": ["resource1", "resource2"]
    }}
    `);

    const responseChain = new LLMChain({
      llm: chatModel,
      prompt: responsePrompt,
    });

    // Step 4: Follow-up Actions Chain
    const followupPrompt = PromptTemplate.fromTemplate(`
    Create follow-up action plan for this incident:
    
    Category: {category}
    Risk Level: {riskLevel}
    Immediate Actions: {immediateActions}
    
    Plan follow-up activities and monitoring.
    
    Respond with JSON only:
    {{
      "followupTimeline": {{
        "24_hours": ["action1", "action2"],
        "1_week": ["action1", "action2"],
        "1_month": ["action1", "action2"]
      }},
      "monitoringRequired": ["monitor1", "monitor2"],
      "reportingRequirements": ["report1", "report2"]
    }}
    `);

    const followupChain = new LLMChain({
      llm: chatModel,
      prompt: followupPrompt,
    });

    // Execute the chain sequentially
    console.log('Step 1: Categorizing incident...');
    const categorizationResult = await categorizationChain.call({
      description,
      location,
      reportType
    });

    let categorization;
    try {
      categorization = JSON.parse(categorizationResult.text);
    } catch (e) {
      categorization = {
        category: reportType || "other",
        confidence: "low",
        reasoning: "Failed to parse categorization"
      };
    }

    console.log('Step 2: Assessing risk...');
    const riskResult = await riskChain.call({
      category: categorization.category,
      description,
      location,
      confidence: categorization.confidence
    });

    let riskAssessment;
    try {
      riskAssessment = JSON.parse(riskResult.text);
    } catch (e) {
      riskAssessment = {
        riskLevel: "medium",
        riskFactors: ["Assessment unavailable"],
        urgency: "within_day",
        reasoning: "Failed to parse risk assessment"
      };
    }

    console.log('Step 3: Generating response recommendations...');
    const responseResult = await responseChain.call({
      category: categorization.category,
      riskLevel: riskAssessment.riskLevel,
      urgency: riskAssessment.urgency,
      location,
      riskFactors: JSON.stringify(riskAssessment.riskFactors)
    });

    let recommendations;
    try {
      recommendations = JSON.parse(responseResult.text);
    } catch (e) {
      recommendations = {
        immediateActions: ["Contact campus security", "Document incident"],
        investigationSteps: ["Review security footage", "Interview witnesses"],
        preventionMeasures: ["Increase patrols", "Improve lighting"],
        resourcesNeeded: ["Security personnel", "Investigation team"]
      };
    }

    console.log('Step 4: Creating follow-up plan...');
    const followupResult = await followupChain.call({
      category: categorization.category,
      riskLevel: riskAssessment.riskLevel,
      immediateActions: JSON.stringify(recommendations.immediateActions)
    });

    let followupPlan;
    try {
      followupPlan = JSON.parse(followupResult.text);
    } catch (e) {
      followupPlan = {
        followupTimeline: {
          "24_hours": ["Initial response complete"],
          "1_week": ["Progress review"],
          "1_month": ["Final assessment"]
        },
        monitoringRequired: ["Regular status checks"],
        reportingRequirements: ["Incident report filing"]
      };
    }

    // Combine all results
    const chainAnalysis = {
      step1_categorization: categorization,
      step2_riskAssessment: riskAssessment,
      step3_recommendations: recommendations,
      step4_followup: followupPlan,
      summary: {
        category: categorization.category,
        riskLevel: riskAssessment.riskLevel,
        urgency: riskAssessment.urgency,
        confidence: categorization.confidence
      }
    };

    return new Response(JSON.stringify({
      chainAnalysis,
      timestamp: new Date().toISOString(),
      processingSteps: 4,
      confidence: categorization.confidence
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chain-based incident analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      chainAnalysis: {
        step1_categorization: { category: "other", confidence: "low", reasoning: "Error in processing" },
        step2_riskAssessment: { riskLevel: "medium", riskFactors: [], urgency: "within_day", reasoning: "Error in processing" },
        step3_recommendations: { immediateActions: [], investigationSteps: [], preventionMeasures: [], resourcesNeeded: [] },
        step4_followup: { followupTimeline: {}, monitoringRequired: [], reportingRequirements: [] },
        summary: { category: "other", riskLevel: "medium", urgency: "within_day", confidence: "low" }
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
