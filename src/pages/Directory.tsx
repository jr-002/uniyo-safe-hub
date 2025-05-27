
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, Search, Shield, MapPin, Clock, Users } from "lucide-react";
import { useState } from "react";

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const emergencyContacts = [
    {
      category: "University Security",
      contacts: [
        {
          name: "UniUyo Security Control Room",
          number: "08012345678",
          description: "24/7 campus security emergency line",
          location: "Main Campus",
          availability: "24/7"
        },
        {
          name: "Town Campus Security",
          number: "08012345679",
          description: "Security for Town Campus area",
          location: "Town Campus",
          availability: "24/7"
        }
      ]
    },
    {
      category: "Emergency Services",
      contacts: [
        {
          name: "Nigeria Police Force",
          number: "199",
          description: "National emergency police line",
          location: "Nationwide",
          availability: "24/7"
        },
        {
          name: "Akwa Ibom State Fire Service",
          number: "08033043564",
          description: "Fire emergencies and rescue operations",
          location: "Uyo, Akwa Ibom",
          availability: "24/7"
        },
        {
          name: "National Emergency Management Agency",
          number: "199",
          description: "Major disaster and emergency response",
          location: "Nationwide",
          availability: "24/7"
        }
      ]
    },
    {
      category: "Medical Services",
      contacts: [
        {
          name: "University of Uyo Teaching Hospital",
          number: "08033123456",
          description: "Primary medical facility for university",
          location: "Uyo",
          availability: "24/7"
        },
        {
          name: "St. Luke's Hospital",
          number: "08033654321",
          description: "Private hospital near campus",
          location: "Uyo",
          availability: "24/7"
        },
        {
          name: "Medical Emergency Ambulance",
          number: "199",
          description: "Emergency medical transport",
          location: "Uyo Area",
          availability: "24/7"
        }
      ]
    },
    {
      category: "Student Support",
      contacts: [
        {
          name: "Student Affairs Office",
          number: "08012345680",
          description: "Student support and counseling services",
          location: "Main Campus",
          availability: "8 AM - 5 PM"
        },
        {
          name: "Campus Clinic",
          number: "08012345681",
          description: "Basic medical care for students",
          location: "Main Campus",
          availability: "8 AM - 6 PM"
        },
        {
          name: "Guidance & Counseling Unit",
          number: "08012345682",
          description: "Mental health and academic guidance",
          location: "Main Campus",
          availability: "9 AM - 4 PM"
        }
      ]
    },
    {
      category: "Transportation",
      contacts: [
        {
          name: "Campus Shuttle Service",
          number: "08012345683",
          description: "Inter-campus transportation coordination",
          location: "All Campuses",
          availability: "6 AM - 10 PM"
        },
        {
          name: "Taxi Association (Uyo)",
          number: "08033777888",
          description: "Safe taxi services for students",
          location: "Uyo Area",
          availability: "24/7"
        }
      ]
    }
  ];

  const filteredContacts = emergencyContacts.map(category => ({
    ...category,
    contacts: category.contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.contacts.length > 0);

  const makeCall = (number: string) => {
    window.open(`tel:${number}`);
  };

  const getAvailabilityColor = (availability: string) => {
    return availability === "24/7" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Directory</h1>
            <p className="text-gray-600">
              Quick access to emergency contacts and essential services
            </p>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search emergency contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold text-red-700 mb-2">UniUyo Security</h3>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => makeCall("08012345678")}
                >
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-blue-700 mb-2">Police Emergency</h3>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => makeCall("199")}
                >
                  Call 199
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-green-700 mb-2">Medical Emergency</h3>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => makeCall("08033123456")}
                >
                  Call Hospital
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Categories */}
          <div className="space-y-6">
            {filteredContacts.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="text-xl">{category.category}</CardTitle>
                  <CardDescription>
                    {category.contacts.length} contact{category.contacts.length !== 1 ? 's' : ''} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {category.contacts.map((contact, contactIndex) => (
                      <Card key={contactIndex} className="bg-white border hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{contact.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{contact.description}</p>
                            </div>
                            <Button
                              size="sm"
                              className="ml-4 bg-green-600 hover:bg-green-700"
                              onClick={() => makeCall(contact.number)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-lg font-mono font-semibold text-blue-600">
                              {contact.number}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-1" />
                                {contact.location}
                              </div>
                              <Badge className={getAvailabilityColor(contact.availability)}>
                                <Clock className="h-3 w-3 mr-1" />
                                {contact.availability}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredContacts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts found</h3>
                <p className="text-gray-600">Try adjusting your search terms.</p>
              </CardContent>
            </Card>
          )}

          {/* Important Notice */}
          <Card className="mt-8 bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800">Important Notice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>• Always call local emergency services (199) for life-threatening emergencies</p>
                <p>• For campus-specific issues, contact UniUyo Security first</p>
                <p>• Keep this directory accessible even when offline by bookmarking</p>
                <p>• Report any outdated contact information to help keep this directory current</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Directory;
