
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { useToast } from '@/hooks/use-toast';

interface AgentRouteAnalysis {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  safetyTips: string[];
  recommendedDuration: number;
  alternativeRoutes: string[];
  emergencyContacts: string[];
  checkpointSuggestions: string[];
  timeOfDayRisk: 'low' | 'medium' | 'high';
  weatherConsiderations: string;
  campusSpecificAdvice: string;
  toolsUsed: string[];
  agentReasoning: string;
}

interface AgentAnalysisResult {
  analysis: AgentRouteAnalysis;
  timestamp: string;
  agentOutput: string;
}

export const useAgentRoute = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AgentAnalysisResult | null>(null);
  const { user } = useAuth();
  const { latitude, longitude } = useLocation();
  const { toast } = useToast();

  const analyzeRouteWithAgent = async (destination: string, duration: number) => {
    if (!destination) {
      toast({
        title: "Missing Information",
        description: "Destination is required for agent-based route analysis",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-agent-route', {
        body: {
          destination,
          duration,
          currentLocation: latitude && longitude ? 
            `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}` : 
            'Campus location',
          userProfile: {
            name: user?.user_metadata?.full_name || user?.email,
            userId: user?.id,
          },
        },
      });

      if (error) throw error;

      setAnalysis(data);
      return data;
    } catch (error) {
      console.error('Error in agent-based route analysis:', error);
      toast({
        title: "Agent Analysis Unavailable",
        description: "Using standard route recommendations",
        variant: "destructive",
      });
      
      const fallbackAnalysis = {
        analysis: {
          riskLevel: 'medium' as const,
          riskFactors: ['Agent analysis unavailable'],
          safetyTips: ['Stay on well-lit paths', 'Keep your phone charged', 'Inform someone of your route'],
          recommendedDuration: duration + 10,
          alternativeRoutes: ['Main campus route'],
          emergencyContacts: ['Campus Security: Emergency Line'],
          checkpointSuggestions: ['Library', 'Student Center'],
          timeOfDayRisk: 'medium' as const,
          weatherConsiderations: 'Check current weather conditions',
          campusSpecificAdvice: 'Follow standard campus safety guidelines',
          toolsUsed: ['fallback'],
          agentReasoning: 'Fallback analysis due to agent unavailability'
        },
        timestamp: new Date().toISOString(),
        agentOutput: 'Agent-based analysis unavailable, using fallback recommendations'
      };
      
      setAnalysis(fallbackAnalysis);
      return fallbackAnalysis;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
  };

  return {
    isAnalyzing,
    analysis,
    analyzeRouteWithAgent,
    clearAnalysis,
  };
};
