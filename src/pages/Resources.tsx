
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, ExternalLink, Search, Download, Users, Star, Clock } from "lucide-react";
import { useState } from "react";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("all");

  const faculties = [
    { id: "all", name: "All Faculties" },
    { id: "science", name: "Faculty of Science" },
    { id: "engineering", name: "Faculty of Engineering" },
    { id: "arts", name: "Faculty of Arts" },
    { id: "social-science", name: "Faculty of Social Sciences" },
    { id: "education", name: "Faculty of Education" },
    { id: "law", name: "Faculty of Law" },
    { id: "medicine", name: "Faculty of Clinical Sciences" }
  ];

  const resources = [
    {
      id: 1,
      title: "Computer Science Past Questions (2020-2023)",
      faculty: "science",
      department: "Computer Science",
      type: "Past Questions",
      description: "Comprehensive collection of past examination questions for all CSC courses from 2020 to 2023.",
      uploader: "CSC Students Association",
      rating: 4.8,
      downloads: 1250,
      uploadDate: "1 week ago",
      link: "#"
    },
    {
      id: 2,
      title: "Engineering Mathematics Notes",
      faculty: "engineering",
      department: "Engineering",
      type: "Lecture Notes",
      description: "Detailed lecture notes covering Engineering Mathematics I & II with solved examples and practice problems.",
      uploader: "Dr. Akpan Samuel",
      rating: 4.9,
      downloads: 890,
      uploadDate: "3 days ago",
      link: "#"
    },
    {
      id: 3,
      title: "Constitutional Law Case Studies",
      faculty: "law",
      department: "Law",
      type: "Study Material",
      description: "Collection of important constitutional law cases with detailed analysis and legal principles.",
      uploader: "Law Faculty",
      rating: 4.7,
      downloads: 567,
      uploadDate: "1 day ago",
      link: "#"
    },
    {
      id: 4,
      title: "Organic Chemistry Lab Manual",
      faculty: "science",
      department: "Chemistry",
      type: "Lab Manual",
      description: "Step-by-step laboratory procedures and safety guidelines for organic chemistry practicals.",
      uploader: "Chemistry Department",
      rating: 4.6,
      downloads: 734,
      uploadDate: "5 days ago",
      link: "#"
    },
    {
      id: 5,
      title: "Educational Psychology Study Guide",
      faculty: "education",
      department: "Educational Foundations",
      type: "Study Guide",
      description: "Comprehensive study guide covering major theories and concepts in educational psychology.",
      uploader: "Education Students Forum",
      rating: 4.5,
      downloads: 445,
      uploadDate: "2 weeks ago",
      link: "#"
    },
    {
      id: 6,
      title: "Digital Signal Processing Assignments",
      faculty: "engineering",
      department: "Electronic Engineering",
      type: "Assignments",
      description: "Past assignments with solutions for Digital Signal Processing course, including MATLAB codes.",
      uploader: "EEE Study Group",
      rating: 4.8,
      downloads: 623,
      uploadDate: "4 days ago",
      link: "#"
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaculty = selectedFaculty === "all" || resource.faculty === selectedFaculty;
    return matchesSearch && matchesFaculty;
  });

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "past questions": return "bg-red-100 text-red-800";
      case "lecture notes": return "bg-blue-100 text-blue-800";
      case "study material": return "bg-green-100 text-green-800";
      case "lab manual": return "bg-purple-100 text-purple-800";
      case "study guide": return "bg-yellow-100 text-yellow-800";
      case "assignments": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Resources</h1>
            <p className="text-gray-600">
              Access study materials, past questions, and academic resources shared by the UniUyo community
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Resources</p>
                    <p className="text-2xl font-bold text-blue-600">{resources.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Downloads</p>
                    <p className="text-2xl font-bold text-green-600">
                      {resources.reduce((sum, resource) => sum + resource.downloads, 0).toLocaleString()}
                    </p>
                  </div>
                  <Download className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Contributors</p>
                    <p className="text-2xl font-bold text-purple-600">156</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">4.7</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search resources, courses, or departments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {faculties.map((faculty) => (
                    <Button
                      key={faculty.id}
                      variant={selectedFaculty === faculty.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFaculty(faculty.id)}
                      className="text-xs"
                    >
                      {faculty.name.replace("Faculty of ", "")}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resources Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getTypeColor(resource.type)}>
                          {resource.type}
                        </Badge>
                        <Badge variant="outline">
                          {resource.department}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mb-2">{resource.title}</CardTitle>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">{resource.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        {renderStars(resource.rating)}
                        <span className="ml-2 text-gray-600">{resource.rating}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Download className="h-4 w-4 mr-1" />
                        {resource.downloads.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {resource.uploader}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {resource.uploadDate}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filter criteria.</p>
              </CardContent>
            </Card>
          )}

          {/* Upload Resource */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Share Your Resources</CardTitle>
              <CardDescription className="text-blue-600">
                Help your fellow students by sharing study materials and resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-blue-700">
                  Contribute to the UniUyo academic community by uploading your notes, past questions, 
                  assignments, and other study materials. Quality resources are rewarded with community recognition.
                </p>
                <div className="flex space-x-3">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Upload Resource
                  </Button>
                  <Button variant="outline">
                    Upload Guidelines
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Categories */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Popular Categories</CardTitle>
              <CardDescription>Most accessed resource types this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-700 mb-2">Past Questions</h3>
                  <p className="text-sm text-red-600">2,450 downloads</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700 mb-2">Lecture Notes</h3>
                  <p className="text-sm text-blue-600">1,890 downloads</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-700 mb-2">Study Materials</h3>
                  <p className="text-sm text-green-600">1,340 downloads</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resources;
