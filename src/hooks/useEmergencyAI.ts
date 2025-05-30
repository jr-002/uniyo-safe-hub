
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { useToast } from '@/hooks/use-toast';

interface EmergencyContext {
  emergencyContext: string;
  timestamp: string;
  userProfile: {
    name?: string;
    department?: string;
    emergencyContact?: string;
  };
}

export const useEmergencyAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [emergencyContext, setEmergencyContext] = useState<EmergencyContext | null>(null);
  const { user } = useAuth();
  const { latitude, longitude } = useLocation();
  const { toast } = useToast();

  const generateEmergencyContext = async (emergencyType?: string, additionalContext?: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use AI emergency features",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-emergency-context', {
        body: {
          userId: user.id,
          location: latitude && longitude ? { latitude, longitude } : null,
          emergencyType,
          additionalContext,
        },
      });

      if (error) throw error;

      setEmergencyContext(data);
      return data;
    } catch (error) {
      console.error('Error generating emergency context:', error);
      toast({
        title: "AI Context Unavailable",
        description: "Emergency services will use standard protocols",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearContext = () => {
    setEmergencyContext(null);
  };

  return {
    isGenerating,
    emergencyContext,
    generateEmergencyContext,
    clearContext,
  };
};
