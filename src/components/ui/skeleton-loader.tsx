
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  lines?: number;
  variant?: "text" | "avatar" | "card" | "button";
}

export const SkeletonLoader = ({ 
  className, 
  lines = 1, 
  variant = "text" 
}: SkeletonProps) => {
  const baseClasses = "animate-pulse bg-muted rounded";
  
  const variants = {
    text: "h-4 w-full",
    avatar: "h-12 w-12 rounded-full",
    card: "h-32 w-full",
    button: "h-10 w-24"
  };

  if (lines === 1) {
    return (
      <div 
        className={cn(baseClasses, variants[variant], className)}
        aria-label="Loading content"
        role="progressbar"
        aria-valuetext="Loading..."
      />
    );
  }

  return (
    <div className="space-y-2" aria-label="Loading multiple content items">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            baseClasses,
            variants[variant],
            index === lines - 1 && variant === "text" && "w-3/4",
            className
          )}
          role="progressbar"
          aria-valuetext="Loading..."
        />
      ))}
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="p-6 space-y-4" aria-label="Loading card content">
    <div className="flex items-center space-x-4">
      <SkeletonLoader variant="avatar" />
      <div className="space-y-2 flex-1">
        <SkeletonLoader className="h-4 w-1/2" />
        <SkeletonLoader className="h-3 w-1/3" />
      </div>
    </div>
    <SkeletonLoader lines={3} />
    <SkeletonLoader variant="button" />
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6 p-6" aria-label="Loading dashboard">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonLoader key={i} variant="card" className="h-24" />
      ))}
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      <SkeletonLoader variant="card" className="h-64" />
      <SkeletonLoader variant="card" className="h-64" />
    </div>
  </div>
);
