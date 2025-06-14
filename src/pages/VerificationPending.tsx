
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { VerificationHeader } from "@/components/verification/VerificationHeader";
import { Instructions } from "@/components/verification/Instructions";
import { ExpirationWarning } from "@/components/verification/ExpirationWarning";
import { ResendForm } from "@/components/verification/ResendForm";
import { PageNavigation } from "@/components/verification/PageNavigation";

const VerificationPending = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
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
        <VerificationHeader />
        
        <CardContent className="space-y-6">
          
          <div className="space-y-4">
            <Instructions />
            <ExpirationWarning />
          </div>
         
          <ResendForm
            email={email}
            setEmail={setEmail}
            emailError={emailError}
            validateEmail={validateEmail}
            handleResendEmail={handleResendEmail}
            isResending={isResending}
            resendCooldown={resendCooldown}
          />

          <PageNavigation />
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationPending;
