
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, User, CreditCard, Smartphone, Backpack, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LostFound = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemType, setItemType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const { toast } = useToast();

  const [lostItems, setLostItems] = useState([
    {
      id: 1,
      type: "Student ID",
      name: "John Doe",
      matricNumber: "CSC/2020/123",
      location: "Library",
      description: "Blue student ID card with photo",
      timeReported: "2 hours ago",
      status: "Lost",
      contact: "johndoe@uniuyo.edu.ng"
    },
    {
      id: 2,
      type: "Phone",
      name: "Sarah Johnson",
      matricNumber: "ENG/2019/456",
      location: "Faculty of Engineering",
      description: "iPhone 12 with blue case, cracked screen",
      timeReported: "5 hours ago",
      status: "Lost",
      contact: "sarah.j@uniuyo.edu.ng"
    },
    {
      id: 3,
      type: "Laptop",
      name: "Anonymous",
      matricNumber: "N/A",
      location: "Computer Lab",
      description: "Dell laptop, black, with stickers",
      timeReported: "1 day ago",
      status: "Lost",
      contact: "Contact via app"
    }
  ]);

  const [foundItems, setFoundItems] = useState([
    {
      id: 1,
      type: "Student ID",
      finderName: "Mike Wilson",
      location: "Near Cafeteria",
      description: "Student ID for Mary Smith (BIO/2021/789)",
      timeFound: "3 hours ago",
      status: "Found",
      contact: "mikew@uniuyo.edu.ng"
    },
    {
      id: 2,
      type: "Keys",
      finderName: "Security Guard",
      location: "Parking Lot B",
      description: "Car keys with Toyota keychain",
      timeFound: "1 day ago",
      status: "Found",
      contact: "Security Office"
    }
  ]);

  const itemTypes = [
    { value: "id", label: "Student ID", icon: CreditCard },
    { value: "phone", label: "Phone", icon: Smartphone },
    { value: "laptop", label: "Laptop/Electronics", icon: Smartphone },
    { value: "bag", label: "Bag/Backpack", icon: Backpack },
    { value: "keys", label: "Keys", icon: Key },
    { value: "other", label: "Other", icon: Search }
  ];

  const handleReportLost = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemType && location && description && contactInfo) {
      const newLostItem = {
        id: lostItems.length + 1,
        type: itemTypes.find(t => t.value === itemType)?.label || itemType,
        name: "Current User",
        matricNumber: "Your Matric",
        location,
        description,
        timeReported: "Just now",
        status: "Lost",
        contact: contactInfo
      };
      
      setLostItems([newLostItem, ...lostItems]);
      
      toast({
        title: "Item Reported as Lost",
        description: "Your lost item has been added to the community database.",
      });

      // Reset form
      setItemType("");
      setLocation("");
      setDescription("");
      setContactInfo("");
    }
  };

  const handleReportFound = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemType && location && description && contactInfo) {
      const newFoundItem = {
        id: foundItems.length + 1,
        type: itemTypes.find(t => t.value === itemType)?.label || itemType,
        finderName: "Current User",
        location,
        description,
        timeFound: "Just now",
        status: "Found",
        contact: contactInfo
      };
      
      setFoundItems([newFoundItem, ...foundItems]);
      
      toast({
        title: "Item Reported as Found",
        description: "Thank you! The owner will be notified if there's a match.",
      });

      // Reset form
      setItemType("");
      setLocation("");
      setDescription("");
      setContactInfo("");
    }
  };

  const getItemIcon = (type: string) => {
    const itemType = itemTypes.find(item => item.label.toLowerCase().includes(type.toLowerCase()));
    const IconComponent = itemType?.icon || Search;
    return <IconComponent className="h-5 w-5" />;
  };

  const filteredLostItems = lostItems.filter(item =>
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFoundItems = foundItems.filter(item =>
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lost & Found</h1>
            <p className="text-gray-600">
              Community-powered platform to help recover lost items on campus
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Lost Items</p>
                    <p className="text-3xl font-bold text-red-600">{lostItems.length}</p>
                  </div>
                  <Search className="h-12 w-12 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Found Items</p>
                    <p className="text-3xl font-bold text-green-600">{foundItems.length}</p>
                  </div>
                  <Search className="h-12 w-12 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Reunited</p>
                    <p className="text-3xl font-bold text-blue-600">12</p>
                  </div>
                  <Search className="h-12 w-12 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="browse">Browse Items</TabsTrigger>
              <TabsTrigger value="report-lost">Report Lost</TabsTrigger>
              <TabsTrigger value="report-found">Report Found</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              {/* Search */}
              <Card>
                <CardContent className="p-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search lost and found items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Lost Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-700">Lost Items</CardTitle>
                    <CardDescription>Items that students are looking for</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredLostItems.map((item) => (
                        <div key={item.id} className="p-4 border rounded-lg bg-red-50 border-red-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getItemIcon(item.type)}
                              <h3 className="font-semibold">{item.type}</h3>
                            </div>
                            <Badge variant="destructive">Lost</Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                          <div className="flex items-center text-xs text-gray-600 space-x-4">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {item.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.timeReported}
                            </div>
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {item.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Found Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700">Found Items</CardTitle>
                    <CardDescription>Items waiting to be claimed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredFoundItems.map((item) => (
                        <div key={item.id} className="p-4 border rounded-lg bg-green-50 border-green-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getItemIcon(item.type)}
                              <h3 className="font-semibold">{item.type}</h3>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Found</Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                          <div className="flex items-center text-xs text-gray-600 space-x-4">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {item.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.timeFound}
                            </div>
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {item.finderName}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="report-lost">
              <Card>
                <CardHeader>
                  <CardTitle>Report Lost Item</CardTitle>
                  <CardDescription>
                    Help the community help you find your lost item
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleReportLost} className="space-y-4">
                    <div>
                      <Label htmlFor="lost-item-type">Item Type</Label>
                      <Select value={itemType} onValueChange={setItemType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item type" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="lost-location">Where did you lose it?</Label>
                      <Input
                        id="lost-location"
                        placeholder="e.g., Library, Faculty of Science, Hostel A"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="lost-description">Description</Label>
                      <Textarea
                        id="lost-description"
                        placeholder="Provide details to help identify your item..."
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="lost-contact">Contact Information</Label>
                      <Input
                        id="lost-contact"
                        placeholder="Email or phone number"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                      Report as Lost
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="report-found">
              <Card>
                <CardHeader>
                  <CardTitle>Report Found Item</CardTitle>
                  <CardDescription>
                    Help reunite someone with their lost item
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleReportFound} className="space-y-4">
                    <div>
                      <Label htmlFor="found-item-type">Item Type</Label>
                      <Select value={itemType} onValueChange={setItemType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item type" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="found-location">Where did you find it?</Label>
                      <Input
                        id="found-location"
                        placeholder="e.g., Library, Faculty of Science, Hostel A"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="found-description">Description</Label>
                      <Textarea
                        id="found-description"
                        placeholder="Describe the item you found..."
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="found-contact">Your Contact Information</Label>
                      <Input
                        id="found-contact"
                        placeholder="Email or phone number"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      Report as Found
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LostFound;
