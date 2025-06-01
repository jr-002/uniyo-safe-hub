
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Shield, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the current session to check if user is now verified
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setError("Verification failed. Please try again.");
          setLoading(false);
          return;
        }

        if (session?.user) {
          setVerified(true);
          toast({
            title: "Email Verified!",
            description: "Your email has been successfully verified. Welcome to UniUyo Guardian!",
          });
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          setError("Verification incomplete. Please check your email and try again.");
        }
      } catch (err) {
        setError("An unexpected error occurred during verification.");
      } finally {
        setLoading(false);
      }
    };

    handleEmailVerification();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-uniuyo flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-uniuyo-red mx-auto mb-4" />
            <CardTitle>Verifying Email</CardTitle>
            <CardDescription>Please wait while we verify your email address...</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-sm text-gray-600">This should only take a moment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-uniuyo flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {verified ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-green-700">Email Verified!</CardTitle>
              <CardDescription>
                Your email has been successfully verified. You'll be redirected to your dashboard shortly.
              </CardDescription>
            </>
          ) : (
            <>
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-red-700">Verification Failed</CardTitle>
              <CardDescription>{error}</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {verified ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Welcome to UniUyo Guardian! Redirecting you to your dashboard...
              </p>
              <Button 
                onClick={() => navigate("/dashboard")} 
                className="w-full bg-uniuyo-green hover:bg-uniuyo-green/90"
              >
                Go to Dashboard Now
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/")} 
                variant="outline" 
                className="w-full"
              >
                Back to Login
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full bg-uniuyo-red hover:bg-uniuyo-red/90"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
