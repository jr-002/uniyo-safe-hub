
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Clock, RefreshCw } from "lucide-react";

interface ResendFormProps {
  email: string;
  setEmail: (email: string) => void;
  emailError: string | null;
  validateEmail: (email: string) => boolean;
  handleResendEmail: () => Promise<void>;
  isResending: boolean;
  resendCooldown: number;
}

export const ResendForm = ({
  email,
  setEmail,
  emailError,
  validateEmail,
  handleResendEmail,
  isResending,
  resendCooldown,
}: ResendFormProps) => (
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
);
