// Service Worker for QR Code Generator
// Version 2.0.0

const CACHE_NAME = 'qr-generator-v2.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/index.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache resources:', error);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Ensure the service worker takes control immediately
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.startsWith('https://fonts.googleapis.com') &&
      !event.request.url.startsWith('https://api.qrserver.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a stream
            const responseToCache = response.clone();

            // Only cache GET requests for certain file types
            if (event.request.method === 'GET' && shouldCache(event.request.url)) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            
            // Return offline fallback for HTML requests
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // Return a basic offline response for other requests
            return new Response('Offline', {
              status: 200,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Helper function to determine if a URL should be cached
function shouldCache(url) {
  const uncacheableExtensions = ['.mp4', '.mp3', '.avi', '.mov', '.wmv'];
  const uncacheableDomains = ['analytics', 'tracking', 'ads'];
  
  // Don't cache large media files
  if (uncacheableExtensions.some(ext => url.includes(ext))) {
    return false;
  }
  
  // Don't cache analytics or tracking requests
  if (uncacheableDomains.some(domain => url.includes(domain))) {
    return false;
  }
  
  // Cache static assets and API responses
  return url.includes('.css') || 
         url.includes('.js') || 
         url.includes('.html') || 
         url.includes('.png') || 
         url.includes('.jpg') || 
         url.includes('.jpeg') || 
         url.includes('.gif') || 
         url.includes('.svg') ||
         url.includes('fonts.googleapis.com') ||
         url.includes('api.qrserver.com');
}

// Handle background sync for QR code generation when offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'qr-generation') {
    event.waitUntil(
      // Handle offline QR generation queue
      handleOfflineQRGeneration()
    );
  }
});

// Handle offline QR generation (placeholder for future implementation)
async function handleOfflineQRGeneration() {
  // This could be implemented to queue QR generation requests
  // and process them when the connection is restored
  console.log('Handling offline QR generation sync');
}

// Handle push notifications (for future implementation)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'QR Code Generator notification',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Open App',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-192x192.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'QR Code Generator', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle message events from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});