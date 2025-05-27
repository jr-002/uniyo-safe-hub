
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, Clock, User, ExternalLink, Calendar, GraduationCap, DollarSign, AlertCircle } from "lucide-react";

const Updates = () => {
  const updates = [
    {
      id: 1,
      title: "Second Semester Examination Timetable Released",
      category: "Academic",
      content: "The examination timetable for the 2023/2024 second semester has been published. Students are advised to check their faculty notice boards and the university portal for specific dates and venues.",
      date: "2 hours ago",
      author: "Academic Office",
      priority: "high",
      link: "#"
    },
    {
      id: 2,
      title: "Student Union Week Activities",
      category: "Events",
      content: "The Student Union Government presents a week-long series of activities including cultural displays, sports competitions, and career fair. Registration is now open for all interested students.",
      date: "5 hours ago",
      author: "Student Union",
      priority: "medium",
      link: "#"
    },
    {
      id: 3,
      title: "School Fees Payment Deadline Extended",
      category: "Finance",
      content: "Due to technical issues with the payment portal, the deadline for school fees payment has been extended to March 15th, 2024. Students are encouraged to complete their payments early.",
      date: "1 day ago",
      author: "Bursary Department",
      priority: "high",
      link: "#"
    },
    {
      id: 4,
      title: "New Library Operating Hours",
      category: "Services",
      content: "The Main Library will now be open from 7:00 AM to 11:00 PM on weekdays and 9:00 AM to 8:00 PM on weekends to better serve students during examination periods.",
      date: "2 days ago",
      author: "Library Services",
      priority: "medium",
      link: "#"
    },
    {
      id: 5,
      title: "Campus Network Maintenance Notice",
      category: "Technical",
      content: "Scheduled maintenance of the campus network infrastructure will occur this weekend. Internet services may be intermittent between 2:00 AM and 6:00 AM on Saturday and Sunday.",
      date: "3 days ago",
      author: "ICT Department",
      priority: "low",
      link: "#"
    },
    {
      id: 6,
      title: "Career Fair and Job Placement Drive",
      category: "Career",
      content: "Major employers will be on campus next week for recruitment activities. Final year students and postgraduates are especially encouraged to participate. CV writing workshops will be held in preparation.",
      date: "1 week ago",
      author: "Career Services",
      priority: "high",
      link: "#"
    }
  ];

  const categories = [
    { name: "Academic", icon: GraduationCap, color: "bg-blue-100 text-blue-800" },
    { name: "Events", icon: Calendar, color: "bg-purple-100 text-purple-800" },
    { name: "Finance", icon: DollarSign, color: "bg-green-100 text-green-800" },
    { name: "Services", icon: User, color: "bg-orange-100 text-orange-800" },
    { name: "Technical", icon: AlertCircle, color: "bg-gray-100 text-gray-800" },
    { name: "Career", icon: User, color: "bg-yellow-100 text-yellow-800" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.name === category);
    const IconComponent = cat?.icon || Newspaper;
    return <IconComponent className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.name === category);
    return cat?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">University Updates</h1>
            <p className="text-gray-600">
              Stay informed with the latest official announcements and news from UniUyo
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Updates</p>
                    <p className="text-2xl font-bold text-blue-600">{updates.length}</p>
                  </div>
                  <Newspaper className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">High Priority</p>
                    <p className="text-2xl font-bold text-red-600">
                      {updates.filter(u => u.priority === "high").length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-green-600">5</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Categories</p>
                    <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Filter */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm">
                  All Updates
                </Button>
                {categories.map((category) => (
                  <Button key={category.name} variant="outline" size="sm">
                    {getCategoryIcon(category.name)}
                    <span className="ml-2">{category.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Updates List */}
          <div className="space-y-6">
            {updates.map((update) => (
              <Card key={update.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getCategoryColor(update.category)}>
                          {getCategoryIcon(update.category)}
                          <span className="ml-1">{update.category}</span>
                        </Badge>
                        <Badge className={getPriorityColor(update.priority)}>
                          {update.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{update.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {update.date}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {update.author}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{update.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Subscription Notice */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Stay Updated</CardTitle>
              <CardDescription className="text-blue-600">
                Never miss important university announcements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-blue-700">
                  Enable push notifications to receive instant alerts for high-priority updates, 
                  examination schedules, and deadline reminders directly on your device.
                </p>
                <div className="flex space-x-3">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Enable Notifications
                  </Button>
                  <Button variant="outline">
                    Manage Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Updates;
