import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Navigation from "@/components/Navigation"; // Removing old navigation
import { AppSidebar } from "@/components/AppSidebar"; // Import new sidebar
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"; // Import sidebar layout tools
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Card parts
import { EnhancedCard } from "@/components/ui/enhanced-card"; // Using EnhancedCard
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Shield, 
  Bell, 
  Phone, 
  Search,
  Newspaper, // Used File in sidebar, Newspaper for quick action is fine
  MapPin,
  Clock,
  Users,
  Menu // For sidebar trigger
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
// import { supabase } from "@/integrations/supabase/client"; // supabase client no longer needed here for profiles

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  // const [profile, setProfile] = useState<any>(null); // No longer fetching profile separately

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      // return; // No return needed here, navigation handles it
    }

    // User data is now directly available from 'user' object if needed for display name
    // if (user) {
    //   const fetchProfile = async () => {
    //     const { data } = await supabase
    //       .from('profiles') // This was causing the error
    //       .select('*')
    //       .eq('user_id', user.id)
    //       .single();
    //     setProfile(data);
    //   };
    //   fetchProfile();
    // }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse-gentle" />
          <p className="text-lg text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // User will be redirected by the useEffect hook, or you can return a message/redirect here too
    return null; // Or a specific "not logged in" component
  }

  const emergencyActions = [
    {
      icon: AlertTriangle,
      title: "Emergency SOS",
      description: "Send immediate alert",
      color: "bg-red-500 hover:bg-red-600",
      path: "/emergency"
    },
    {
      icon: Phone,
      title: "Emergency Contacts",
      description: "Call for help",
      color: "bg-orange-500 hover:bg-orange-600",
      path: "/directory"
    }
  ];

  const quickActions = [
    {
      icon: Shield,
      title: "Report Incident",
      description: "Anonymous reporting",
      path: "/reports"
    },
    {
      icon: Bell,
      title: "Safety Alerts",
      description: "View local alerts",
      path: "/alerts"
    },
    {
      icon: Search,
      title: "Lost & Found",
      description: "Find lost items",
      path: "/lost-found"
    },
    {
      icon: Newspaper,
      title: "University Updates",
      description: "Latest news",
      path: "/updates"
    }
  ];

  const recentAlerts = [
    {
      type: "warning",
      title: "Suspicious Activity",
      location: "Near Main Gate",
      time: "2 hours ago"
    },
    {
      type: "info",
      title: "Power Outage",
      location: "Faculty of Science",
      time: "4 hours ago"
    },
    {
      type: "success",
      title: "Lost ID Found",
      location: "Library",
      time: "6 hours ago"
    }
  ];

  // Get full_name from user_metadata, fallback to email
  const displayName = user?.user_metadata?.full_name || user?.email;

  return (
    <SidebarProvider defaultOpen={true}> {/* defaultOpen can be true or based on cookie */}
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-y-auto"> {/* Manages padding & responsiveness */}
          <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b md:hidden">
             {/* Mobile sidebar trigger */}
            <SidebarTrigger className="md:hidden"> 
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </header>
          <main className="p-6 flex-grow">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  Welcome back, {displayName}!
                </h1>
                <p className="text-muted-foreground">Stay safe and connected with your campus community.</p>
              </div>
              <SidebarTrigger className="hidden md:flex"> {/* Desktop sidebar trigger */}
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
            </div>

            {/* Emergency Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-destructive">Emergency Actions</h2>
              <div className="grid md:grid-cols-2 gap-6"> {/* Increased gap */}
                {emergencyActions.map(({ icon: Icon, title, description, color, path }) => (
                  <EnhancedCard 
                    key={title} 
                    variant="interactive" // Use EnhancedCard
                    glowOnHover 
                    className="p-0 overflow-hidden" // Remove padding for button to fill
                    onClick={() => navigate(path)}
                  >
                    <Button
                      className={`w-full h-24 ${color} text-white text-lg font-semibold rounded-none flex items-center justify-start p-6`} // Adjusted styles
                    >
                      <Icon className="h-10 w-10 mr-4 shrink-0" /> {/* Larger icon */}
                      <div className="text-left">
                        <div className="text-xl">{title}</div>
                        <div className="text-sm font-normal opacity-90">{description}</div>
                      </div>
                    </Button>
                  </EnhancedCard>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Increased gap */}
                {quickActions.map(({ icon: Icon, title, description, path }) => (
                  <EnhancedCard 
                    key={title} 
                    variant="elevated" // Use EnhancedCard
                    glowOnHover
                    className="text-center cursor-pointer transition-all hover:shadow-primary/20" 
                    onClick={() => navigate(path)}
                  >
                    <Icon className="h-12 w-12 mx-auto text-primary mb-3 mt-2" /> {/* Use primary color */}
                    <CardHeader className="p-4 pt-0 pb-2">
                      <CardTitle className="text-lg">{title}</CardTitle>
                      <CardDescription className="text-xs">{description}</CardDescription>
                    </CardHeader>
                  </EnhancedCard>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <EnhancedCard variant="default"> {/* Use EnhancedCard */}
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Bell className="h-5 w-5 mr-2 text-primary" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <div className="p-6 pt-0"> {/* CardContent equivalent */}
                  <div className="space-y-4">
                    {recentAlerts.map((alert, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Badge 
                          variant={alert.type === "warning" ? "destructive" : alert.type === "info" ? "secondary" : "default"}
                          className="capitalize"
                        >
                          {alert.type}
                        </Badge>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{alert.title}</h4>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {alert.location}
                            <Clock className="h-4 w-4 ml-4 mr-1" />
                            {alert.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </EnhancedCard>

              <EnhancedCard variant="default"> {/* Use EnhancedCard */}
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <div className="p-6 pt-0"> {/* CardContent equivalent */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
                      <span className="font-medium text-foreground">Active Users Today</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,247</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-500/10 dark:bg-green-500/20 rounded-lg">
                      <span className="font-medium text-foreground">Items Recovered</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">23</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg">
                      <span className="font-medium text-foreground">Safety Reports</span>
                      <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">8</span>
                    </div>
                  </div>
                </div>
              </EnhancedCard>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
