
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Phone, MapPin, Clock, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Emergency = () => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState("");
  const [sosTimer, setSosTimer] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const activateSOS = () => {
    setIsSOSActive(true);
    setSosTimer(30);
    
    // Simulate getting location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        toast({
          title: "🚨 SOS Alert Sent!",
          description: `Emergency alert sent with your location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          variant: "destructive",
        });

        // Simulate countdown
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
            <h1 className="text-3xl font-bold text-red-700 mb-2">Emergency Center</h1>
            <p className="text-gray-600">Quick access to emergency services and SOS alerts</p>
          </div>

          {/* SOS Button */}
          <Card className="mb-8 border-red-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-700">Emergency SOS</CardTitle>
              <CardDescription>
                Press and hold for 3 seconds to send emergency alert with your location
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {!isSOSActive ? (
                <Button
                  className="w-48 h-48 rounded-full bg-red-500 hover:bg-red-600 text-white text-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                  onMouseDown={() => {
                    setTimeout(activateSOS, 3000);
                  }}
                  onTouchStart={() => {
                    setTimeout(activateSOS, 3000);
                  }}
                >
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-16 w-16 mb-2" />
                    <span>SOS</span>
                    <span className="text-sm font-normal">Hold for 3s</span>
                  </div>
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="w-48 h-48 mx-auto rounded-full bg-red-500 text-white flex items-center justify-center animate-pulse">
                    <div className="text-center">
                      <AlertTriangle className="h-16 w-16 mb-2 mx-auto" />
                      <div className="text-2xl font-bold">SOS ACTIVE</div>
                      <div className="text-lg">{sosTimer}s</div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={cancelSOS}>
                    Cancel SOS
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contacts Setup */}
          <Card className="mb-8">
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

          {/* Quick Emergency Contacts */}
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

          {/* Safety Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Safety Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
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
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>Use well-lit and populated routes, especially at night</p>
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
