
import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  disabled?: boolean;
}

export const PullToRefresh = ({
  onRefresh,
  children,
  threshold = 80,
  className,
  disabled = false
}: PullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    let rafId: number;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0 && !isRefreshing) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (container.scrollTop > 0 || isRefreshing || startY.current === 0) return;

      currentY.current = e.touches[0].clientY;
      const distance = Math.max(0, currentY.current - startY.current);
      
      if (distance > 0) {
        e.preventDefault();
        
        rafId = requestAnimationFrame(() => {
          const adjustedDistance = Math.min(distance * 0.5, threshold * 1.5);
          setPullDistance(adjustedDistance);
          setCanRefresh(adjustedDistance >= threshold);
        });
      }
    };

    const handleTouchEnd = async () => {
      if (canRefresh && !isRefreshing && pullDistance >= threshold) {
        setIsRefreshing(true);
        
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setIsRefreshing(false);
        }
      }
      
      startY.current = 0;
      currentY.current = 0;
      setPullDistance(0);
      setCanRefresh(false);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, threshold, disabled, isRefreshing, canRefresh, pullDistance]);

  const refreshIndicatorOpacity = Math.min(pullDistance / threshold, 1);
  const refreshIndicatorRotation = (pullDistance / threshold) * 180;

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-auto", className)}
      style={{ 
        transform: `translateY(${Math.min(pullDistance * 0.3, 40)}px)`,
        transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      {/* Refresh Indicator */}
      <div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center justify-center"
        style={{
          transform: `translateX(-50%) translateY(${Math.max(-60, -60 + pullDistance * 0.5)}px)`,
          opacity: refreshIndicatorOpacity,
          transition: pullDistance === 0 ? 'all 0.3s ease-out' : 'none'
        }}
      >
        <div 
          className={cn(
            "w-8 h-8 rounded-full border-2 border-primary/30 bg-background shadow-lg flex items-center justify-center",
            canRefresh && "border-primary bg-primary text-primary-foreground",
            isRefreshing && "animate-spin"
          )}
        >
          <RefreshCw 
            className="h-4 w-4" 
            style={{
              transform: isRefreshing ? 'none' : `rotate(${refreshIndicatorRotation}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-1 bg-background/80 px-2 py-1 rounded">
          {isRefreshing ? 'Refreshing...' : canRefresh ? 'Release to refresh' : 'Pull to refresh'}
        </div>
      </div>

      {children}
    </div>
  );
};
