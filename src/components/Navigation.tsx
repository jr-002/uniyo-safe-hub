
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  AlertTriangle, 
  FileText, 
  Bell, 
  Phone, 
  Search,
  Newspaper,
  BookOpen,
  User,
  Menu,
  X,
  Shield,
  LogOut,
  Timer
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: AlertTriangle, label: "Emergency", path: "/emergency" },
    { icon: Timer, label: "Safety Timer", path: "/safety-timer" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Bell, label: "Alerts", path: "/alerts" },
    { icon: Phone, label: "Directory", path: "/directory" },
    { icon: Search, label: "Lost & Found", path: "/lost-found" },
    { icon: Newspaper, label: "Updates", path: "/updates" },
    { icon: BookOpen, label: "Resources", path: "/resources" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      navigate("/");
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-uniuyo-red" />
          <span className="font-bold text-lg text-uniuyo-red">Guardian</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
          <Card className="w-64 h-full bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-8">
                <Shield className="h-8 w-8 text-uniuyo-red" />
                <span className="font-bold text-lg text-uniuyo-red">UniUyo Guardian</span>
              </div>
              <nav className="space-y-2">
                {navItems.map(({ icon: Icon, label, path }) => (
                  <Button
                    key={path}
                    variant={isActive(path) ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive(path) ? "bg-uniuyo-red text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      navigate(path);
                      setIsOpen(false);
                    }}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {label}
                  </Button>
                ))}
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </nav>
            </div>
          </Card>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r z-40">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <Shield className="h-8 w-8 text-uniuyo-red" />
            <span className="font-bold text-lg text-uniuyo-red">UniUyo Guardian</span>
          </div>
          <nav className="space-y-2">
            {navItems.map(({ icon: Icon, label, path }) => (
              <Button
                key={path}
                variant={isActive(path) ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive(path) ? "bg-uniuyo-red text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => navigate(path)}
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </Button>
            ))}
            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.slice(0, 4).map(({ icon: Icon, label, path }) => (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              className={`flex flex-col h-16 ${
                isActive(path) ? "text-uniuyo-red bg-red-50" : "text-gray-600"
              }`}
              onClick={() => navigate(path)}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
