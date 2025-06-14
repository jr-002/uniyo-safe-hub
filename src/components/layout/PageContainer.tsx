
import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "./PageHeader";
import BottomNavigation from "./BottomNavigation";

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
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-y-auto main-content-area pb-20 md:pb-0">
          <PageHeader
            title={title}
            description={description}
            showBreadcrumbs={showBreadcrumbs}
          >
            {headerActions}
          </PageHeader>
          
          <main className={`flex-grow ${className} animate-fade-in-up`}>
            {children}
          </main>
        </SidebarInset>
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
}
