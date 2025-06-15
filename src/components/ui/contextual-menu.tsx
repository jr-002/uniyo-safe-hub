
import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ContextualAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
  shortcut?: string;
}

interface ContextualMenuProps {
  actions: ContextualAction[];
  trigger?: 'click' | 'right-click' | 'both';
  orientation?: 'horizontal' | 'vertical';
  align?: 'start' | 'center' | 'end';
  className?: string;
  children?: React.ReactNode;
}

export const ContextualMenu = ({
  actions,
  trigger = 'click',
  orientation = 'horizontal',
  align = 'end',
  className,
  children
}: ContextualMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (trigger === 'right-click' || trigger === 'both') {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setIsOpen(true);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (trigger === 'click' || trigger === 'both') {
      e.stopPropagation();
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        setPosition({
          x: align === 'end' ? rect.right : align === 'center' ? rect.left + rect.width / 2 : rect.left,
          y: rect.bottom + 4
        });
      }
      setIsOpen(!isOpen);
    }
  };

  const handleActionClick = (action: ContextualAction) => {
    if (!action.disabled) {
      action.onClick();
      setIsOpen(false);
    }
  };

  const Icon = orientation === 'horizontal' ? MoreHorizontal : MoreVertical;

  return (
    <div className={cn("relative", className)}>
      {children ? (
        <div 
          onContextMenu={handleContextMenu}
          onClick={handleClick}
          className="cursor-pointer"
        >
          {children}
        </div>
      ) : (
        <Button
          ref={triggerRef}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          aria-label="More actions"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <Icon className="h-4 w-4" />
        </Button>
      )}

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={menuRef}
            className="fixed z-50 min-w-48 bg-background border border-border rounded-lg shadow-lg py-1"
            style={{
              left: position.x,
              top: position.y,
              transform: align === 'end' ? 'translateX(-100%)' : align === 'center' ? 'translateX(-50%)' : undefined
            }}
            role="menu"
            aria-orientation="vertical"
          >
            {actions.map((action) => (
              <button
                key={action.id}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2",
                  action.disabled && "opacity-50 cursor-not-allowed",
                  action.variant === 'destructive' && "text-destructive hover:bg-destructive/10"
                )}
                onClick={() => handleActionClick(action)}
                disabled={action.disabled}
                role="menuitem"
              >
                {action.icon && <span className="h-4 w-4">{action.icon}</span>}
                <span className="flex-1">{action.label}</span>
                {action.shortcut && (
                  <span className="text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded">
                    {action.shortcut}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
