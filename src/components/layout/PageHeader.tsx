
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BreadcrumbNavigation } from "@/components/ui/breadcrumb-navigation";
import { Menu } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  showBreadcrumbs?: boolean;
  children?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  showBreadcrumbs = true, 
  children 
}: PageHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Mobile header */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b border-border md:hidden">
        <SidebarTrigger className="md:hidden">
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        <h1 className="text-lg font-semibold font-display truncate">{title}</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Desktop breadcrumbs and header */}
      <div className="hidden md:block px-6 pt-6">
        {showBreadcrumbs && <BreadcrumbNavigation />}
        
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
                {title}
              </h1>
              <SidebarTrigger className="hidden md:flex">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
            </div>
            {description && (
              <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {children && (
            <div className="flex items-center gap-2">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Mobile content header */}
      <div className="md:hidden px-4">
        {showBreadcrumbs && <BreadcrumbNavigation />}
        {description && (
          <p className="text-muted-foreground text-sm mb-4">
            {description}
          </p>
        )}
        {children && (
          <div className="flex items-center gap-2 mb-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
