
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
  priority?: 'high' | 'normal';
}

export const useNativeNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    initializeNativeNotifications();
  }, [user]);

  const initializeNativeNotifications = async () => {
    try {
      // Dynamic import for Capacitor modules
      const { PushNotifications } = await import('@capacitor/push-notifications');
      const { LocalNotifications } = await import('@capacitor/local-notifications');

      // Check if push notifications are supported
      const permissionStatus = await PushNotifications.checkPermissions();
      setIsSupported(true);

      if (permissionStatus.receive === 'granted') {
        await registerForPushNotifications();
      } else if (permissionStatus.receive === 'prompt') {
        const permission = await PushNotifications.requestPermissions();
        if (permission.receive === 'granted') {
          await registerForPushNotifications();
        }
      }

      // Set up listeners
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
        setToken(token.value);
        setIsRegistered(true);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ', notification);
        showLocalNotification({
          title: notification.title || 'Emergency Alert',
          body: notification.body || 'New safety alert',
          data: notification.data,
        });
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
        if (notification.notification.data?.route) {
          window.location.href = notification.notification.data.route;
        }
      });

    } catch (error) {
      console.error('Native push notification initialization failed:', error);
    }
  };

  const registerForPushNotifications = async () => {
    const { PushNotifications } = await import('@capacitor/push-notifications');
    await PushNotifications.register();
  };

  const showLocalNotification = async (payload: NotificationPayload) => {
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      await LocalNotifications.schedule({
        notifications: [
          {
            title: payload.title,
            body: payload.body,
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 1000) },
            extra: payload.data,
          },
        ],
      });
    } catch (error) {
      console.error('Error showing native local notification:', error);
    }
  };

  const sendEmergencyAlert = async (alertData: {
    type: 'emergency' | 'safety_timer' | 'incident';
    message: string;
    location?: { latitude: number; longitude: number };
    urgency: 'high' | 'medium' | 'low';
  }) => {
    try {
      const { error } = await supabase.functions.invoke('send-emergency-notification', {
        body: {
          userId: user?.id,
          alertData,
          token,
        },
      });

      if (error) throw error;
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
