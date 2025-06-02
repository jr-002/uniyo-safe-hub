
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Shield, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        console.log('Auth callback triggered');
        
        // Get the current session to check if user is now verified
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Session data:', session);
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError("Verification failed. Please try again.");
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('User verified successfully:', session.user.email_confirmed_at);
          setVerified(true);
          toast({
            title: "Email Verified!",
            description: "Your email has been successfully verified. Welcome to UniUyo Guardian!",
          });
          
          // Start countdown
          const interval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                navigate("/dashboard");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
        } else {
          setError("Verification incomplete. Please check your email and try again.");
        }
      } catch (err) {
        console.error('Verification error:', err);
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
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="relative mx-auto mb-4">
              <Shield className="h-12 w-12 text-uniuyo-red mx-auto animate-pulse" />
            </div>
            <CardTitle>Verifying Email</CardTitle>
            <CardDescription>Please wait while we verify your email address...</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <LoadingSpinner size="lg" className="mb-4" />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                🔍 Checking your verification status...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-uniuyo flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl animate-scale-in">
        <CardHeader className="text-center">
          {verified ? (
            <>
              <div className="relative mx-auto mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                </div>
              </div>
              <CardTitle className="text-green-700 text-2xl">Email Verified!</CardTitle>
              <CardDescription className="text-base">
                Your email has been successfully verified. Welcome to UniUyo Guardian!
              </CardDescription>
            </>
          ) : (
            <>
              <div className="relative mx-auto mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                </div>
              </div>
              <CardTitle className="text-red-700 text-2xl">Verification Failed</CardTitle>
              <CardDescription className="text-base">{error}</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {verified ? (
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">🎉 You're all set!</h3>
                <p className="text-sm text-green-700">
                  Your UniUyo Guardian account is now active. You can access all safety features and community tools.
                </p>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <span>Redirecting to dashboard in</span>
                <div className="bg-uniuyo-red text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {countdown}
                </div>
                <span>seconds...</span>
              </div>
              
              <Button 
                onClick={() => navigate("/dashboard")} 
                className="w-full bg-gradient-to-r from-uniuyo-green to-uniuyo-green/90 hover:from-uniuyo-green/90 hover:to-uniuyo-green text-white font-semibold py-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to Dashboard Now
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">What can you do?</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Check your email for the verification link</li>
                  <li>• Look in your spam/junk folder</li>
                  <li>• Try logging in again from the main page</li>
                  <li>• Contact support if issues persist</li>
                </ul>
              </div>
              
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
