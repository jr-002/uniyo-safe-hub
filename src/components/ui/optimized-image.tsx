
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  lazy?: boolean;
  blur?: boolean;
  aspectRatio?: 'square' | 'video' | 'auto';
  sizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallback = '/placeholder.svg',
  lazy = true,
  blur = true,
  aspectRatio = 'auto',
  sizes,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: '',
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-muted',
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {isInView && (
        <>
          <img
            ref={imgRef}
            src={hasError ? fallback : src}
            alt={alt}
            sizes={sizes}
            className={cn(
              'w-full h-full object-cover transition-all duration-300',
              !isLoaded && blur && 'blur-sm scale-105',
              isLoaded && 'blur-0 scale-100'
            )}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
          
          {!isLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
        </>
      )}
      
      {!isInView && lazy && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
};
