
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Mail, ArrowLeft, RefreshCw, CheckCircle, Clock, ExternalLink, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const VerificationPending = () => {
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const { resendConfirmation } = useAuth();
  const { toast } = useToast();

  const handleResendEmail = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to resend the confirmation.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    const { error } = await resendConfirmation(email);
    
    if (error) {
      toast({
        title: "Failed to Resend",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "New Email Sent!",
        description: "We've sent a fresh verification email to your inbox. The new link is valid for 24 hours.",
      });
      
      // Start cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    setIsResending(false);
  };

  return (
    <div className="min-h-screen gradient-uniuyo flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl animate-scale-in">
        <CardHeader className="text-center pb-6">
          <div className="relative mx-auto mb-4">
            <div className="relative">
              <Shield className="h-12 w-12 text-uniuyo-red mx-auto" />
              <div className="absolute -top-1 -right-1 bg-uniuyo-gold rounded-full p-1">
                <Mail className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl text-uniuyo-red flex items-center justify-center gap-2">
            <Clock className="h-5 w-5" />
            Check Your Email
          </CardTitle>
          <CardDescription className="text-base">
            We've sent a verification link to your email address to complete your registration for UniUyo Guardian.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Token expiration warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Important: Link Expires in 24 Hours
            </h3>
            <p className="text-sm text-amber-700">
              Your verification link is valid for 24 hours from when it was sent. 
              If it expires, you can request a new one below.
            </p>
          </div>

          {/* Step-by-step instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Verification Steps:
            </h3>
            <ol className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <span>Check your email inbox (and spam folder)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <span>Click the "Verify Email" button within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <span>You'll be automatically brought back to UniUyo Guardian</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                <span>Start using all safety features immediately</span>
              </li>
            </ol>
          </div>

          {/* Important note about staying on the site */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              What Happens Next:
            </h3>
            <p className="text-sm text-green-700">
              After clicking the verification link, you'll be automatically redirected back to this site and logged in. 
              If the redirect doesn't work, simply return to this page - you'll be able to log in normally.
            </p>
          </div>

          {/* Resend email section */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Didn't receive the email or did your link expire? Enter your email address to get a fresh verification link.
              </p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-center"
                />
                <Button 
                  onClick={handleResendEmail}
                  disabled={isResending || resendCooldown > 0}
                  className="w-full bg-uniuyo-green hover:bg-uniuyo-green/90"
                >
                  {isResending ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Sending New Link...
                    </div>
                  ) : resendCooldown > 0 ? (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Resend in {resendCooldown}s
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Send New Verification Link
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Help section */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Still having trouble?</p>
            <p className="text-xs text-gray-500 mb-3">
              Contact support at <strong>support@uniuyo.edu.ng</strong> or visit the IT helpdesk.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = "mailto:support@uniuyo.edu.ng?subject=Email Verification Issue - UniUyo Guardian"}
            >
              Contact Support
            </Button>
          </div>

          {/* Navigation */}
          <div className="space-y-3 pt-4 border-t">
            <Button 
              onClick={() => navigate("/")} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationPending;
