
import { isNative } from '@/utils/platform';
import { useWebNotifications } from './useWebNotifications';
import { useNativeNotifications } from './useNativeNotifications';

export const usePushNotifications = () => {
  // Use native notifications if running in Capacitor, otherwise use web notifications
  if (isNative()) {
    return useNativeNotifications();
  } else {
    return useWebNotifications();
  }
};
