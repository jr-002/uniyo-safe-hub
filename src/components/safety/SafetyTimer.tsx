
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Timer, MapPin, Users, Play, Square, Brain } from 'lucide-react';
import { useSafetyTimer } from '@/hooks/useSafetyTimer';
import { useAuth } from '@/hooks/useAuth';
import AIRouteAnalysis from './AIRouteAnalysis';

const SafetyTimer = () => {
  const [duration, setDuration] = useState<string>('30');
  const [destination, setDestination] = useState('');
  const [selectedGuardians, setSelectedGuardians] = useState<string[]>([]);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [routeAnalysis, setRouteAnalysis] = useState<any>(null);
  const { activeTimer, guardians, loading, startTimer, stopTimer, getTimeRemaining } = useSafetyTimer();
  const { user } = useAuth();

  if (!user) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to use the Safety Timer</p>
        </div>
      </Card>
    );
  }

  const handleStartTimer = () => {
    if (!destination.trim()) return;
    
    // Use recommended duration from AI analysis if available
    const finalDuration = routeAnalysis?.analysis?.recommendedDuration || parseInt(duration);
    startTimer(finalDuration, destination, selectedGuardians);
    setDestination('');
    setSelectedGuardians([]);
    setShowAIAnalysis(false);
    setRouteAnalysis(null);
  };

  const handleStopTimer = () => {
    if (activeTimer) {
      stopTimer(activeTimer.id);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeRemaining = getTimeRemaining();

  const handleAnalysisComplete = (analysis: any) => {
    setRouteAnalysis(analysis);
    // Auto-update duration if AI suggests a different one
    if (analysis?.analysis?.recommendedDuration) {
      const newDuration = analysis.analysis.recommendedDuration;
      // Find the closest duration option
      const durations = [15, 30, 45, 60, 120];
      const closest = durations.reduce((prev, curr) => 
        Math.abs(curr - newDuration) < Math.abs(prev - newDuration) ? curr : prev
      );
      setDuration(closest.toString());
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Timer className="h-6 w-6 text-uniuyo-red" />
          <h2 className="text-xl font-semibold">Safety Timer</h2>
        </div>

        {activeTimer ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-uniuyo-red mb-2">
                {formatTime(timeRemaining)}
              </div>
              <p className="text-gray-600">Time remaining</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Destination:</span>
              </div>
              <p className="text-gray-700">{activeTimer.destination_text}</p>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleStopTimer}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Square className="h-4 w-4 mr-2" />
                I'm Safe - Stop Timer
              </Button>
            </div>

            {activeTimer.status === 'expired' && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800 font-medium">Timer has expired!</p>
                <p className="text-red-600 text-sm">Your guardians have been notified.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
              {routeAnalysis?.analysis?.recommendedDuration && 
               routeAnalysis.analysis.recommendedDuration !== parseInt(duration) && (
                <p className="text-sm text-blue-600 mt-1">
                  AI suggests {routeAnalysis.analysis.recommendedDuration} minutes for this route
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where are you going?"
                className="mt-1"
              />
            </div>

            {/* AI Analysis Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ai-analysis"
                checked={showAIAnalysis}
                onCheckedChange={(checked) => setShowAIAnalysis(checked === true)}
              />
              <Label htmlFor="ai-analysis" className="text-sm flex items-center space-x-1">
                <Brain className="h-4 w-4" />
                <span>Get AI route analysis and safety recommendations</span>
              </Label>
            </div>

            {guardians.length > 0 && (
              <div>
                <Label>Notify Guardians</Label>
                <div className="mt-2 space-y-2">
                  {guardians.map((guardian) => (
                    <div key={guardian.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={guardian.id}
                        checked={selectedGuardians.includes(guardian.id)}
                        onCheckedChange={(checked) => {
                          if (checked === true) {
                            setSelectedGuardians(prev => [...prev, guardian.id]);
                          } else {
                            setSelectedGuardians(prev => prev.filter(id => id !== guardian.id));
                          }
                        }}
                      />
                      <Label htmlFor={guardian.id} className="text-sm">
                        {guardian.guardian_name}
                        {guardian.guardian_email && (
                          <span className="text-gray-500 ml-1">({guardian.guardian_email})</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleStartTimer}
              disabled={!destination.trim() || loading}
              className="w-full bg-uniuyo-red hover:bg-red-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Safety Timer
            </Button>
          </div>
        )}
      </Card>

      {/* AI Route Analysis */}
      {showAIAnalysis && !activeTimer && (
        <AIRouteAnalysis
          destination={destination}
          duration={parseInt(duration)}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}

      {guardians.length === 0 && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium">No Guardians Added</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Add guardians to notify them when your safety timer expires. 
            Go to your profile to manage guardians.
          </p>
        </Card>
      )}
    </div>
  );
};

export default SafetyTimer;
