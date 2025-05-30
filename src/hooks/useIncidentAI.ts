
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IncidentAnalysis {
  suggestedCategory: string;
  priorityLevel: 'low' | 'medium' | 'high' | 'critical';
  riskAssessment: string;
  recommendedActions: string[];
  tags: string[];
}

interface AnalysisResult {
  analysis: IncidentAnalysis;
  confidence: string;
  timestamp: string;
}

export const useIncidentAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeIncident = async (description: string, location: string, reportType: string) => {
    if (!description || !location) {
      toast({
        title: "Missing Information",
        description: "Description and location are required for analysis",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-incident-analysis', {
        body: {
          description,
          location,
          reportType,
        },
      });

      if (error) throw error;

      setAnalysis(data);
      return data;
    } catch (error) {
      console.error('Error analyzing incident:', error);
      toast({
        title: "Analysis Unavailable",
        description: "Using manual categorization",
        variant: "destructive",
      });
      return null;
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
    analyzeIncident,
    clearAnalysis,
  };
};
