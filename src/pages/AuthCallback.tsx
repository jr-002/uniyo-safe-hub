
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

const AuthCallback = () => {
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Check for various URL parameters that indicate verification
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        const code = searchParams.get('code');
        
        console.log('Auth callback params:', { access_token: !!access_token, refresh_token: !!refresh_token, type, code: !!code });

        // Handle code exchange for session (newer Supabase flow)
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Code exchange error:', error);
            setErrorMessage(error.message);
            setVerificationStatus("error");
            return;
          }

          if (data.session?.user) {
            console.log('User verified via code exchange:', data.session.user.email);
            setVerificationStatus("success");
            toast({
              title: "Email Verified!",
              description: "Your email has been successfully verified. Welcome to UniUyo Guardian!",
            });
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
            return;
          }
        }

        // Handle legacy token-based verification
        if (access_token && refresh_token && type === 'signup') {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error('Session error:', error);
            setErrorMessage(error.message);
            setVerificationStatus("error");
            return;
          }

          if (data.session?.user) {
            console.log('User verified via token:', data.session.user.email);
            setVerificationStatus("success");
            toast({
              title: "Email Verified!",
              description: "Your email has been successfully verified. Welcome to UniUyo Guardian!",
            });
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
            return;
          }
        }

        // Check current session as fallback
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          setErrorMessage(sessionError.message);
          setVerificationStatus("error");
          return;
        }

        if (session?.user) {
          console.log('User already has session:', session.user.email);
          setVerificationStatus("success");
          toast({
            title: "Email Verified!",
            description: "Your email has been successfully verified. Welcome to UniUyo Guardian!",
          });
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          // No valid verification found
          setErrorMessage("No valid verification token found. The link may be expired or invalid.");
          setVerificationStatus("error");
        }

      } catch (error) {
        console.error('Verification error:', error);
        setErrorMessage("An unexpected error occurred during verification.");
        setVerificationStatus("error");
      }
    };

    handleEmailVerification();
  }, [searchParams, toast, navigate]);

  const handleContinueToDashboard = () => {
    navigate("/dashboard");
  };

  const handleReturnToLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen gradient-uniuyo flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl animate-scale-in">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl text-uniuyo-red flex items-center justify-center gap-2">
            {verificationStatus === "loading" && "Verifying Email..."}
            {verificationStatus === "success" && (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                Email Verified!
              </>
            )}
            {verificationStatus === "error" && (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                Verification Failed
              </>
            )}
          </CardTitle>
          <CardDescription className="text-base">
            {verificationStatus === "loading" && "Please wait while we verify your email address..."}
            {verificationStatus === "success" && "Your email has been successfully verified! You can now access all features of UniUyo Guardian."}
            {verificationStatus === "error" && "There was an issue verifying your email address."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center space-y-6">
          {verificationStatus === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner className="w-12 h-12" />
              <p className="text-sm text-gray-600 text-center">
                Processing your verification...
              </p>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="flex flex-col items-center space-y-4 w-full">
              <CheckCircle className="w-16 h-16 text-green-500" />
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full">
                <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Access emergency reporting features</li>
                  <li>• Connect with campus security</li>
                  <li>• View safety resources and alerts</li>
                  <li>• Participate in the campus safety community</li>
                </ul>
              </div>

              <Button 
                className="w-full bg-uniuyo-red hover:bg-uniuyo-red/90"
                onClick={handleContinueToDashboard}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue to Dashboard
              </Button>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="flex flex-col items-center space-y-4 w-full">
              <XCircle className="w-16 h-16 text-red-500" />
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full">
                <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
                <p className="text-sm text-red-700">
                  {errorMessage || "The verification link may be expired or invalid."}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
                <h3 className="font-semibold text-blue-800 mb-2">What can you do?</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Check if you clicked the most recent verification email</li>
                  <li>• Request a new verification email from the login page</li>
                  <li>• Contact support if the issue persists</li>
                </ul>
              </div>

              <div className="flex flex-col space-y-2 w-full">
                <Button 
                  variant="default"
                  className="w-full bg-uniuyo-green hover:bg-uniuyo-green/90"
                  onClick={handleReturnToLogin}
                >
                  Return to Login Page
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = "mailto:support@uniuyo.edu.ng"}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
