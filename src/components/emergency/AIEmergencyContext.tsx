
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Brain, Loader2, Shield, User, MapPin, Clock } from 'lucide-react';
import { useEmergencyAI } from '@/hooks/useEmergencyAI';

interface AIEmergencyContextProps {
  emergencyType?: string;
  onContextGenerated?: (context: string) => void;
}

const AIEmergencyContext = ({ emergencyType, onContextGenerated }: AIEmergencyContextProps) => {
  const [additionalContext, setAdditionalContext] = useState('');
  const { isGenerating, emergencyContext, generateEmergencyContext, clearContext } = useEmergencyAI();

  const handleGenerateContext = async () => {
    const result = await generateEmergencyContext(emergencyType, additionalContext);
    if (result && onContextGenerated) {
      onContextGenerated(result.emergencyContext);
    }
  };

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-orange-600" />
          <span>AI Emergency Context</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="additional-context">Additional Context (Optional)</Label>
          <Textarea
            id="additional-context"
            placeholder="Describe the situation, injuries, or any other relevant details..."
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          onClick={handleGenerateContext}
          disabled={isGenerating}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Context...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Generate Emergency Context
            </>
          )}
        </Button>

        {emergencyContext && (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-orange-700 border-orange-300">
                  AI Generated Context
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(emergencyContext.timestamp).toLocaleTimeString()}
                </div>
              </div>
              
              <p className="text-gray-800 mb-3">{emergencyContext.emergencyContext}</p>
              
              {emergencyContext.userProfile && (
                <div className="space-y-2 text-sm">
                  {emergencyContext.userProfile.name && (
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-2 text-gray-500" />
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">{emergencyContext.userProfile.name}</span>
                    </div>
                  )}
                  {emergencyContext.userProfile.department && (
                    <div className="flex items-center">
                      <Shield className="h-3 w-3 mr-2 text-gray-500" />
                      <span className="font-medium">Department:</span>
                      <span className="ml-2">{emergencyContext.userProfile.department}</span>
                    </div>
                  )}
                  {emergencyContext.userProfile.emergencyContact && (
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-2 text-gray-500" />
                      <span className="font-medium">Emergency Contact:</span>
                      <span className="ml-2">{emergencyContext.userProfile.emergencyContact}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={clearContext}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Clear Context
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIEmergencyContext;
