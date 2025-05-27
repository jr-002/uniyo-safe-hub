
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, AlertTriangle, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Simulate login
      localStorage.setItem("user", JSON.stringify({ email, name: "Student User" }));
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in to UniUyo Guardian.",
      });
      navigate("/dashboard");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && name && department) {
      // Simulate registration
      localStorage.setItem("user", JSON.stringify({ email, name, department }));
      toast({
        title: "Account created!",
        description: "Welcome to UniUyo Guardian. Stay safe!",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-blue-600 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">UniUyo Guardian</h1>
              <p className="text-xl text-blue-600 font-medium">Your Campus Safety Companion</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empowering University of Uyo students with safety tools, academic resources, 
            and community support - all in one secure platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Emergency SOS</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Instant emergency alerts with GPS location to your contacts and security
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Safety Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Anonymous incident reporting to keep the campus community informed
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Lost & found, safety alerts, and peer support within your campus area
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-purple-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                University updates, academic resources, and essential campus information
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Auth Section */}
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Get Started</CardTitle>
              <CardDescription className="text-center">
                Join the UniUyo Guardian community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Student Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Login to Guardian
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Student Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
