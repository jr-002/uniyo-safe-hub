
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Shield, Users, AlertTriangle, BookOpen, Sparkles, Zap, Globe, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signIn, user, loading } = useAuth();

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" };
    if (password.length < 6) return { strength: 1, text: "Too short", color: "text-red-500" };
    if (password.length < 8) return { strength: 2, text: "Weak", color: "text-orange-500" };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 3, text: "Fair", color: "text-yellow-500" };
    return { strength: 4, text: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  // Email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Redirect if already logged in
  if (!loading && user) {
    navigate("/dashboard");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

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
    if (!email || !password || !name || !department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to create your account.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (passwordStrength.strength < 3) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password with at least 8 characters, including uppercase, lowercase, and numbers.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { data, error } = await signUp(email, password, name, department);
    
    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      if (data.session) {
        // User is automatically logged in (email confirmation disabled)
        toast({
          title: "Account Created!",
          description: "Welcome to UniUyo Guardian! You're now logged in.",
        });
        navigate("/dashboard");
      } else {
        // Email confirmation required
        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account before logging in.",
        });
        navigate("/verification-pending");
      }
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-uniuyo flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Shield className="h-16 w-16 text-uniuyo-red mx-auto mb-4 animate-pulse-gentle" />
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-lg text-foreground/70">Loading UniUyo Guardian...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-uniuyo">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Shield className="h-16 w-16 text-uniuyo-red mr-4" />
              <Sparkles className="h-6 w-6 text-uniuyo-gold absolute -top-2 -right-2 animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-uniuyo-red to-uniuyo-green bg-clip-text text-transparent">
                UniUyo Guardian
              </h1>
              <p className="text-xl text-uniuyo-red font-medium">Your Campus Safety Companion</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Empowering University of Uyo students with cutting-edge safety tools, academic resources, 
            and community support - all in one secure, intelligent platform.
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <EnhancedCard 
            variant="interactive" 
            glowOnHover 
            className="text-center border-l-4 border-l-uniuyo-red animate-slide-up hover:scale-105 transition-transform duration-200"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader>
              <div className="relative mx-auto mb-4">
                <AlertTriangle className="h-12 w-12 text-uniuyo-red mx-auto" />
                <Zap className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <CardTitle className="text-lg">Emergency SOS</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed">
                Instant emergency alerts with GPS location to your contacts and security with real-time response
              </CardDescription>
            </CardContent>
          </EnhancedCard>

          <EnhancedCard 
            variant="interactive" 
            glowOnHover 
            className="text-center border-l-4 border-l-uniuyo-green animate-slide-up hover:scale-105 transition-transform duration-200"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader>
              <div className="relative mx-auto mb-4">
                <Shield className="h-12 w-12 text-uniuyo-green mx-auto" />
                <Lock className="h-5 w-5 text-green-600 absolute -bottom-1 -right-1" />
              </div>
              <CardTitle className="text-lg">Safety Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed">
                Anonymous incident reporting with advanced analytics to keep the campus community informed and safe
              </CardDescription>
            </CardContent>
          </EnhancedCard>

          <EnhancedCard 
            variant="interactive" 
            glowOnHover 
            className="text-center border-l-4 border-l-uniuyo-gold animate-slide-up hover:scale-105 transition-transform duration-200"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader>
              <div className="relative mx-auto mb-4">
                <Users className="h-12 w-12 text-uniuyo-gold mx-auto" />
                <Globe className="h-5 w-5 text-blue-500 absolute -bottom-1 -right-1" />
              </div>
              <CardTitle className="text-lg">Smart Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed">
                AI-powered lost & found, location-based safety alerts, and peer support within your campus area
              </CardDescription>
            </CardContent>
          </EnhancedCard>

          <EnhancedCard 
            variant="interactive" 
            glowOnHover 
            className="text-center border-l-4 border-l-purple-500 animate-slide-up hover:scale-105 transition-transform duration-200"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader>
              <div className="relative mx-auto mb-4">
                <BookOpen className="h-12 w-12 text-purple-500 mx-auto" />
                <Sparkles className="h-5 w-5 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <CardTitle className="text-lg">Smart Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed">
                University updates, academic resources, and essential campus information with intelligent recommendations
              </CardDescription>
            </CardContent>
          </EnhancedCard>
        </div>

        {/* Enhanced Auth Section */}
        <div className="max-w-md mx-auto animate-scale-in">
          <EnhancedCard variant="gradient" className="border-t-4 border-t-uniuyo-red shadow-xl card-enhanced">
            <CardHeader>
              <CardTitle className="text-center text-uniuyo-red flex items-center justify-center">
                <Shield className="h-5 w-5 mr-2" />
                Get Started
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Join the UniUyo Guardian community for a safer campus experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
                  <TabsTrigger value="login" className="transition-all duration-200">Login</TabsTrigger>
                  <TabsTrigger value="register" className="transition-all duration-200">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="Student Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-uniuyo-red/20"
                        />
                        {email && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isValidEmail(email) ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-uniuyo-red/20 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-uniuyo-red to-uniuyo-red/90 hover:from-uniuyo-red/90 hover:to-uniuyo-red text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" className="mr-2" />
                          Logging in...
                        </div>
                      ) : (
                        "Login to Guardian"
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-4">
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-uniuyo-green/20"
                      />
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="Student Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-uniuyo-green/20"
                        />
                        {email && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {isValidEmail(email) ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      <Input
                        type="text"
                        placeholder="Department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-uniuyo-green/20"
                      />
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="transition-all duration-200 focus:ring-2 focus:ring-uniuyo-green/20 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {password && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className={passwordStrength.color}>
                                Password strength: {passwordStrength.text}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  passwordStrength.strength === 1 ? 'bg-red-500 w-1/4' :
                                  passwordStrength.strength === 2 ? 'bg-orange-500 w-2/4' :
                                  passwordStrength.strength === 3 ? 'bg-yellow-500 w-3/4' :
                                  passwordStrength.strength === 4 ? 'bg-green-500 w-full' : 'w-0'
                                }`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-uniuyo-green to-uniuyo-green/90 hover:from-uniuyo-green/90 hover:to-uniuyo-green text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" className="mr-2" />
                          Creating Account...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </EnhancedCard>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center animate-fade-in">
          <p className="text-sm text-muted-foreground mb-4">Trusted by thousands of UniUyo students</p>
          <div className="flex justify-center space-x-8 text-muted-foreground">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              <span className="text-xs">Secure</span>
            </div>
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-1" />
              <span className="text-xs">Private</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              <span className="text-xs">Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
