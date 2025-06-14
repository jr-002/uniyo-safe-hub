
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export const VerificationHeader = () => (
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
);
