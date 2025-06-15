
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdvancedToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const typeStyles = {
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
};

export const AdvancedToast = ({
  id,
  type,
  title,
  description,
  duration = 5000,
  persistent = false,
  action,
  onDismiss,
}: AdvancedToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, persistent]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.(id);
    }, 300);
  };

  const Icon = icons[type];

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300',
        typeStyles[type],
        isExiting ? 'animate-slide-out-right opacity-0 scale-95' : 'animate-slide-in-right'
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      
      <div className="ml-3 flex-1">
        <div className="text-sm font-medium">{title}</div>
        {description && (
          <div className="mt-1 text-sm opacity-90">{description}</div>
        )}
        
        {action && (
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={action.onClick}
              className="h-8 text-xs"
            >
              {action.label}
            </Button>
          </div>
        )}
      </div>
      
      <div className="ml-4 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-black/5"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Toast container component
export const ToastContainer = ({ 
  toasts, 
  position = 'top-right' 
}: { 
  toasts: AdvancedToastProps[];
  position?: AdvancedToastProps['position'];
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div 
      className={cn(
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        positionClasses[position]
      )}
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <AdvancedToast key={toast.id} {...toast} />
      ))}
    </div>
  );
};
