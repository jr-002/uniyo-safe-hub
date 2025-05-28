
import * as React from "react";
import { cn } from "@/lib/utils";

export interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive" | "gradient";
  glowOnHover?: boolean;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = "default", glowOnHover = false, ...props }, ref) => {
    const variantClasses = {
      default: "bg-card border border-border rounded-lg",
      elevated: "card-elevated",
      interactive: "card-interactive",
      gradient: "gradient-card border border-border/50 rounded-xl shadow-md",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "p-6 transition-all duration-300",
          variantClasses[variant],
          glowOnHover && "hover:shadow-2xl hover:shadow-primary/10",
          className
        )}
        {...props}
      />
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

export { EnhancedCard };
