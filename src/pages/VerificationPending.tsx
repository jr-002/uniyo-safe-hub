
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VerificationPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-uniuyo flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="relative mx-auto mb-4">
            <Shield className="h-12 w-12 text-uniuyo-red" />
            <Mail className="h-6 w-6 text-uniuyo-gold absolute -bottom-1 -right-1" />
          </div>
          <CardTitle className="text-uniuyo-red">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
              <ol className="text-sm text-blue-700 space-y-1 text-left">
                <li>1. Check your email inbox</li>
                <li>2. Click the verification link</li>
                <li>3. You'll be redirected back to UniUyo Guardian</li>
                <li>4. Start using your campus safety companion!</li>
              </ol>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Didn't receive the email? Check your spam folder or contact support.</p>
            </div>
          </div>

          <div className="space-y-3">
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
