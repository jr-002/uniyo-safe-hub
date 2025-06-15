
import { useState, useEffect } from 'react';
import { useLocation } from '@/hooks/useLocation';

interface OfflineEmergencyData {
  id: string;
  timestamp: string;
  type: 'sos' | 'safety_timer' | 'incident';
  location: { latitude: number; longitude: number } | null;
  data: any;
  synced: boolean;
}

export const useOfflineEmergency = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineEmergencyData[]>([]);
  const { latitude, longitude } = useLocation();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline queue from localStorage
    loadOfflineQueue();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineQueue = () => {
    try {
      const stored = localStorage.getItem('emergency-offline-queue');
      if (stored) {
        setOfflineQueue(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  };

  const saveOfflineQueue = (queue: OfflineEmergencyData[]) => {
    try {
      localStorage.setItem('emergency-offline-queue', JSON.stringify(queue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  };

  const addToOfflineQueue = (type: OfflineEmergencyData['type'], data: any) => {
    const emergencyData: OfflineEmergencyData = {
      id: `offline-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      type,
      location: latitude && longitude ? { latitude, longitude } : null,
      data,
      synced: false,
    };

    const newQueue = [...offlineQueue, emergencyData];
    setOfflineQueue(newQueue);
    saveOfflineQueue(newQueue);

    // Show offline notification
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('Emergency Alert Queued', {
          body: `${type.toUpperCase()} alert saved. Will sync when online.`,
          icon: '/logo.png',
          badge: '/logo.png',
          tag: 'emergency-offline',
          requireInteraction: true,
        });
      });
    }

    return emergencyData.id;
  };

  const syncOfflineData = async () => {
    if (!isOnline || offlineQueue.length === 0) return;

    const unsyncedItems = offlineQueue.filter(item => !item.synced);
    
    for (const item of unsyncedItems) {
      try {
        // Attempt to sync each item
        await syncSingleItem(item);
        
        // Mark as synced
        const updatedQueue = offlineQueue.map(queueItem =>
          queueItem.id === item.id ? { ...queueItem, synced: true } : queueItem
        );
        setOfflineQueue(updatedQueue);
        saveOfflineQueue(updatedQueue);
      } catch (error) {
        console.error('Error syncing offline item:', error);
      }
    }

    // Clean up synced items older than 24 hours
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const cleanedQueue = offlineQueue.filter(item => 
      !item.synced || new Date(item.timestamp).getTime() > oneDayAgo
    );
    
    if (cleanedQueue.length !== offlineQueue.length) {
      setOfflineQueue(cleanedQueue);
      saveOfflineQueue(cleanedQueue);
    }
  };

  const syncSingleItem = async (item: OfflineEmergencyData) => {
    // This would sync with your backend when online
    // For now, we'll just simulate the sync
    console.log('Syncing offline emergency data:', item);
    
    // In a real implementation, you'd call your API here
    // await supabase.from('emergency_logs').insert(item);
  };

  const triggerOfflineEmergency = (type: OfflineEmergencyData['type'], data: any) => {
    if (isOnline) {
      // If online, handle normally
      return null;
    }

    // If offline, add to queue
    return addToOfflineQueue(type, data);
  };

  const getOfflineEmergencyContacts = () => {
    try {
      const contacts = localStorage.getItem('emergency-contacts');
      return contacts ? JSON.parse(contacts) : [];
    } catch (error) {
      console.error('Error loading offline emergency contacts:', error);
      return [];
    }
  };

  const saveOfflineEmergencyContacts = (contacts: any[]) => {
    try {
      localStorage.setItem('emergency-contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving offline emergency contacts:', error);
    }
  };

  return {
    isOnline,
    offlineQueue: offlineQueue.filter(item => !item.synced),
    triggerOfflineEmergency,
    getOfflineEmergencyContacts,
    saveOfflineEmergencyContacts,
    syncOfflineData,
  };
};
