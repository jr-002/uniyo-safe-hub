
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, AlertTriangle, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signIn, user, loading } = useAuth();

  // Redirect if already logged in
  if (!loading && user) {
    navigate("/dashboard");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in to UniUyo Guardian.",
      });
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !department) return;

    setIsLoading(true);
    const { error } = await signUp(email, password, name, department);
    
    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Welcome to UniUyo Guardian. Stay safe!",
      });
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-uniuyo-red mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading UniUyo Guardian...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-uniuyo-red mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">UniUyo Guardian</h1>
              <p className="text-xl text-uniuyo-red font-medium">Your Campus Safety Companion</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empowering University of Uyo students with safety tools, academic resources, 
            and community support - all in one secure platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow border-l-4 border-l-uniuyo-red">
            <CardHeader>
              <AlertTriangle className="h-12 w-12 text-uniuyo-red mx-auto mb-2" />
              <CardTitle className="text-lg">Emergency SOS</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Instant emergency alerts with GPS location to your contacts and security
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-l-4 border-l-uniuyo-green">
            <CardHeader>
              <Shield className="h-12 w-12 text-uniuyo-green mx-auto mb-2" />
              <CardTitle className="text-lg">Safety Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Anonymous incident reporting to keep the campus community informed
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-l-4 border-l-uniuyo-gold">
            <CardHeader>
              <Users className="h-12 w-12 text-uniuyo-gold mx-auto mb-2" />
              <CardTitle className="text-lg">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Lost & found, safety alerts, and peer support within your campus area
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
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
          <Card className="border-t-4 border-t-uniuyo-red">
            <CardHeader>
              <CardTitle className="text-center text-uniuyo-red">Get Started</CardTitle>
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
                    <Button 
                      type="submit" 
                      className="w-full bg-uniuyo-red hover:bg-uniuyo-red/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login to Guardian"}
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
                    <Button 
                      type="submit" 
                      className="w-full bg-uniuyo-green hover:bg-uniuyo-green/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
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
