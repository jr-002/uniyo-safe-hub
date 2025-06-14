
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
}

const routeLabels: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/directory": "Emergency Directory",
  "/reports": "Report Incident",
  "/alerts": "Safety Alerts",
  "/lost-found": "Lost & Found",
  "/updates": "University Updates",
  "/profile": "Profile",
  "/emergency": "Emergency",
  "/safety-timer": "Safety Timer",
  "/resources": "Resources",
};

export function BreadcrumbNavigation({ items }: BreadcrumbNavigationProps) {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Always start with Dashboard for authenticated pages
    if (location.pathname !== "/" && location.pathname !== "/dashboard") {
      breadcrumbs.push({ label: "Dashboard", href: "/dashboard" });
    }
    
    // Add current page
    const currentLabel = routeLabels[location.pathname] || "Page";
    breadcrumbs.push({ label: currentLabel });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.href && index < breadcrumbs.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link 
                    to={item.href}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {index === 0 && <Home className="h-4 w-4" />}
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-medium text-foreground">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
