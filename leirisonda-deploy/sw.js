const CACHE_NAME = "leirisonda-v3";
const urlsToCache = [
  "/",
  "/assets/index-DFdR-byQ.css",
  "/assets/index-DnEsHg1H.js",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    }),
  );
});
