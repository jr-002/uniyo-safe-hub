
import { useEffect, useRef, useState } from 'react';

interface SwipeGestureOptions {
  threshold?: number;
  preventScroll?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export const useSwipeGesture = (options: SwipeGestureOptions = {}) => {
  const {
    threshold = 50,
    preventScroll = false,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const startTouch = useRef<TouchPosition | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startTouch.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      setIsSwiping(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startTouch.current) return;

      if (preventScroll) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startTouch.current) {
        setIsSwiping(false);
        return;
      }

      const touch = e.changedTouches[0];
      const endTouch = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      const deltaX = endTouch.x - startTouch.current.x;
      const deltaY = endTouch.y - startTouch.current.y;
      const deltaTime = endTouch.time - startTouch.current.time;

      // Calculate velocity (pixels per millisecond)
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;

      // Determine if it's a valid swipe (fast enough and far enough)
      const isValidSwipe = Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold;
      const isFastEnough = velocity > 0.3; // Adjust this value to change sensitivity

      if (isValidSwipe && isFastEnough) {
        // Determine swipe direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }

      startTouch.current = null;
      setIsSwiping(false);
    };

    const handleTouchCancel = () => {
      startTouch.current = null;
      setIsSwiping(false);
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [threshold, preventScroll, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return { elementRef, isSwiping };
};
