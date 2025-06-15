
import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "./PageHeader";
import BottomNavigation from "./BottomNavigation";
import { useTheme } from "@/components/ui/theme-provider";

interface PageContainerProps {
  title: string;
  description?: string;
  showBreadcrumbs?: boolean;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({
  title,
  description,
  showBreadcrumbs = true,
  headerActions,
  children,
  className = "",
}: PageContainerProps) {
  const { isDarkMode } = useTheme();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={`min-h-screen flex w-full transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-background via-background to-muted/20'
      }`}>
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <PageHeader
            title={title}
            description={description}
            showBreadcrumbs={showBreadcrumbs}
          >
            {headerActions}
          </PageHeader>
          
          <main className={`flex-1 overflow-y-auto pb-20 md:pb-6 px-4 md:px-6 ${className} animate-fade-in-up`}>
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
}
