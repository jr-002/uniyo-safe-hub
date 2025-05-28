import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, MapPin, Clock, AlertTriangle, Shield, Info, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Alerts = () => {
  const [selectedArea, setSelectedArea] = useState("all");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initial fetch of alerts
    fetchAlerts();

    // Set up real-time subscription
    const alertsSubscription = supabase
      .channel('alerts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'safety_alerts'
        },
        (payload) => {
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            setAlerts(current => [payload.new, ...current]);
            toast({
              title: "New Alert",
              description: payload.new.title,
              variant: "destructive",
            });
          } else if (payload.eventType === 'UPDATE') {
            setAlerts(current =>
              current.map(alert =>
                alert.id === payload.new.id ? payload.new : alert
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setAlerts(current =>
              current.filter(alert => alert.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(alertsSubscription);
    };
  }, [toast]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('safety_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setAlerts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch alerts. Please try again later.",
        variant: "destructive",
      });
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const areas = [
    { value: "all", label: "All Areas" },
    { value: "main", label: "Main Campus" },
    { value: "town", label: "Town Campus" },
    { value: "hostels", label: "Hostels" },
    { value: "surroundings", label: "Surrounding Areas" }
  ];

  const getAlertIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "warning": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "info": return <Info className="h-5 w-5 text-blue-500" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string, active: boolean) => {
    if (!active) return "bg-gray-100 border-gray-200";
    
    switch (type) {
      case "warning": return "bg-red-50 border-red-200";
      case "info": return "bg-blue-50 border-blue-200";
      case "success": return "bg-green-50 border-green-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high": return <Badge variant="destructive">High Priority</Badge>;
      case "medium": return <Badge variant="secondary">Medium Priority</Badge>;
      case "low": return <Badge variant="outline">Low Priority</Badge>;
      default: return null;
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    selectedArea === "all" || alert.location_name?.toLowerCase().includes(selectedArea)
  );

  const activeAlertsCount = alerts.filter(alert => alert.is_active).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Safety Alerts</h1>
            <p className="text-gray-600">
              Stay informed about safety updates and important announcements in your area
            </p>
          </div>

          {/* Alert Summary */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Alerts</p>
                    <p className="text-3xl font-bold text-red-600">{activeAlertsCount}</p>
                  </div>
                  <AlertTriangle className="h-12 w-12 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Alerts</p>
                    <p className="text-3xl font-bold text-blue-600">{alerts.length}</p>
                  </div>
                  <Bell className="h-12 w-12 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Subscribed Areas</p>
                    <p className="text-3xl font-bold text-green-600">4</p>
                  </div>
                  <Shield className="h-12 w-12 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Area Filter */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter by Area</CardTitle>
              <CardDescription>Select areas you want to receive alerts for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {areas.map((area) => (
                  <Button
                    key={area.value}
                    variant={selectedArea === area.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedArea(area.value)}
                  >
                    {area.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`${getAlertColor(alert.alert_type, alert.is_active)} transition-all hover:shadow-md`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.alert_type)}
                      <div>
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {alert.location_name}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(alert.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getSeverityBadge(alert.alert_type)}
                      {!alert.is_active && <Badge variant="outline">Resolved</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{alert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No alerts for this area</h3>
                <p className="text-gray-600">You're all caught up! No active alerts for the selected area.</p>
              </CardContent>
            </Card>
          )}

          {/* Alert Settings */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Alert Preferences
              </CardTitle>
              <CardDescription>
                Customize how you receive safety alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-600">Receive instant alerts on your device</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Alerts</h3>
                    <p className="text-sm text-gray-600">Get daily summaries via email</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Location-Based</h3>
                    <p className="text-sm text-gray-600">Only receive alerts relevant to your location</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Alerts;