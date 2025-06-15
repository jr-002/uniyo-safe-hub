
import React, { useEffect, useRef, useState } from 'react';
import { Map, NavigationControl, Marker, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Shield, AlertTriangle, Phone, Users } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

interface SafetyPoint {
  id: string;
  type: 'emergency_station' | 'security_post' | 'safe_zone' | 'incident' | 'hazard';
  title: string;
  description: string;
  coordinates: [number, number];
  status: 'active' | 'inactive' | 'reported';
  severity?: 'low' | 'medium' | 'high';
  reportedAt?: string;
}

interface CampusSafetyMapProps {
  height?: string;
  showControls?: boolean;
  selectedPoint?: string;
  onPointSelect?: (point: SafetyPoint) => void;
}

export const CampusSafetyMap: React.FC<CampusSafetyMapProps> = ({
  height = '400px',
  showControls = true,
  selectedPoint,
  onPointSelect,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [safetyPoints, setSafetyPoints] = useState<SafetyPoint[]>([]);
  const [selectedSafetyPoint, setSelectedSafetyPoint] = useState<SafetyPoint | null>(null);
  const { latitude, longitude } = useLocation();

  // Mock data for UniUyo campus safety points
  useEffect(() => {
    const mockSafetyPoints: SafetyPoint[] = [
      {
        id: '1',
        type: 'emergency_station',
        title: 'Main Campus Emergency Station',
        description: 'Primary emergency response center with 24/7 staff',
        coordinates: [7.9333, 5.0166], // Approximate UniUyo coordinates
        status: 'active',
      },
      {
        id: '2',
        type: 'security_post',
        title: 'Library Security Post',
        description: 'Security checkpoint at main library entrance',
        coordinates: [7.9335, 5.0168],
        status: 'active',
      },
      {
        id: '3',
        type: 'safe_zone',
        title: 'Student Union Safe Zone',
        description: 'Well-lit area with CCTV coverage and regular patrols',
        coordinates: [7.9330, 5.0165],
        status: 'active',
      },
      {
        id: '4',
        type: 'incident',
        title: 'Reported Incident',
        description: 'Minor theft reported in this area',
        coordinates: [7.9340, 5.0170],
        status: 'reported',
        severity: 'medium',
        reportedAt: '2 hours ago',
      },
      {
        id: '5',
        type: 'hazard',
        title: 'Construction Zone',
        description: 'Ongoing construction - avoid after dark',
        coordinates: [7.9325, 5.0160],
        status: 'active',
        severity: 'low',
      },
    ];

    setSafetyPoints(mockSafetyPoints);
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map centered on UniUyo campus
    map.current = new Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=demo', // Using demo key for example
      center: [7.9333, 5.0166], // UniUyo coordinates
      zoom: 16,
    });

    if (showControls) {
      map.current.addControl(new NavigationControl(), 'top-right');
    }

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, [showControls]);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Add safety points as markers
    safetyPoints.forEach((point) => {
      const el = document.createElement('div');
      el.className = 'safety-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      // Set marker color based on type
      switch (point.type) {
        case 'emergency_station':
          el.style.backgroundColor = '#ef4444'; // Red
          break;
        case 'security_post':
          el.style.backgroundColor = '#3b82f6'; // Blue
          break;
        case 'safe_zone':
          el.style.backgroundColor = '#10b981'; // Green
          break;
        case 'incident':
          el.style.backgroundColor = '#f59e0b'; // Orange
          break;
        case 'hazard':
          el.style.backgroundColor = '#8b5cf6'; // Purple
          break;
      }

      const marker = new Marker(el)
        .setLngLat(point.coordinates)
        .addTo(map.current!);

      // Add click event
      el.addEventListener('click', () => {
        setSelectedSafetyPoint(point);
        if (onPointSelect) {
          onPointSelect(point);
        }
      });
    });

    // Add user location marker if available
    if (latitude && longitude) {
      const userEl = document.createElement('div');
      userEl.className = 'user-marker';
      userEl.style.width = '20px';
      userEl.style.height = '20px';
      userEl.style.borderRadius = '50%';
      userEl.style.backgroundColor = '#059669';
      userEl.style.border = '3px solid white';
      userEl.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.3)';

      new Marker(userEl)
        .setLngLat([longitude, latitude])
        .addTo(map.current!);
    }
  }, [mapLoaded, safetyPoints, latitude, longitude, onPointSelect]);

  const getPointIcon = (type: SafetyPoint['type']) => {
    switch (type) {
      case 'emergency_station':
        return <Phone className="h-4 w-4" />;
      case 'security_post':
        return <Shield className="h-4 w-4" />;
      case 'safe_zone':
        return <Users className="h-4 w-4" />;
      case 'incident':
        return <AlertTriangle className="h-4 w-4" />;
      case 'hazard':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getPointColor = (type: SafetyPoint['type']) => {
    switch (type) {
      case 'emergency_station':
        return 'bg-red-500';
      case 'security_post':
        return 'bg-blue-500';
      case 'safe_zone':
        return 'bg-green-500';
      case 'incident':
        return 'bg-orange-500';
      case 'hazard':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative" style={{ height }}>
        <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
        
        {/* Map Legend */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <h4 className="font-semibold text-sm mb-2">Campus Safety Map</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Emergency Stations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Security Posts</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Safe Zones</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Incidents</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Hazards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Points List */}
      <div className="grid md:grid-cols-2 gap-4">
        {safetyPoints.map((point) => (
          <Card
            key={point.id}
            className={`cursor-pointer transition-all ${
              selectedPoint === point.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
            }`}
            onClick={() => {
              setSelectedSafetyPoint(point);
              if (onPointSelect) {
                onPointSelect(point);
              }
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full text-white ${getPointColor(point.type)}`}>
                  {getPointIcon(point.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{point.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{point.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge
                      variant={point.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {point.status}
                    </Badge>
                    {point.severity && (
                      <Badge
                        variant={point.severity === 'high' ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {point.severity}
                      </Badge>
                    )}
                  </div>
                  {point.reportedAt && (
                    <p className="text-xs text-gray-500 mt-1">Reported {point.reportedAt}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampusSafetyMap;
