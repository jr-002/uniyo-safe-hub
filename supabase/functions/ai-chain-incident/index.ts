
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Step 1: Categorization
    console.log('Step 1: Categorizing incident...');
    const categorizationResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: 'user',
          content: `Analyze this incident report and categorize it precisely:
          
          Description: ${description}
          Location: ${location}
          Reported Type: ${reportType}
          
          Categorize into one of: theft, harassment, suspicious_activity, infrastructure, safety_hazard, medical, security, other
          
          Respond with JSON only:
          {
            "category": "category_name",
            "confidence": "high|medium|low",
            "reasoning": "brief explanation"
          }`
        }],
        temperature: 0.1,
      }),
    });

    const categorizationData = await categorizationResponse.json();
    let categorization;
    try {
      categorization = JSON.parse(categorizationData.choices[0].message.content);
    } catch (e) {
      categorization = {
        category: reportType || "other",
        confidence: "low",
        reasoning: "Failed to parse categorization"
      };
    }

    // Step 2: Risk Assessment
    console.log('Step 2: Assessing risk...');
    const riskResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: 'user',
          content: `Assess the risk level for this categorized incident:
          
          Category: ${categorization.category}
          Description: ${description}
          Location: ${location}
          Categorization Confidence: ${categorization.confidence}
          
          Assess risk level: low, medium, high, critical
          
          Respond with JSON only:
          {
            "riskLevel": "risk_level",
            "riskFactors": ["factor1", "factor2"],
            "urgency": "immediate|within_hour|within_day|routine",
            "reasoning": "risk assessment explanation"
          }`
        }],
        temperature: 0.1,
      }),
    });

    const riskData = await riskResponse.json();
    let riskAssessment;
    try {
      riskAssessment = JSON.parse(riskData.choices[0].message.content);
    } catch (e) {
      riskAssessment = {
        riskLevel: "medium",
        riskFactors: ["Assessment unavailable"],
        urgency: "within_day",
        reasoning: "Failed to parse risk assessment"
      };
    }

    // Step 3: Response Recommendations
    console.log('Step 3: Generating response recommendations...');
    const responseResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: 'user',
          content: `Generate response recommendations for this assessed incident:
          
          Category: ${categorization.category}
          Risk Level: ${riskAssessment.riskLevel}
          Urgency: ${riskAssessment.urgency}
          Location: ${location}
          Risk Factors: ${JSON.stringify(riskAssessment.riskFactors)}
          
          Provide specific, actionable recommendations for UniUyo campus safety.
          
          Respond with JSON only:
          {
            "immediateActions": ["action1", "action2"],
            "investigationSteps": ["step1", "step2"],
            "preventionMeasures": ["measure1", "measure2"],
            "resourcesNeeded": ["resource1", "resource2"]
          }`
        }],
        temperature: 0.1,
      }),
    });

    const responseData = await responseResponse.json();
    let recommendations;
    try {
      recommendations = JSON.parse(responseData.choices[0].message.content);
    } catch (e) {
      recommendations = {
        immediateActions: ["Contact campus security", "Document incident"],
        investigationSteps: ["Review security footage", "Interview witnesses"],
        preventionMeasures: ["Increase patrols", "Improve lighting"],
        resourcesNeeded: ["Security personnel", "Investigation team"]
      };
    }

    // Step 4: Follow-up Actions
    console.log('Step 4: Creating follow-up plan...');
    const followupResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: 'user',
          content: `Create follow-up action plan for this incident:
          
          Category: ${categorization.category}
          Risk Level: ${riskAssessment.riskLevel}
          Immediate Actions: ${JSON.stringify(recommendations.immediateActions)}
          
          Plan follow-up activities and monitoring.
          
          Respond with JSON only:
          {
            "followupTimeline": {
              "24_hours": ["action1", "action2"],
              "1_week": ["action1", "action2"],
              "1_month": ["action1", "action2"]
            },
            "monitoringRequired": ["monitor1", "monitor2"],
            "reportingRequirements": ["report1", "report2"]
          }`
        }],
        temperature: 0.1,
      }),
    });

    const followupData = await followupResponse.json();
    let followupPlan;
    try {
      followupPlan = JSON.parse(followupData.choices[0].message.content);
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
