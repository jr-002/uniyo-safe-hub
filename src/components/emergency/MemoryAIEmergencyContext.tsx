
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Brain, Loader2, Shield, User, MapPin, Clock, History, Zap } from 'lucide-react';
import { useMemoryEmergency } from '@/hooks/useMemoryEmergency';

interface MemoryAIEmergencyContextProps {
  emergencyType?: string;
  onContextGenerated?: (context: string) => void;
}

const MemoryAIEmergencyContext = ({ emergencyType, onContextGenerated }: MemoryAIEmergencyContextProps) => {
  const [additionalContext, setAdditionalContext] = useState('');
  const { 
    isGenerating, 
    emergencyContext, 
    generateMemoryEmergencyContext, 
    clearContext,
    sessionId 
  } = useMemoryEmergency();

  const handleGenerateContext = async () => {
    const result = await generateMemoryEmergencyContext(emergencyType, additionalContext);
    if (result && onContextGenerated) {
      onContextGenerated(result.emergencyContext);
    }
  };

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-orange-600" />
          <span>Memory-Enhanced Emergency AI</span>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardTitle>
        <div className="flex items-center space-x-2 mt-2">
          <Badge variant="outline" className="text-xs">
            <History className="h-3 w-3 mr-1" />
            Session: {sessionId.slice(-8)}
          </Badge>
          <Badge variant="secondary" className="text-xs">LangChain Memory</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="additional-context">Additional Context (Optional)</Label>
          <Textarea
            id="additional-context"
            placeholder="The AI will remember previous interactions and your emergency history..."
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
              Generating with Memory...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Generate Memory-Enhanced Context
            </>
          )}
        </Button>

        {emergencyContext && (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-orange-700 border-orange-300">
                  Memory-Enhanced AI Context
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(emergencyContext.timestamp).toLocaleTimeString()}
                </div>
              </div>
              
              <p className="text-gray-800 mb-3">{emergencyContext.emergencyContext}</p>

              {emergencyContext.memoryContext && (
                <div className="bg-white p-3 rounded border border-orange-200 mb-3">
                  <h4 className="font-medium text-orange-800 mb-2">Memory Context</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <Badge variant={emergencyContext.memoryContext.hasHistory ? "default" : "secondary"}>
                      {emergencyContext.memoryContext.hasHistory ? "✓" : "✗"} History
                    </Badge>
                    <Badge variant={emergencyContext.memoryContext.hasContacts ? "default" : "secondary"}>
                      {emergencyContext.memoryContext.hasContacts ? "✓" : "✗"} Contacts
                    </Badge>
                    <Badge variant={emergencyContext.memoryContext.sessionActive ? "default" : "secondary"}>
                      {emergencyContext.memoryContext.sessionActive ? "✓" : "✗"} Session
                    </Badge>
                  </div>
                </div>
              )}
              
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
              Clear Memory Context
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemoryAIEmergencyContext;
