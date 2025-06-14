
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const PageNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3 pt-4 border-t">
      <p className="text-xs text-muted-foreground text-center">
        If you have already verified your email, you can go back to the login page.
      </p>
      <Button 
        onClick={() => navigate("/")} 
        variant="outline" 
        className="w-full"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Login
      </Button>
      <p className="text-xs text-gray-500 text-center pt-2">
        Still having trouble? Contact support at <a href="mailto:support@uniuyo.edu.ng" className="font-semibold text-primary hover:underline">support@uniuyo.edu.ng</a>.
      </p>
    </div>
  );
};
