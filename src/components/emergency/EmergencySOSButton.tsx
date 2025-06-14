
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/hooks/useLocation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EmergencySOSButtonProps {
  onEmergencyTriggered?: (location: { latitude: number; longitude: number } | null) => void;
  className?: string;
}

export const EmergencySOSButton = React.memo(({ 
  onEmergencyTriggered, 
  className 
}: EmergencySOSButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isTriggered, setIsTriggered] = useState(false);
  const { latitude, longitude, error: locationError } = useLocation(true);
  const { toast } = useToast();

  // Auto-trigger after countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPressed && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isPressed && countdown === 0) {
      handleEmergencyTrigger();
    }

    return () => clearTimeout(timer);
  }, [isPressed, countdown]);

  // Haptic feedback for mobile devices
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const handleEmergencyTrigger = () => {
    setIsTriggered(true);
    triggerHapticFeedback();
    
    const locationData = latitude && longitude ? { latitude, longitude } : null;
    
    // Show immediate feedback
    toast({
      title: "🚨 Emergency Alert Sent",
      description: locationData 
        ? "Emergency services have been notified with your location"
        : "Emergency services have been notified (location unavailable)",
      variant: "destructive",
    });

    // Call emergency services (in real app, this would trigger actual emergency protocols)
    if (onEmergencyTriggered) {
      onEmergencyTriggered(locationData);
    }

    // Reset after 10 seconds
    setTimeout(() => {
      setIsTriggered(false);
      setIsPressed(false);
      setCountdown(5);
    }, 10000);
  };

  const handlePress = () => {
    if (isTriggered) return;
    
    setIsPressed(true);
    triggerHapticFeedback();
    
    toast({
      title: "Emergency SOS Activated",
      description: `Release within ${countdown} seconds to cancel`,
      variant: "destructive",
    });
  };

  const handleRelease = () => {
    if (countdown > 0 && !isTriggered) {
      setIsPressed(false);
      setCountdown(5);
      
      toast({
        title: "Emergency SOS Cancelled",
        description: "Emergency alert has been cancelled",
      });
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!isPressed) {
        handlePress();
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleRelease();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        size="lg"
        variant="destructive"
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        disabled={isTriggered}
        className={cn(
          "relative h-24 w-24 rounded-full border-4 border-red-600",
          "focus:ring-4 focus:ring-red-500/50 focus:outline-none",
          "transition-all duration-200 transform",
          "hover:scale-110 active:scale-95",
          isPressed && "scale-95 bg-red-700 border-red-800",
          isTriggered && "animate-pulse bg-red-800",
          "shadow-lg hover:shadow-xl"
        )}
        aria-label={
          isTriggered 
            ? "Emergency alert sent" 
            : isPressed 
              ? `Emergency SOS countdown: ${countdown} seconds` 
              : "Press and hold for emergency SOS"
        }
        aria-describedby="emergency-instructions"
        role="button"
        tabIndex={0}
      >
        <div className="flex flex-col items-center justify-center">
          {isTriggered ? (
            <Phone className="h-8 w-8 animate-bounce" />
          ) : (
            <AlertTriangle className="h-8 w-8" />
          )}
          {isPressed && countdown > 0 && (
            <span className="text-xs font-bold mt-1">{countdown}</span>
          )}
        </div>
        
        {isPressed && (
          <div className="absolute inset-0 rounded-full border-4 border-white animate-ping" />
        )}
      </Button>

      {/* Location indicator */}
      <div className="absolute -bottom-2 -right-2">
        <div className={cn(
          "flex items-center justify-center h-6 w-6 rounded-full text-xs",
          latitude && longitude 
            ? "bg-green-500 text-white" 
            : "bg-yellow-500 text-black"
        )}>
          <MapPin className="h-3 w-3" />
        </div>
      </div>

      {/* Hidden instructions for screen readers */}
      <div id="emergency-instructions" className="sr-only">
        Press and hold this button for 5 seconds to send an emergency alert to campus security and your emergency contacts. 
        {latitude && longitude 
          ? "Your location will be shared automatically." 
          : "Location services are not available."
        }
        Release the button before the countdown ends to cancel the alert.
      </div>

      {/* Visual countdown indicator */}
      {isPressed && countdown > 0 && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-red-400/30 rounded-full transition-all duration-1000"
            style={{
              transform: `scale(${1 - (countdown / 5) * 0.5})`,
            }}
          />
        </div>
      )}
    </div>
  );
});

EmergencySOSButton.displayName = "EmergencySOSButton";
