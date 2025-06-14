import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, Search, Shield, MapPin, Clock, Users, Menu } from "lucide-react";
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
    return availability === "24/7" ? "bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300" : "bg-blue-100 text-blue-800 dark:bg-blue-700/30 dark:text-blue-300";
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-y-auto">
          <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b md:hidden">
            <SidebarTrigger className="md:hidden">
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
            <h1 className="text-lg font-semibold">Emergency Directory</h1>
          </header>
          <main className="p-6 flex-grow">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">Emergency Directory</h1>
                <p className="text-muted-foreground">
                  Quick access to emergency contacts and essential services
                </p>
              </div>
              <SidebarTrigger className="hidden md:flex">
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
            </div>

            {/* Search */}
            <EnhancedCard variant="elevated" className="mb-6 p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search emergency contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-base" // Increased text size
                />
              </div>
            </EnhancedCard>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8"> {/* Increased gap */}
              <EnhancedCard variant="interactive" glowOnHover className="bg-red-500/10 dark:bg-red-500/20 border-red-500/30">
                <div className="p-6 text-center"> {/* CardContent equivalent */}
                  <Phone className="h-12 w-12 text-red-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">UniUyo Security</h3>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => makeCall("08012345678")}
                  >
                    Call Now
                  </Button>
                </div>
              </EnhancedCard>

              <EnhancedCard variant="interactive" glowOnHover className="bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30">
                <div className="p-6 text-center">
                  <Shield className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Police Emergency</h3>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => makeCall("199")}
                  >
                    Call 199
                  </Button>
                </div>
              </EnhancedCard>

              <EnhancedCard variant="interactive" glowOnHover className="bg-green-500/10 dark:bg-green-500/20 border-green-500/30">
                <div className="p-6 text-center">
                  <Users className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Medical Emergency</h3>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => makeCall("08033123456")}
                  >
                    Call Hospital
                  </Button>
                </div>
              </EnhancedCard>
            </div>

            {/* Contact Categories */}
            <div className="space-y-8"> {/* Increased spacing */}
              {filteredContacts.map((category, categoryIndex) => (
                <EnhancedCard key={categoryIndex} variant="default" className="overflow-hidden">
                  <CardHeader className="bg-muted/30 dark:bg-muted/10 p-4">
                    <CardTitle className="text-xl text-foreground">{category.category}</CardTitle>
                    <CardDescription>
                      {category.contacts.length} contact{category.contacts.length !== 1 ? 's' : ''} available
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <div className="grid md:grid-cols-2 gap-6"> {/* Increased gap */}
                      {category.contacts.map((contact, contactIndex) => (
                        <EnhancedCard key={contactIndex} variant="elevated" className="bg-card hover:shadow-primary/10">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1 text-foreground">{contact.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{contact.description}</p>
                              </div>
                              <Button
                                size="icon" // Made icon button slightly larger
                                variant="outline"
                                className="ml-4 border-primary text-primary hover:bg-primary/10 shrink-0"
                                onClick={() => makeCall(contact.number)}
                              >
                                <Phone className="h-5 w-5" />
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-lg font-mono font-semibold text-primary">
                                {contact.number}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 mr-1.5" />
                                  {contact.location}
                                </div>
                                <Badge className={`${getAvailabilityColor(contact.availability)} px-3 py-1 text-xs`}>
                                  <Clock className="h-3 w-3 mr-1.5" />
                                  {contact.availability}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </EnhancedCard>
                      ))}
                    </div>
                  </CardContent>
                </EnhancedCard>
              ))}
            </div>

            {filteredContacts.length === 0 && (
              <EnhancedCard variant="default" className="mt-8">
                <CardContent className="p-12 text-center">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No contacts found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms.</p>
                </CardContent>
              </EnhancedCard>
            )}

            {/* Important Notice */}
            <EnhancedCard variant="default" className="mt-8 bg-yellow-500/10 dark:bg-yellow-500/20 border-yellow-500/30">
              <CardHeader className="p-4">
                <CardTitle className="text-yellow-800 dark:text-yellow-300">Important Notice</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-sm text-yellow-700 dark:text-yellow-200 space-y-2">
                  <p>• Always call local emergency services (199) for life-threatening emergencies</p>
                  <p>• For campus-specific issues, contact UniUyo Security first</p>
                  <p>• Keep this directory accessible even when offline by bookmarking</p>
                  <p>• Report any outdated contact information to help keep this directory current</p>
                </div>
              </CardContent>
            </EnhancedCard>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Directory;
