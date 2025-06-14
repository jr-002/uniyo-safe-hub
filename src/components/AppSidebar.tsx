
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  List, 
  Shield, 
  Bell, 
  Search, 
  File, 
  User, 
  LogOut,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AppLogo = () => (
  <Link to="/dashboard" className="flex items-center gap-3 px-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center">
    <div className="flex items-center justify-center h-8 w-8 bg-gradient-to-br from-uniuyo-red to-uniuyo-red/80 rounded-lg shadow-md shrink-0">
      <Shield className="h-5 w-5 text-white drop-shadow-sm" />
    </div>
    <div className="group-data-[collapsible=icon]:hidden">
      <span className="text-xl font-bold font-display text-foreground tracking-tight">SafeHub</span>
      <div className="text-xs text-muted-foreground font-medium">UniUyo</div>
    </div>
  </Link>
);

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const mainMenuItems = [
    { 
      title: "Dashboard", 
      href: "/dashboard", 
      icon: LayoutDashboard,
      description: "Overview and quick actions"
    },
    { 
      title: "Emergency Directory", 
      href: "/directory", 
      icon: List,
      description: "Emergency contacts"
    },
    { 
      title: "Report Incident", 
      href: "/reports", 
      icon: Shield,
      description: "Anonymous reporting",
      badge: "New"
    },
    { 
      title: "Safety Alerts", 
      href: "/alerts", 
      icon: Bell,
      description: "Latest safety updates",
      badge: "3"
    },
    { 
      title: "Lost & Found", 
      href: "/lost-found", 
      icon: Search,
      description: "Find lost items"
    },
    { 
      title: "University Updates", 
      href: "/updates", 
      icon: File,
      description: "Latest news"
    },
  ];

  const toolsMenuItems = [
    {
      title: "Safety Timer",
      href: "/safety-timer",
      icon: Clock,
      description: "Track your journey"
    },
    {
      title: "Emergency SOS",
      href: "/emergency",
      icon: AlertTriangle,
      description: "Quick emergency alert"
    },
  ];

  const accountMenuItems = [
    { 
      title: "Profile", 
      href: "/profile", 
      icon: User,
      description: "Account settings"
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  const renderMenuItem = (item: any) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton 
        asChild 
        variant="default" 
        size="default" 
        tooltip={{ 
          children: (
            <div className="text-center">
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          ), 
          side: "right", 
          align: "center" 
        }}
        isActive={isActive(item.href)}
        className="w-full justify-start group"
      >
        <Link to={item.href} className="flex items-center gap-3 w-full">
          <item.icon className="h-5 w-5 shrink-0" />
          <div className="flex-1 group-data-[collapsible=icon]:hidden">
            <div className="font-medium">{item.title}</div>
            <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
              {item.description}
            </div>
          </div>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto text-xs group-data-[collapsible=icon]:hidden">
              {item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border bg-sidebar/50 backdrop-blur-sm shadow-lg z-30">
      <SidebarHeader className="p-0 h-16 flex items-center justify-center border-b border-sidebar-border/50 bg-gradient-to-r from-background to-muted/30">
        <AppLogo />
      </SidebarHeader>
      
      <SidebarContent className="flex-grow p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only text-sm font-semibold text-sidebar-foreground/70 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only text-sm font-semibold text-sidebar-foreground/70 mb-2">
            Safety Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {toolsMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only text-sm font-semibold text-sidebar-foreground/70 mb-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {accountMenuItems.map(renderMenuItem)}
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleLogout} 
                    variant="default" 
                    size="default" 
                    tooltip={{ children: "Sign out of your account", side: "right", align: "center" }}
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border/50 bg-gradient-to-r from-muted/20 to-background group-data-[collapsible=icon]:p-2">
        <div className="text-center group-data-[collapsible=icon]:hidden">
          <p className="text-xs text-sidebar-foreground/70 font-display font-medium">
            UniUyo SafeHub
          </p>
          <p className="text-xs text-sidebar-foreground/50">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
        <p className="text-xs text-sidebar-foreground/70 text-center hidden group-data-[collapsible=icon]:block font-display font-bold">
          SH
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
