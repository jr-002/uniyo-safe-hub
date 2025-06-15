
// Platform detection utility for Capacitor vs Web
export const isPlatform = (platform: 'web' | 'capacitor' | 'ios' | 'android'): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if running in Capacitor
  const isCapacitor = !!(window as any).Capacitor;
  
  switch (platform) {
    case 'capacitor':
      return isCapacitor;
    case 'web':
      return !isCapacitor;
    case 'ios':
      return isCapacitor && (window as any).Capacitor?.getPlatform() === 'ios';
    case 'android':
      return isCapacitor && (window as any).Capacitor?.getPlatform() === 'android';
    default:
      return false;
  }
};

export const isNative = () => isPlatform('capacitor');
export const isWeb = () => isPlatform('web');
