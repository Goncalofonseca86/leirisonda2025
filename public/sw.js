// Service Worker for Leirisonda PWA
const CACHE_NAME = "leirisonda-v4";
const CACHE_URLS = ["/", "/manifest.json", "/index.html"];

// Install event - clean up old caches
self.addEventListener("install", (event) => {
  console.log("SW: Installing new service worker...");

  event.waitUntil(
    (async () => {
      try {
        // Delete old caches
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(
              (name) => name.startsWith("leirisonda-") && name !== CACHE_NAME,
            )
            .map((name) => {
              console.log("SW: Deleting old cache:", name);
              return caches.delete(name);
            }),
        );

        // Create new cache
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CACHE_URLS);
        console.log("SW: New cache created successfully");

        // Skip waiting to activate immediately
        self.skipWaiting();
      } catch (error) {
        console.error("SW: Install failed:", error);
      }
    })(),
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("SW: Activating new service worker...");

  event.waitUntil(
    (async () => {
      try {
        // Clear old caches again (just to be sure)
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(
              (name) => name.startsWith("leirisonda-") && name !== CACHE_NAME,
            )
            .map((name) => caches.delete(name)),
        );

        // Take control of all pages immediately
        await self.clients.claim();
        console.log("SW: Activated successfully");
      } catch (error) {
        console.error("SW: Activation failed:", error);
      }
    })(),
  );
});

// Fetch event - minimal caching to avoid interference
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip Firebase, APIs, and external requests
  const url = new URL(event.request.url);
  if (
    url.origin !== self.location.origin ||
    event.request.url.includes("firebase") ||
    event.request.url.includes("googleapis") ||
    event.request.url.includes("identitytoolkit") ||
    event.request.url.includes("cdn.builder.io") ||
    event.request.url.includes("api/")
  ) {
    return;
  }

  // Only cache the main HTML file and manifest
  if (
    url.pathname === "/" ||
    url.pathname === "/index.html" ||
    url.pathname === "/manifest.json"
  ) {
    event.respondWith(
      (async () => {
        try {
          // Always try network first for HTML to get latest version
          if (url.pathname === "/" || url.pathname === "/index.html") {
            const networkResponse = await fetch(event.request);
            if (networkResponse.ok) {
              const cache = await caches.open(CACHE_NAME);
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            }
          }

          // Fall back to cache if network fails
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // If no cache, try network
          return fetch(event.request);
        } catch (error) {
          console.error("SW: Fetch failed:", error);
          // Return cached version or let it fail
          const cachedResponse = await caches.match(event.request);
          return cachedResponse || fetch(event.request);
        }
      })(),
    );
  }
});

// Push notifications
self.addEventListener("push", (event) => {
  console.log("SW: Push event received:", event);

  const options = {
    body: event.data ? event.data.text() : "Nova notificação Leirisonda",
    icon: "https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2Fcfe4c99ad2e74d27bb8b01476051f923?format=webp&width=192",
    badge:
      "https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2Fcfe4c99ad2e74d27bb8b01476051f923?format=webp&width=96",
    tag: "leirisonda-notification",
    timestamp: Date.now(),
    requireInteraction: true,
    actions: [
      {
        action: "view",
        title: "Ver Detalhes",
      },
      {
        action: "dismiss",
        title: "Dispensar",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("Leirisonda", options));
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("SW: Notification clicked:", event);

  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(
      self.clients.matchAll({ type: "window" }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("leirisonda") && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow("/");
        }
      }),
    );
  }
});

// Message event for communication with main thread
self.addEventListener("message", (event) => {
  console.log("SW: Message received:", event.data);

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      (async () => {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        console.log("SW: All caches cleared");
        event.ports[0].postMessage({ success: true });
      })(),
    );
  }
});
