
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle, Timer, FileText } from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: AlertTriangle, label: "Emergency", path: "/emergency" },
    { icon: Timer, label: "Safety Timer", path: "/safety-timer" },
    { icon: FileText, label: "Reports", path: "/reports" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50 shadow-lg z-40 animate-slide-up">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Button
            key={path}
            variant="ghost"
            size="sm"
            className={`flex flex-col h-16 w-full rounded-lg transition-colors duration-200 ${
              isActive(path)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground"
            }`}
            onClick={() => navigate(path)}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium tracking-tight">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
