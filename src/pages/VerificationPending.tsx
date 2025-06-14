
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailCheck, ArrowLeft, RefreshCw, Clock, Info, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const VerificationPending = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const { resendConfirmation } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const validateEmail = (emailToValidate: string) => {
    if (!emailToValidate.trim()) {
      setEmailError(null);
      return true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToValidate)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleResendEmail = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to resend the confirmation.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    setIsResending(true);
    setResendCooldown(60); // Start cooldown immediately for better UX
    
    const { error } = await resendConfirmation(email);
    
    if (error) {
      toast({
        title: "Failed to Resend",
        description: error.message,
        variant: "destructive",
      });
      setResendCooldown(0); // Reset cooldown on error
    } else {
      toast({
        title: "New Email Sent!",
        description: "We've sent a fresh verification email to your inbox. The new link is valid for 24 hours.",
      });
    }
    
    setIsResending(false);
  };

  return (
    <div className="min-h-screen gradient-uniuyo flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl animate-scale-in card-elevated">
        <CardHeader className="text-center items-center pb-6">
          <div className="bg-primary/10 rounded-full p-4 mb-4">
            <MailCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl text-primary font-display">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-base max-w-sm mx-auto">
            We've sent a verification link to your email address to complete your registration for UniUyo Guardian.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          
          <div className="space-y-4">
             {/* Step-by-step instructions */}
            <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                What to do next:
              </h3>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                  <span>Check your email inbox (and the spam folder, just in case).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                  <span>Click the "Verify Email" button within 24 hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                  <span>You'll be automatically logged in to UniUyo Guardian.</span>
                </li>
              </ol>
            </div>
            {/* Token expiration warning */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">
                    Link Expires in 24 Hours
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Your verification link is time-sensitive. If it expires, you can request a new one below.
                  </p>
                </div>
              </div>
            </div>
          </div>
         
          {/* Resend email section */}
          <div className="space-y-4 border-t pt-6">
            <div className="text-center">
              <p className="font-semibold text-foreground mb-2">
                Didn't get the email?
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your email address to get a fresh verification link.
              </p>
              <div className="space-y-2 max-w-sm mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  className={`text-center ${emailError ? 'border-destructive ring-destructive' : ''}`}
                  aria-invalid={!!emailError}
                  aria-describedby="email-error"
                />
                {emailError && <p id="email-error" className="text-xs text-destructive text-left">{emailError}</p>}
                <Button 
                  onClick={handleResendEmail}
                  disabled={isResending || resendCooldown > 0}
                  className="w-full bg-uniuyo-green hover:bg-uniuyo-green/90"
                  size="lg"
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

          {/* Navigation */}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationPending;
