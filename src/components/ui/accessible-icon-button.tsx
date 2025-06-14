
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface AccessibleIconButtonProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  shortcut?: string;
}

export const AccessibleIconButton = React.memo(({
  icon: Icon,
  label,
  description,
  onClick,
  variant = "default",
  size = "default",
  className,
  disabled = false,
  loading = false,
  shortcut
}: AccessibleIconButtonProps) => {
  const buttonId = React.useId();
  const descriptionId = description ? `${buttonId}-description` : undefined;

  return (
    <div className="relative">
      <Button
        id={buttonId}
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled || loading}
        className={cn(
          "focus:ring-2 focus:ring-offset-2 focus:outline-none",
          "hover:scale-105 transition-transform duration-200",
          loading && "animate-pulse",
          className
        )}
        aria-label={label}
        aria-describedby={descriptionId}
        title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
      >
        <Icon className={cn(
          "h-4 w-4",
          size === "sm" && "h-3 w-3",
          size === "lg" && "h-5 w-5",
          size === "icon" && "h-4 w-4"
        )} />
        {size !== "icon" && <span className="sr-only">{label}</span>}
      </Button>
      
      {description && (
        <div id={descriptionId} className="sr-only">
          {description}
        </div>
      )}
      
      {shortcut && (
        <kbd className="absolute -top-2 -right-2 hidden group-hover:block px-1 py-0.5 text-xs bg-muted border rounded">
          {shortcut}
        </kbd>
      )}
    </div>
  );
});

AccessibleIconButton.displayName = "AccessibleIconButton";
