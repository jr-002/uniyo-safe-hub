
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { useToast } from '@/hooks/use-toast';

export interface SafetyTimer {
  id: string;
  user_id: string;
  start_time: string;
  duration_seconds: number;
  destination_text?: string;
  destination_coords?: { x: number; y: number };
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  last_known_location?: { x: number; y: number };
  created_at: string;
  updated_at: string;
}

export interface Guardian {
  id: string;
  user_id: string;
  guardian_user_id?: string;
  guardian_email?: string;
  guardian_phone?: string;
  guardian_name: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
}

// Helper function to parse point data from Supabase
const parsePoint = (pointData: any): { x: number; y: number } | undefined => {
  if (!pointData) return undefined;
  
  // Handle different possible formats from Supabase
  if (typeof pointData === 'string') {
    const match = pointData.match(/\(([^,]+),([^)]+)\)/);
    if (match) {
      return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
    }
  }
  
  if (pointData && typeof pointData === 'object') {
    if ('x' in pointData && 'y' in pointData) {
      return { x: pointData.x, y: pointData.y };
    }
  }
  
  return undefined;
};

// Helper function to transform Supabase data to our interface
const transformSafetyTimer = (data: any): SafetyTimer => ({
  id: data.id,
  user_id: data.user_id,
  start_time: data.start_time,
  duration_seconds: data.duration_seconds,
  destination_text: data.destination_text,
  destination_coords: parsePoint(data.destination_coords),
  status: data.status as SafetyTimer['status'],
  last_known_location: parsePoint(data.last_known_location),
  created_at: data.created_at,
  updated_at: data.updated_at,
});

// Helper function to transform Guardian data
const transformGuardian = (data: any): Guardian => ({
  id: data.id,
  user_id: data.user_id,
  guardian_user_id: data.guardian_user_id,
  guardian_email: data.guardian_email,
  guardian_phone: data.guardian_phone,
  guardian_name: data.guardian_name,
  status: data.status as Guardian['status'],
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const useSafetyTimer = () => {
  const [activeTimer, setActiveTimer] = useState<SafetyTimer | null>(null);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { latitude, longitude } = useLocation(true); // Watch position continuously
  const { toast } = useToast();

  // Load active timer and guardians on mount
  useEffect(() => {
    if (user) {
      loadActiveTimer();
      loadGuardians();
    }
  }, [user]);

  // Update location for active timer
  useEffect(() => {
    if (activeTimer && latitude && longitude) {
      updateTimerLocation(activeTimer.id, latitude, longitude);
    }
  }, [activeTimer, latitude, longitude]);

  // Check for timer expiration
  useEffect(() => {
    if (!activeTimer) return;

    const checkExpiration = () => {
      const startTime = new Date(activeTimer.start_time).getTime();
      const currentTime = Date.now();
      const elapsed = Math.floor((currentTime - startTime) / 1000);
      
      if (elapsed >= activeTimer.duration_seconds && activeTimer.status === 'active') {
        handleTimerExpiration(activeTimer.id);
      }
    };

    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  const loadActiveTimer = async () => {
    try {
      const { data, error } = await supabase
        .from('safety_timers')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error loading active timer:', error);
        return;
      }

      setActiveTimer(data ? transformSafetyTimer(data) : null);
    } catch (error) {
      console.error('Error loading active timer:', error);
    }
  };

  const loadGuardians = async () => {
    try {
      const { data, error } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'accepted');

      if (error) {
        console.error('Error loading guardians:', error);
        return;
      }

      setGuardians(data ? data.map(transformGuardian) : []);
    } catch (error) {
      console.error('Error loading guardians:', error);
    }
  };

  const startTimer = async (
    durationMinutes: number,
    destination: string,
    selectedGuardians: string[]
  ) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: timer, error: timerError } = await supabase
        .from('safety_timers')
        .insert({
          user_id: user.id,
          duration_seconds: durationMinutes * 60,
          destination_text: destination,
          destination_coords: latitude && longitude ? `(${longitude},${latitude})` : null,
          last_known_location: latitude && longitude ? `(${longitude},${latitude})` : null,
        })
        .select()
        .single();

      if (timerError) throw timerError;

      // Add selected guardians to the timer
      if (selectedGuardians.length > 0) {
        const timerGuardians = selectedGuardians.map(guardianId => {
          const guardian = guardians.find(g => g.id === guardianId);
          return {
            timer_id: timer.id,
            guardian_user_id: guardian?.guardian_user_id,
            guardian_contact_info: guardian?.guardian_email || guardian?.guardian_phone,
            guardian_name: guardian?.guardian_name,
          };
        });

        const { error: guardiansError } = await supabase
          .from('timer_guardians')
          .insert(timerGuardians);

        if (guardiansError) throw guardiansError;
      }

      setActiveTimer(transformSafetyTimer(timer));
      toast({
        title: "Safety Timer Started",
        description: `Timer set for ${durationMinutes} minutes`,
      });
    } catch (error) {
      console.error('Error starting timer:', error);
      toast({
        title: "Error",
        description: "Failed to start safety timer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stopTimer = async (timerId: string) => {
    try {
      const { error } = await supabase
        .from('safety_timers')
        .update({ status: 'completed' })
        .eq('id', timerId);

      if (error) throw error;

      setActiveTimer(null);
      toast({
        title: "Safety Timer Completed",
        description: "You have safely reached your destination",
      });
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast({
        title: "Error",
        description: "Failed to stop timer",
        variant: "destructive",
      });
    }
  };

  const updateTimerLocation = async (timerId: string, lat: number, lng: number) => {
    try {
      await supabase
        .from('safety_timers')
        .update({ last_known_location: `(${lng},${lat})` })
        .eq('id', timerId);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleTimerExpiration = async (timerId: string) => {
    try {
      const { error } = await supabase
        .from('safety_timers')
        .update({ status: 'expired' })
        .eq('id', timerId);

      if (error) throw error;

      setActiveTimer(prev => prev ? { ...prev, status: 'expired' } : null);
      
      toast({
        title: "Safety Timer Expired",
        description: "Your guardians have been notified",
        variant: "destructive",
      });

      // Here you would trigger notifications to guardians
      // This could be implemented with Supabase Functions
    } catch (error) {
      console.error('Error handling timer expiration:', error);
    }
  };

  const addGuardian = async (guardianData: {
    guardian_name: string;
    guardian_email?: string;
    guardian_phone?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('guardians')
        .insert({
          user_id: user.id,
          ...guardianData,
          status: 'accepted', // For now, auto-accept. Later implement invitation system
        })
        .select()
        .single();

      if (error) throw error;

      setGuardians(prev => [...prev, transformGuardian(data)]);
      toast({
        title: "Guardian Added",
        description: `${guardianData.guardian_name} has been added to your guardians`,
      });
    } catch (error) {
      console.error('Error adding guardian:', error);
      toast({
        title: "Error",
        description: "Failed to add guardian",
        variant: "destructive",
      });
    }
  };

  const removeGuardian = async (guardianId: string) => {
    try {
      const { error } = await supabase
        .from('guardians')
        .delete()
        .eq('id', guardianId);

      if (error) throw error;

      setGuardians(prev => prev.filter(g => g.id !== guardianId));
      toast({
        title: "Guardian Removed",
        description: "Guardian has been removed from your list",
      });
    } catch (error) {
      console.error('Error removing guardian:', error);
      toast({
        title: "Error",
        description: "Failed to remove guardian",
        variant: "destructive",
      });
    }
  };

  const getTimeRemaining = useCallback(() => {
    if (!activeTimer) return 0;
    
    const startTime = new Date(activeTimer.start_time).getTime();
    const currentTime = Date.now();
    const elapsed = Math.floor((currentTime - startTime) / 1000);
    const remaining = Math.max(0, activeTimer.duration_seconds - elapsed);
    
    return remaining;
  }, [activeTimer]);

  return {
    activeTimer,
    guardians,
    loading,
    startTimer,
    stopTimer,
    addGuardian,
    removeGuardian,
    getTimeRemaining,
  };
};
