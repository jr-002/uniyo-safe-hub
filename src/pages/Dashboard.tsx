
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Users
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      return;
    }

    if (user) {
      // Fetch user profile
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setProfile(data);
      };
      fetchProfile();
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {profile?.full_name || user.email}!
            </h1>
            <p className="text-gray-600">Stay safe and stay connected with your campus community.</p>
          </div>

          {/* Emergency Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-red-700">Emergency Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {emergencyActions.map(({ icon: Icon, title, description, color, path }) => (
                <Card key={title} className="hover:shadow-lg transition-shadow cursor-pointer border-red-200">
                  <CardContent className="p-6">
                    <Button
                      className={`w-full h-20 ${color} text-white text-lg font-semibold`}
                      onClick={() => navigate(path)}
                    >
                      <Icon className="h-8 w-8 mr-3" />
                      <div className="text-left">
                        <div>{title}</div>
                        <div className="text-sm font-normal opacity-90">{description}</div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map(({ icon: Icon, title, description, path }) => (
                <Card key={title} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(path)}>
                  <CardHeader className="text-center pb-2">
                    <Icon className="h-12 w-12 mx-auto text-blue-600 mb-2" />
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Badge variant={alert.type === "warning" ? "destructive" : alert.type === "info" ? "secondary" : "default"}>
                        {alert.type}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {alert.location}
                          <Clock className="h-4 w-4 ml-4 mr-1" />
                          {alert.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Active Users Today</span>
                    <span className="text-2xl font-bold text-blue-600">1,247</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Items Recovered</span>
                    <span className="text-2xl font-bold text-green-600">23</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">Safety Reports</span>
                    <span className="text-2xl font-bold text-orange-600">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
