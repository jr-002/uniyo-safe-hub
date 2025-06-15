
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
  priority?: 'high' | 'normal';
}

export const useWebNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    initializeWebNotifications();
  }, [user]);

  const initializeWebNotifications = async () => {
    try {
      // Check if notifications are supported
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        console.log('Web notifications not supported');
        return;
      }

      setIsSupported(true);

      // Request permission
      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission === 'granted') {
        await registerServiceWorker();
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Error initializing web notifications:', error);
    }
  };

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // For web push, you would typically get a subscription here
      // For now, we'll use a mock token
      setToken('web-notification-token');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const showLocalNotification = async (payload: NotificationPayload) => {
    try {
      if (Notification.permission === 'granted') {
        new Notification(payload.title, {
          body: payload.body,
          icon: '/logo.png',
          badge: '/logo.png',
          data: payload.data,
        });
      }
    } catch (error) {
      console.error('Error showing web notification:', error);
    }
  };

  const sendEmergencyAlert = async (alertData: {
    type: 'emergency' | 'safety_timer' | 'incident';
    message: string;
    location?: { latitude: number; longitude: number };
    urgency: 'high' | 'medium' | 'low';
  }) => {
    try {
      // Show immediate notification
      await showLocalNotification({
        title: 'Emergency Alert',
        body: alertData.message,
        data: alertData,
        priority: 'high',
      });

      // Here you would also send to your backend
      console.log('Emergency alert:', alertData);
    } catch (error) {
      console.error('Error sending emergency alert:', error);
    }
  };

  return {
    isSupported,
    isRegistered,
    token,
    sendEmergencyAlert,
    showLocalNotification,
  };
};
