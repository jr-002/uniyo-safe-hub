
import { useState, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
  priority?: 'high' | 'normal';
}

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    initializePushNotifications();
    // eslint-disable-next-line
  }, [user]);

  const initializePushNotifications = async () => {
    try {
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

        // Store token in database for user
        if (user) {
          // TODO: Re-enable when/if you add a user_push_tokens table to your DB schema
          // storePushToken(token.value);
          console.warn("[PushNotifications] Not saving push token to Supabase. Table 'user_push_tokens' not found in schema.");
        }
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ', notification);
        // Handle foreground notifications
        showLocalNotification({
          title: notification.title || 'Emergency Alert',
          body: notification.body || 'New safety alert',
          data: notification.data,
        });
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
        // Handle notification tap
        if (notification.notification.data?.route) {
          window.location.href = notification.notification.data.route;
        }
      });

    } catch (error) {
      console.error('Push notification initialization failed:', error);
    }
  };

  const registerForPushNotifications = async () => {
    await PushNotifications.register();
  };

  // Disabled for now as table does not exist!
  // const storePushToken = async (tokenValue: string) => {
  //   if (!user) return;
  //   try {
  //     const { error } = await supabase
  //       .from('user_push_tokens')
  //       .upsert({
  //         user_id: user.id,
  //         token: tokenValue,
  //         platform: 'web',
  //         updated_at: new Date().toISOString(),
  //       });
  //     if (error) throw error;
  //   } catch (error) {
  //     console.error('Error storing push token:', error);
  //   }
  // };

  const showLocalNotification = async (payload: NotificationPayload) => {
    try {
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
      console.error('Error showing local notification:', error);
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
