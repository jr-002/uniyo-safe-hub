
import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  colorScheme?: "blue" | "green" | "orange" | "red" | "purple";
  className?: string;
}

const colorSchemes = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    icon: "text-blue-600 dark:text-blue-400",
    value: "text-blue-700 dark:text-blue-300",
    trend: "text-blue-600 dark:text-blue-400",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    icon: "text-green-600 dark:text-green-400",
    value: "text-green-700 dark:text-green-300",
    trend: "text-green-600 dark:text-green-400",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    icon: "text-orange-600 dark:text-orange-400",
    value: "text-orange-700 dark:text-orange-300",
    trend: "text-orange-600 dark:text-orange-400",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    icon: "text-red-600 dark:text-red-400",
    value: "text-red-700 dark:text-red-300",
    trend: "text-red-600 dark:text-red-400",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    icon: "text-purple-600 dark:text-purple-400",
    value: "text-purple-700 dark:text-purple-300",
    trend: "text-purple-600 dark:text-purple-400",
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  colorScheme = "blue",
  className,
}) => {
  const colors = colorSchemes[colorScheme];

  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("text-3xl font-bold", colors.value)}>{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className={cn("rounded-full p-3", colors.bg)}>
          <Icon className={cn("h-6 w-6", colors.icon)} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              trend.isPositive
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
          <span className="ml-2 text-sm text-muted-foreground">
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
};
