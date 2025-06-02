
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface MemoryEmergencyContext {
  emergencyContext: string;
  timestamp: string;
  userProfile: {
    name?: string;
    department?: string;
    emergencyContact?: string;
  };
  memoryContext: {
    hasHistory: boolean;
    hasContacts: boolean;
    sessionActive: boolean;
  };
}

export const useMemoryEmergency = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [emergencyContext, setEmergencyContext] = useState<MemoryEmergencyContext | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const { user } = useAuth();
  const { toast } = useToast();

  const generateMemoryEmergencyContext = async (emergencyType?: string, additionalContext?: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use memory-enhanced emergency features",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-memory-emergency', {
        body: {
          userId: user.id,
          emergencyType,
          additionalContext,
          sessionId,
        },
      });

      if (error) throw error;

      setEmergencyContext(data);
      return data;
    } catch (error) {
      console.error('Error generating memory emergency context:', error);
      toast({
        title: "Memory AI Context Unavailable",
        description: "Using standard emergency protocols",
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
    generateMemoryEmergencyContext,
    clearContext,
    sessionId,
  };
};
