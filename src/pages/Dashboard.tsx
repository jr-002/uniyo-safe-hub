
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Shield, 
  Bell, 
  Phone, 
  Search,
  Newspaper,
  MapPin,
  Clock,
  Users,
  Plus,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="h-16 w-16 text-primary mx-auto animate-pulse-gentle" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse" />
            <div className="h-3 bg-muted/70 rounded w-24 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const emergencyActions = [
    {
      icon: AlertTriangle,
      title: "Emergency SOS",
      description: "Send immediate alert to security",
      color: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      path: "/emergency"
    },
    {
      icon: Phone,
      title: "Emergency Contacts",
      description: "Quick access to help numbers",
      color: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
      path: "/directory"
    }
  ];

  const quickActions = [
    {
      icon: Shield,
      title: "Report Incident",
      description: "Anonymous reporting system",
      path: "/reports",
      badge: "New"
    },
    {
      icon: Bell,
      title: "Safety Alerts",
      description: "Latest security updates",
      path: "/alerts",
      badge: "3"
    },
    {
      icon: Search,
      title: "Lost & Found",
      description: "Find or report lost items",
      path: "/lost-found"
    },
    {
      icon: Newspaper,
      title: "University Updates",
      description: "Latest campus news",
      path: "/updates"
    }
  ];

  const recentAlerts = [
    {
      type: "warning" as const,
      title: "Suspicious Activity Reported",
      location: "Near Main Gate",
      time: "2 hours ago",
      priority: "High"
    },
    {
      type: "info" as const,
      title: "Maintenance Notice",
      location: "Faculty of Science",
      time: "4 hours ago",
      priority: "Medium"
    },
    {
      type: "success" as const,
      title: "Lost Student ID Recovered",
      location: "University Library",
      time: "6 hours ago",
      priority: "Low"
    }
  ];

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Student";

  const headerActions = (
    <Button onClick={() => navigate("/reports")} className="gap-2">
      <Plus className="h-4 w-4" />
      Report Incident
    </Button>
  );

  return (
    <PageContainer
      title={`Welcome back, ${displayName}!`}
      description="Stay safe and connected with your campus community. Quick access to emergency services and safety tools."
      headerActions={headerActions}
      className="px-6 pb-8 space-y-8"
    >
      {/* Emergency Actions */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h2 className="text-xl font-semibold font-display text-destructive tracking-tight">
            Emergency Actions
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {emergencyActions.map(({ icon: Icon, title, description, color, path }) => (
            <EnhancedCard 
              key={title} 
              variant="interactive"
              glowOnHover 
              className="p-0 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate(path)}
            >
              <Button
                className={`w-full h-28 ${color} text-white text-lg font-semibold rounded-none flex items-center justify-start p-6 shadow-none hover:shadow-lg transition-all`}
              >
                <Icon className="h-12 w-12 mr-4 shrink-0 drop-shadow-md" />
                <div className="text-left">
                  <div className="text-xl font-display leading-tight mb-1">{title}</div>
                  <div className="text-sm font-normal opacity-90 leading-relaxed">{description}</div>
                </div>
              </Button>
            </EnhancedCard>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold font-display text-foreground tracking-tight">
            Quick Actions
          </h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View All
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map(({ icon: Icon, title, description, path, badge }) => (
            <EnhancedCard 
              key={title} 
              variant="elevated"
              glowOnHover
              className="text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              onClick={() => navigate(path)}
            >
              <div className="p-6 space-y-4">
                <div className="relative">
                  <Icon className="h-12 w-12 mx-auto text-primary drop-shadow-sm" />
                  {badge && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 bg-primary/10 text-primary border-primary/20"
                    >
                      {badge}
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg font-display leading-tight">{title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
                </div>
              </div>
            </EnhancedCard>
          ))}
        </div>
      </section>

      {/* Dashboard Content Grid */}
      <section className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <EnhancedCard variant="default" className="shadow-lg">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center text-foreground font-display text-lg">
              <Bell className="h-5 w-5 mr-3 text-primary" />
              Recent Alerts
              <Badge variant="secondary" className="ml-auto">Live</Badge>
            </CardTitle>
          </CardHeader>
          <div className="p-6">
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <Badge 
                    variant={alert.type === "warning" ? "destructive" : alert.type === "info" ? "secondary" : "default"}
                    className="capitalize shrink-0 mt-0.5"
                  >
                    {alert.priority}
                  </Badge>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium text-foreground leading-tight">{alert.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {alert.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {alert.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/alerts")}>
              View All Alerts
            </Button>
          </div>
        </EnhancedCard>

        {/* Community Stats */}
        <EnhancedCard variant="default" className="shadow-lg">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center text-foreground font-display text-lg">
              <Users className="h-5 w-5 mr-3 text-primary" />
              Community Stats
              <TrendingUp className="h-4 w-4 ml-auto text-green-500" />
            </CardTitle>
          </CardHeader>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
                <div className="space-y-1">
                  <span className="font-medium text-foreground">Active Users Today</span>
                  <div className="text-xs text-muted-foreground">+12% from yesterday</div>
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-display">1,247</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                <div className="space-y-1">
                  <span className="font-medium text-foreground">Items Recovered</span>
                  <div className="text-xs text-muted-foreground">This week</div>
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400 font-display">23</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg border border-orange-500/20">
                <div className="space-y-1">
                  <span className="font-medium text-foreground">Safety Reports</span>
                  <div className="text-xs text-muted-foreground">Pending review</div>
                </div>
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400 font-display">8</span>
              </div>
            </div>
          </div>
        </EnhancedCard>
      </section>
    </PageContainer>
  );
};

export default Dashboard;
