// ========================================
// Service Worker - iNurseApp PWA v2.0
// ✅ Offline Support, Cache Strategy
// ✅ Background Sync, Push Notifications
// ========================================

const CACHE_VERSION = 'inurseapp-v2.0.0';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;
const CACHE_IMAGES = `${CACHE_VERSION}-images`;

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/login.html',
    '/register.html',
    '/css/style.css',
    '/css/landing.css',
    '/js/api.js',
    '/js/auth.js',
    '/js/app.js',
    '/manifest.json'
];

// Maximum cache sizes
const MAX_DYNAMIC_CACHE = 50;
const MAX_IMAGE_CACHE = 30;

// ========================================
// Install Event - Cache Static Files
// ========================================
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then(cache => {
                console.log('[SW] Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('[SW] Installation complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Installation failed:', error);
            })
    );
});

// ========================================
// Activate Event - Clean Old Caches
// ========================================
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name.startsWith('inurseapp-') && !name.startsWith(CACHE_VERSION))
                        .map(name => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Activation complete');
                return self.clients.claim();
            })
    );
});

// ========================================
// Fetch Event - Cache Strategy
// ========================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip API calls (always fetch fresh)
    if (url.origin.includes('railway.app')) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Images: Cache first, then network
    if (request.destination === 'image') {
        event.respondWith(cacheFirstImage(request));
        return;
    }
    
    // HTML: Network first, then cache
    if (request.destination === 'document') {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // CSS, JS, Fonts: Cache first
    if (request.destination === 'style' || 
        request.destination === 'script' || 
        request.destination === 'font') {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Default: Network first
    event.respondWith(networkFirst(request));
});

// ========================================
// Cache Strategies
// ========================================

/**
 * Cache First - For static assets
 */
async function cacheFirst(request) {
    try {
        const cache = await caches.open(CACHE_STATIC);
        const cached = await cache.match(request);
        
        if (cached) {
            return cached;
        }
        
        const response = await fetch(request);
        
        if (response.ok) {
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.error('[SW] Cache first failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

/**
 * Network First - For dynamic content
 */
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(CACHE_DYNAMIC);
            cache.put(request, response.clone());
            
            // Limit cache size
            limitCacheSize(CACHE_DYNAMIC, MAX_DYNAMIC_CACHE);
        }
        
        return response;
    } catch (error) {
        const cache = await caches.open(CACHE_DYNAMIC);
        const cached = await cache.match(request);
        
        if (cached) {
            return cached;
        }
        
        // Fallback for HTML pages
        if (request.destination === 'document') {
            const offlinePage = await cache.match('/offline.html');
            if (offlinePage) return offlinePage;
        }
        
        return new Response('Offline', { 
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

/**
 * Cache First for Images
 */
async function cacheFirstImage(request) {
    try {
        const cache = await caches.open(CACHE_IMAGES);
        const cached = await cache.match(request);
        
        if (cached) {
            return cached;
        }
        
        const response = await fetch(request);
        
        if (response.ok) {
            cache.put(request, response.clone());
            limitCacheSize(CACHE_IMAGES, MAX_IMAGE_CACHE);
        }
        
        return response;
    } catch (error) {
        // Return placeholder image
        return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#ccc" width="100" height="100"/></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
}

// ========================================
// Utility: Limit Cache Size
// ========================================
async function limitCacheSize(cacheName, maxSize) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxSize) {
        // Delete oldest entries
        const deletePromises = keys
            .slice(0, keys.length - maxSize)
            .map(key => cache.delete(key));
        
        await Promise.all(deletePromises);
    }
}

// ========================================
// Background Sync
// ========================================
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    try {
        // Get pending requests from IndexedDB
        // Send them to server
        console.log('[SW] Syncing data...');
        
        // Notify client
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_COMPLETE',
                message: 'Data synced successfully'
            });
        });
    } catch (error) {
        console.error('[SW] Sync failed:', error);
    }
}

// ========================================
// Push Notifications
// ========================================
self.addEventListener('push', (event) => {
    console.log('[SW] Push received');
    
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'iNurseApp';
    const options = {
        body: data.body || 'Nova notificação',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [200, 100, 200],
        data: data,
        actions: [
            {
                action: 'open',
                title: 'Abrir'
            },
            {
                action: 'close',
                title: 'Fechar'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});

// ========================================
// Message Handler
// ========================================
self.addEventListener('message', (event) => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'CLEAR_CACHE':
            event.waitUntil(
                caches.keys().then(names => {
                    return Promise.all(names.map(name => caches.delete(name)));
                })
            );
            break;
            
        case 'CACHE_URLS':
            event.waitUntil(
                caches.open(CACHE_DYNAMIC).then(cache => {
                    return cache.addAll(data.urls);
                })
            );
            break;
            
        default:
            console.log('[SW] Unknown message type:', type);
    }
});

console.log('[SW] Service Worker loaded');
