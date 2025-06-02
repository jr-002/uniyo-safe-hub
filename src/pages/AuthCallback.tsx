import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

const AuthCallback = () => {
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setVerificationStatus("error");
          toast({
            variant: "destructive",
            title: "Verification Failed",
            description: "There was an error verifying your email. Please try again.",
          });
          return;
        }

        if (session?.user) {
          setVerificationStatus("success");
          toast({
            title: "Email Verified!",
            description: "Your email has been successfully verified. Welcome to UniYo Safe Hub!",
          });
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus("error");
      }
    };

    handleEmailVerification();
  }, [toast]);

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Email Verification
          </CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === "loading" && "Verifying your email address..."}
            {verificationStatus === "success" && "Your email has been verified successfully!"}
            {verificationStatus === "error" && "There was an error verifying your email."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {verificationStatus === "loading" && (
            <LoadingSpinner className="w-12 h-12" />
          )}

          {verificationStatus === "success" && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500" />
              <Button 
                className="w-full"
                onClick={() => {
                  const productionUrl = import.meta.env.VITE_APP_URL || window.location.origin;
                  window.location.href = productionUrl;
                }}
              >
                Return to UniYo Safe Hub
              </Button>
            </>
          )}

          {verificationStatus === "error" && (
            <>
              <XCircle className="w-12 h-12 text-destructive" />
              <Button 
                variant="secondary"
                className="w-full"
                onClick={() => {
                  const productionUrl = import.meta.env.VITE_APP_URL || window.location.origin;
                  window.location.href = productionUrl;
                }}
              >
                Return to UniYo Safe Hub
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
