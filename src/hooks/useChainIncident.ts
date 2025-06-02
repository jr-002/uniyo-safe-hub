
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChainAnalysis {
  step1_categorization: {
    category: string;
    confidence: string;
    reasoning: string;
  };
  step2_riskAssessment: {
    riskLevel: string;
    riskFactors: string[];
    urgency: string;
    reasoning: string;
  };
  step3_recommendations: {
    immediateActions: string[];
    investigationSteps: string[];
    preventionMeasures: string[];
    resourcesNeeded: string[];
  };
  step4_followup: {
    followupTimeline: {
      '24_hours': string[];
      '1_week': string[];
      '1_month': string[];
    };
    monitoringRequired: string[];
    reportingRequirements: string[];
  };
  summary: {
    category: string;
    riskLevel: string;
    urgency: string;
    confidence: string;
  };
}

interface ChainAnalysisResult {
  chainAnalysis: ChainAnalysis;
  timestamp: string;
  processingSteps: number;
  confidence: string;
}

export const useChainIncident = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ChainAnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeWithChain = async (description: string, location: string, reportType: string) => {
    if (!description || !location) {
      toast({
        title: "Missing Information",
        description: "Description and location are required for chain analysis",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chain-incident', {
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
      console.error('Error in chain-based incident analysis:', error);
      toast({
        title: "Chain Analysis Unavailable",
        description: "Using basic categorization",
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
    analyzeWithChain,
    clearAnalysis,
  };
};
