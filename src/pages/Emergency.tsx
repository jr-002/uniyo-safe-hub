import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Phone, MapPin, Clock, Users, Shield, Brain, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useOfflineEmergency } from "@/hooks/useOfflineEmergency";
import AIEmergencyContext from "@/components/emergency/AIEmergencyContext";
import CampusSafetyMap from "@/components/safety/CampusSafetyMap";
import { EmergencySOSButton } from "@/components/emergency/EmergencySOSButton";

const Emergency = () => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState("");
  const [sosTimer, setSosTimer] = useState(0);
  const [aiContext, setAiContext] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { isRegistered, sendEmergencyAlert } = usePushNotifications();
  const { isOnline, triggerOfflineEmergency, offlineQueue } = useOfflineEmergency();

  const activateSOS = () => {
    if (!isOnline) {
      // Handle offline emergency
      const offlineId = triggerOfflineEmergency('sos', {
        emergencyContact,
        aiContext,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "🚨 Offline Emergency Queued",
        description: "Emergency alert saved. Will be sent when connection is restored.",
        variant: "destructive",
      });
      return;
    }

    setIsSOSActive(true);
    setSosTimer(30);
    
    // Trigger push notification if registered
    if (isRegistered) {
      sendEmergencyAlert({
        type: 'emergency',
        message: 'SOS Alert activated',
        urgency: 'high'
      });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        let alertMessage = `🚨 SOS Alert Sent with location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        
        if (aiContext) {
          alertMessage += `\n\nAI Context: ${aiContext}`;
        }
        
        toast({
          title: "🚨 SOS Alert Sent!",
          description: alertMessage,
          variant: "destructive",
        });

        const countdown = setInterval(() => {
          setSosTimer((prev) => {
            if (prev <= 1) {
              clearInterval(countdown);
              setIsSOSActive(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      },
      (error) => {
        toast({
          title: "Location Error",
          description: "Unable to get location. SOS sent without coordinates.",
          variant: "destructive",
        });
      }
    );
  };

  const cancelSOS = () => {
    setIsSOSActive(false);
    setSosTimer(0);
    toast({
      title: "SOS Cancelled",
      description: "Emergency alert has been cancelled.",
    });
  };

  const emergencyContacts = [
    { name: "UniUyo Security", number: "08012345678", type: "Security" },
    { name: "Nigeria Police (Emergency)", number: "199", type: "Police" },
    { name: "Fire Service", number: "199", type: "Fire" },
    { name: "Medical Emergency", number: "199", type: "Medical" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-red-700 mb-2">Emergency Center</h1>
                <p className="text-gray-600">Quick access to emergency services and SOS alerts with AI-powered context</p>
              </div>
              
              {/* Connection Status */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isOnline 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
                {!isOnline && offlineQueue.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {offlineQueue.length} queued
                  </span>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="emergency" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="emergency">Emergency SOS</TabsTrigger>
              <TabsTrigger value="map">Campus Safety Map</TabsTrigger>
              <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
            </TabsList>

            <TabsContent value="emergency" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Enhanced SOS Button */}
                <Card className="border-red-200">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-red-700">Emergency SOS</CardTitle>
                    <CardDescription>
                      Press and hold for emergency alert with location and AI context
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <EmergencySOSButton 
                      onEmergencyTriggered={(location) => {
                        if (location) {
                          activateSOS();
                        }
                      }}
                      className="mx-auto"
                    />
                    
                    {!isOnline && (
                      <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                        <WifiOff className="h-4 w-4 inline mr-2" />
                        Offline mode: Emergency will be queued and sent when connection is restored
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* AI Emergency Context */}
                <AIEmergencyContext
                  emergencyType="SOS"
                  onContextGenerated={setAiContext}
                />
              </div>

              {/* Emergency Contact Setup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Emergency Contact
                  </CardTitle>
                  <CardDescription>
                    Add a personal emergency contact for SOS alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="emergency-contact">Emergency Contact Number</Label>
                      <Input
                        id="emergency-contact"
                        placeholder="+234 800 123 4567"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                      />
                    </div>
                    <Button className="w-full">Save Emergency Contact</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Campus Safety Map
                  </CardTitle>
                  <CardDescription>
                    View emergency stations, safe zones, and reported incidents across campus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CampusSafetyMap height="500px" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Emergency Services
                  </CardTitle>
                  <CardDescription>
                    Tap to call emergency services directly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {emergencyContacts.map((contact, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{contact.name}</h3>
                              <p className="text-sm text-gray-600">{contact.type}</p>
                              <p className="text-lg font-mono">{contact.number}</p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => window.open(`tel:${contact.number}`)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Safety Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Safety Tips & Enhanced Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3 text-sm">
                  <h3 className="font-semibold text-green-700">Safety Tips</h3>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Always inform someone about your whereabouts when going out</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Keep your phone charged and carry a power bank</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Trust your instincts - if something feels wrong, seek help</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <h3 className="font-semibold text-orange-700">AI-Enhanced Features</h3>
                  <div className="flex items-start space-x-2">
                    <Brain className="h-4 w-4 text-orange-500 mt-0.5" />
                    <p>AI generates context for emergency responders</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Brain className="h-4 w-4 text-orange-500 mt-0.5" />
                    <p>Automatic user profile and location sharing</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Brain className="h-4 w-4 text-orange-500 mt-0.5" />
                    <p>Recent campus incident analysis for better response</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <h3 className="font-semibold text-purple-700">New Features</h3>
                  <div className="flex items-start space-x-2">
                    <Wifi className="h-4 w-4 text-purple-500 mt-0.5" />
                    <p>Push notifications for emergency alerts</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <WifiOff className="h-4 w-4 text-purple-500 mt-0.5" />
                    <p>Offline emergency mode with sync when online</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-purple-500 mt-0.5" />
                    <p>Interactive campus safety map</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
