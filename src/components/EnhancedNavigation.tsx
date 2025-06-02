
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Menu, X, Home, AlertTriangle, Users, BookOpen, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const EnhancedNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      navigate("/");
    }
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: AlertTriangle, label: "Emergency", path: "/emergency" },
    { icon: Shield, label: "Reports", path: "/reports" },
    { icon: Users, label: "Community", path: "/lost-found" },
    { icon: BookOpen, label: "Resources", path: "/resources" },
    { icon: Search, label: "Directory", path: "/directory" },
  ];

  if (!user) return null;

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Card className="fixed top-4 left-4 right-4 z-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-uniuyo-red" />
                <span className="font-bold text-lg text-uniuyo-red">UniUyo Guardian</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMenuOpen(false)}>
            <Card className="absolute top-20 left-4 right-4 shadow-xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Button>
                  ))}
                  <hr className="my-4" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left text-red-600 hover:text-red-700"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="h-8 w-8 text-uniuyo-red" />
            <div>
              <h1 className="font-bold text-xl text-uniuyo-red">UniUyo Guardian</h1>
              <p className="text-sm text-gray-600">Campus Safety</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start text-left hover:bg-uniuyo-red/10"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => navigate("/profile")}
            >
              <User className="h-5 w-5 mr-3" />
              Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedNavigation;
