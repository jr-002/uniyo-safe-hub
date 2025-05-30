
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Shield, 
  Route,
  Phone,
  Lightbulb,
  CloudSun
} from 'lucide-react';
import { useRouteAnalysis } from '@/hooks/useRouteAnalysis';

interface AIRouteAnalysisProps {
  destination: string;
  duration: number;
  onAnalysisComplete?: (analysis: any) => void;
}

const AIRouteAnalysis = ({ destination, duration, onAnalysisComplete }: AIRouteAnalysisProps) => {
  const { isAnalyzing, analysis, analyzeRoute, clearAnalysis } = useRouteAnalysis();

  const handleAnalyze = async () => {
    const result = await analyzeRoute(destination, duration);
    if (result && onAnalysisComplete) {
      onAnalysisComplete(result);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (!destination) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Route className="h-5 w-5 text-uniuyo-red" />
          <h3 className="font-semibold">AI Route Analysis</h3>
        </div>
        {!analysis ? (
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            size="sm"
            className="bg-uniuyo-red hover:bg-red-700"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Route'}
          </Button>
        ) : (
          <Button 
            onClick={clearAnalysis}
            size="sm"
            variant="outline"
          >
            Clear Analysis
          </Button>
        )}
      </div>

      {analysis && (
        <div className="space-y-4">
          {/* Risk Level */}
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Risk Level:</span>
            <Badge className={getRiskColor(analysis.analysis.riskLevel)}>
              {analysis.analysis.riskLevel.toUpperCase()}
            </Badge>
          </div>

          {/* Duration Recommendation */}
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Recommended Duration:</span>
            <span className="text-sm">{analysis.analysis.recommendedDuration} minutes</span>
            {analysis.analysis.recommendedDuration > duration && (
              <Badge variant="outline" className="text-orange-600">
                +{analysis.analysis.recommendedDuration - duration} min suggested
              </Badge>
            )}
          </div>

          {/* Risk Factors */}
          {analysis.analysis.riskFactors.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Risk Factors:</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 ml-6">
                {analysis.analysis.riskFactors.map((factor, index) => (
                  <li key={index}>• {factor}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Tips */}
          {analysis.analysis.safetyTips.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Safety Tips:</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 ml-6">
                {analysis.analysis.safetyTips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Checkpoints */}
          {analysis.analysis.checkpointSuggestions.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Suggested Checkpoints:</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 ml-6">
                {analysis.analysis.checkpointSuggestions.map((checkpoint, index) => (
                  <li key={index}>• {checkpoint}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Emergency Contacts */}
          {analysis.analysis.emergencyContacts.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Phone className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Emergency Contacts:</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 ml-6">
                {analysis.analysis.emergencyContacts.map((contact, index) => (
                  <li key={index}>• {contact}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Campus Specific Advice */}
          {analysis.analysis.campusSpecificAdvice && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Campus Safety Advice:</span>
              </div>
              <p className="text-sm text-blue-700">{analysis.analysis.campusSpecificAdvice}</p>
            </div>
          )}

          {/* Weather Considerations */}
          {analysis.analysis.weatherConsiderations && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CloudSun className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Weather Considerations:</span>
              </div>
              <p className="text-sm text-yellow-700">{analysis.analysis.weatherConsiderations}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default AIRouteAnalysis;
