
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { useToast } from '@/hooks/use-toast';

interface RouteAnalysis {
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
}

interface AnalysisResult {
  analysis: RouteAnalysis;
  timestamp: string;
}

export const useRouteAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { user } = useAuth();
  const { latitude, longitude } = useLocation();
  const { toast } = useToast();

  const analyzeRoute = async (destination: string, duration: number) => {
    if (!destination) {
      toast({
        title: "Missing Information",
        description: "Destination is required for route analysis",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-route-analysis', {
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
      console.error('Error analyzing route:', error);
      toast({
        title: "Analysis Unavailable",
        description: "Using standard safety recommendations",
        variant: "destructive",
      });
      
      // Return fallback analysis
      const fallbackAnalysis = {
        analysis: {
          riskLevel: 'medium' as const,
          riskFactors: ['Route analysis unavailable'],
          safetyTips: ['Stay on well-lit paths', 'Keep your phone charged', 'Inform someone of your route'],
          recommendedDuration: duration + 10,
          alternativeRoutes: ['Main campus route'],
          emergencyContacts: ['Campus Security: Emergency Line'],
          checkpointSuggestions: ['Library', 'Student Center'],
          timeOfDayRisk: 'medium' as const,
          weatherConsiderations: 'Check current weather conditions',
          campusSpecificAdvice: 'Follow standard campus safety guidelines'
        },
        timestamp: new Date().toISOString()
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
    analyzeRoute,
    clearAnalysis,
  };
};
