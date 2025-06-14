import { PageContainer } from "@/components/layout/PageContainer";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, Search, Shield, MapPin, Clock, Users, Filter, Star } from "lucide-react";
import { useState } from "react";

interface Contact {
  name: string;
  number: string;
  description: string;
  location: string;
  availability: string;
  featured?: boolean;
}

interface ContactCategory {
  category: string;
  priority?: "high";
  contacts: Contact[];
}

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const emergencyContacts: ContactCategory[] = [
    {
      category: "University Security",
      priority: "high",
      contacts: [
        {
          name: "UniUyo Security Control Room",
          number: "08012345678",
          description: "24/7 campus security emergency line",
          location: "Main Campus",
          availability: "24/7",
          featured: true
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
    return availability === "24/7" 
      ? "bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300" 
      : "bg-blue-100 text-blue-800 dark:bg-blue-700/30 dark:text-blue-300";
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-2">
        <Filter className="h-4 w-4" />
        Filter
      </Button>
      <Button onClick={() => makeCall("199")} className="gap-2 bg-red-600 hover:bg-red-700">
        <Phone className="h-4 w-4" />
        Emergency
      </Button>
    </div>
  );

  return (
    <PageContainer
      title="Emergency Directory"
      description="Quick access to emergency contacts and essential services. Save these numbers to your phone for offline access."
      headerActions={headerActions}
      className="px-6 pb-8 space-y-8"
    >
      {/* Search Section */}
      <section>
        <EnhancedCard variant="elevated" className="p-6 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Find Emergency Contacts</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search by name, service, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 text-base h-12 border-border/50 focus:border-primary"
              />
            </div>
          </div>
        </EnhancedCard>
      </section>

      {/* Quick Emergency Actions */}
      <section>
        <h2 className="text-xl font-semibold font-display mb-6 text-foreground tracking-tight">
          Quick Emergency Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <EnhancedCard variant="interactive" glowOnHover className="bg-red-500/10 dark:bg-red-500/20 border-red-500/30 hover:border-red-500/50 transition-all">
            <div className="p-6 text-center space-y-4">
              <div className="relative">
                <Phone className="h-12 w-12 text-red-500 mx-auto" />
                <Star className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 fill-current" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-red-700 dark:text-red-400">UniUyo Security</h3>
                <p className="text-sm text-red-600 dark:text-red-300">Primary campus security</p>
              </div>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 shadow-lg"
                onClick={() => makeCall("08012345678")}
              >
                Call Now
              </Button>
            </div>
          </EnhancedCard>

          <EnhancedCard variant="interactive" glowOnHover className="bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30 hover:border-blue-500/50 transition-all">
            <div className="p-6 text-center space-y-4">
              <Shield className="h-12 w-12 text-blue-500 mx-auto" />
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-700 dark:text-blue-400">Police Emergency</h3>
                <p className="text-sm text-blue-600 dark:text-blue-300">National emergency line</p>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg"
                onClick={() => makeCall("199")}
              >
                Call 199
              </Button>
            </div>
          </EnhancedCard>

          <EnhancedCard variant="interactive" glowOnHover className="bg-green-500/10 dark:bg-green-500/20 border-green-500/30 hover:border-green-500/50 transition-all">
            <div className="p-6 text-center space-y-4">
              <Users className="h-12 w-12 text-green-500 mx-auto" />
              <div className="space-y-2">
                <h3 className="font-semibold text-green-700 dark:text-green-400">Medical Emergency</h3>
                <p className="text-sm text-green-600 dark:text-green-300">University hospital</p>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 shadow-lg"
                onClick={() => makeCall("08033123456")}
              >
                Call Hospital
              </Button>
            </div>
          </EnhancedCard>
        </div>
      </section>

      {/* Contact Categories */}
      <section>
        <h2 className="text-xl font-semibold font-display mb-6 text-foreground tracking-tight">
          All Emergency Contacts
        </h2>
        
        {filteredContacts.length === 0 ? (
          <EnhancedCard variant="default" className="shadow-lg animate-fade-in">
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No contacts found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or clear the search to see all contacts.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            </CardContent>
          </EnhancedCard>
        ) : (
          <div className="space-y-8">
            {filteredContacts.map((category, categoryIndex) => (
              <EnhancedCard 
                key={categoryIndex} 
                variant="default" 
                className="overflow-hidden shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${categoryIndex * 150}ms` }}
              >
                <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-foreground font-display">{category.category}</CardTitle>
                      <CardDescription className="mt-1">
                        {category.contacts.length} contact{category.contacts.length !== 1 ? 's' : ''} available
                      </CardDescription>
                    </div>
                    {category.priority === "high" && (
                      <Badge variant="destructive" className="shrink-0">High Priority</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6">
                    {category.contacts.map((contact, contactIndex) => (
                      <EnhancedCard 
                        key={contactIndex} 
                        variant="elevated" 
                        className="bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 animate-fade-in-up"
                        style={{ animationDelay: `${contactIndex * 75}ms` }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg text-foreground">{contact.name}</h3>
                                    {contact.featured && (
                                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{contact.description}</p>
                                </div>
                                <Button
                                  size="default"
                                  variant="outline"
                                  className="border-primary text-primary hover:bg-primary/10 shrink-0 shadow-sm"
                                  onClick={() => makeCall(contact.number)}
                                >
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call
                                </Button>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="text-lg font-mono font-semibold text-primary bg-primary/5 px-3 py-2 rounded-lg">
                                  {contact.number}
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {contact.location}
                                  </div>
                                  <Badge className={`${getAvailabilityColor(contact.availability)} px-3 py-1 text-xs font-medium`}>
                                    <Clock className="h-3 w-3 mr-1.5" />
                                    {contact.availability}
                                  </Badge>
                                </div>
                              </div>
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
        )}
      </section>

      {/* Important Notice */}
      <section>
        <EnhancedCard variant="default" className="bg-yellow-500/10 dark:bg-yellow-500/20 border-yellow-500/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Important Safety Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-yellow-700 dark:text-yellow-200 space-y-3 leading-relaxed">
              <p>• <strong>Life-threatening emergencies:</strong> Always call 199 (Police) or go to the nearest hospital</p>
              <p>• <strong>Campus incidents:</strong> Contact UniUyo Security first for faster response</p>
              <p>• <strong>Offline access:</strong> Save important numbers to your phone contacts</p>
              <p>• <strong>Updates:</strong> Report outdated information to help keep this directory current</p>
            </div>
          </CardContent>
        </EnhancedCard>
      </section>
    </PageContainer>
  );
};

export default Directory;
