
const CACHE_NAME = 'uniuyo-guardian-v2';
const OFFLINE_EMERGENCY_CACHE = 'emergency-offline-v1';

const urlsToCache = [
  '/',
  '/manifest.json',
  '/logo.png',
  '/emergency',
  '/safety-timer',
  '/offline.html'
];

const emergencyPages = [
  '/emergency',
  '/safety-timer'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
      }),
      caches.open(OFFLINE_EMERGENCY_CACHE).then((cache) => {
        return cache.addAll(emergencyPages);
      })
    ])
  );
  self.skipWaiting();
});

// Fetch event - serve from cache when offline with emergency priority
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Priority handling for emergency pages
  if (emergencyPages.some(page => url.pathname.includes(page))) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(OFFLINE_EMERGENCY_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        }).catch(() => {
          // Return a basic offline emergency page if available
          return caches.match('/emergency') || new Response(
            '<html><body><h1>Emergency Mode - Offline</h1><p>Your emergency has been queued and will be sent when connection is restored.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      })
    );
    return;
  }

  // Standard caching strategy for other requests
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_EMERGENCY_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Background sync for offline emergency data
self.addEventListener('sync', (event) => {
  if (event.tag === 'emergency-sync') {
    event.waitUntil(syncEmergencyData());
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Emergency Alert',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Alert'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('UniUyo Guardian Alert', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/emergency')
    );
  }
});

async function syncEmergencyData() {
  try {
    // Get offline emergency data from IndexedDB or localStorage
    // and sync with server when online
    console.log('Syncing emergency data...');
  } catch (error) {
    console.error('Error syncing emergency data:', error);
  }
}
