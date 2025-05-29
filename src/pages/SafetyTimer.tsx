
import { Card } from '@/components/ui/card';
import SafetyTimer from '@/components/safety/SafetyTimer';
import GuardianManagement from '@/components/safety/GuardianManagement';
import Navigation from '@/components/Navigation';
import { Shield, Timer, Users } from 'lucide-react';

const SafetyTimerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="lg:ml-64 lg:pl-6 lg:pr-6 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="h-8 w-8 text-uniuyo-red" />
              <h1 className="text-3xl font-bold text-gray-900">Safety Timer</h1>
            </div>
            <p className="text-gray-600">
              Set a safety timer when traveling alone. Your guardians will be notified if you don't check in on time.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <SafetyTimer />
            </div>
            <div>
              <GuardianManagement />
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Timer className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold">How It Works</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Set your destination and expected travel time</li>
                <li>• Your location is tracked during the journey</li>
                <li>• Check in when you arrive safely</li>
                <li>• Guardians are alerted if the timer expires</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold">Guardian Network</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Add trusted friends and family as guardians</li>
                <li>• They receive alerts if you don't check in</li>
                <li>• Choose who to notify for each journey</li>
                <li>• Manage your guardian list anytime</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile padding for bottom navigation */}
      <div className="h-20 lg:hidden" />
    </div>
  );
};

export default SafetyTimerPage;
