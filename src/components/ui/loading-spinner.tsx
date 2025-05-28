
import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
}) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-muted border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  );
};

export const LoadingOverlay: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        {children && (
          <p className="text-sm text-muted-foreground">{children}</p>
        )}
      </div>
    </div>
  );
};
