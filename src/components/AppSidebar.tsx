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
  useSidebar, // Import useSidebar to access toggle for mobile if needed
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
  Settings // Added Settings icon
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AppLogo = () => (
  <Link to="/dashboard" className="flex items-center gap-2 px-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center">
    <Shield className="h-8 w-8 text-primary shrink-0 drop-shadow" />
    <span className="text-xl font-semibold font-display text-primary group-data-[collapsible=icon]:hidden tracking-tight">SafeHub</span>
  </Link>
);

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  // const { toggleSidebar } = useSidebar(); // For explicit mobile toggle if needed elsewhere

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Emergency Directory", href: "/directory", icon: List },
    { title: "Report Incident", href: "/reports", icon: Shield },
    { title: "Safety Alerts", href: "/alerts", icon: Bell },
    { title: "Lost & Found", href: "/lost-found", icon: Search },
    { title: "University Updates", href: "/updates", icon: File },
  ];

  const accountMenuItems = [
    { title: "Profile", href: "/profile", icon: User },
    // { title: "Settings", href: "/settings", icon: Settings }, // Example if settings page exists
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border bg-sidebar shadow-md z-30">
      <SidebarHeader className="p-0 h-16 flex items-center justify-between border-b border-sidebar-border bg-sidebar/60">
        <AppLogo />
        {/* Mobile trigger is usually outside sidebar or part of top app bar not handled here */}
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2 backdrop-blur-[var(--glass-blur)]"> {/* Added padding to content */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    variant="default" 
                    size="default" 
                    tooltip={{ children: item.title, side: "right", align: "center" }}
                    isActive={isActive(item.href)}
                    className="w-full justify-start"
                  >
                    <Link to={item.href}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto"> {/* Pushes this group to bottom if content allows */}
          <SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    variant="default" 
                    size="default" 
                    tooltip={{ children: item.title, side: "right", align: "center" }}
                    isActive={isActive(item.href)}
                    className="w-full justify-start"
                  >
                    <Link to={item.href}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleLogout} 
                    variant="default" 
                    size="default" 
                    tooltip={{ children: "Log Out", side: "right", align: "center" }}
                    className="w-full justify-start"
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
      <SidebarFooter className="p-4 border-t border-sidebar-border group-data-[collapsible=icon]:p-2">
        <p className="text-xs text-sidebar-foreground/70 text-center font-display group-data-[collapsible=icon]:hidden">
          UniUyo SafeHub &copy; {new Date().getFullYear()}
        </p>
        <p className="text-xs text-sidebar-foreground/70 text-center hidden group-data-[collapsible=icon]:block font-display">SH</p>
      </SidebarFooter>
    </Sidebar>
  );
}
