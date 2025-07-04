// Cache cleanup utility to fix white page issues
export const clearAllCaches = async (): Promise<void> => {
  try {
    // Clear all caches
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          console.log("Clearing cache:", cacheName);
          return caches.delete(cacheName);
        }),
      );
      console.log("✅ All caches cleared successfully");
    }

    // Clear localStorage
    if (typeof Storage !== "undefined") {
      const localStorageKeys = Object.keys(localStorage);
      localStorageKeys.forEach((key) => {
        if (key.startsWith("leirisonda-") || key.startsWith("firebase-")) {
          console.log("Clearing localStorage key:", key);
          localStorage.removeItem(key);
        }
      });
    }

    // Clear sessionStorage
    if (typeof Storage !== "undefined") {
      const sessionStorageKeys = Object.keys(sessionStorage);
      sessionStorageKeys.forEach((key) => {
        if (key.startsWith("leirisonda-") || key.startsWith("firebase-")) {
          console.log("Clearing sessionStorage key:", key);
          sessionStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.error("Error clearing caches:", error);
  }
};

export const registerServiceWorkerWithCleanup = async (): Promise<void> => {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Worker not supported");
    return;
  }

  try {
    // Unregister any existing service workers first
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map(async (registration) => {
        console.log("Unregistering existing SW:", registration.scope);
        await registration.unregister();
      }),
    );

    // Clear any existing caches
    await clearAllCaches();

    // Register the new service worker
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none", // Always check for updates
    });

    console.log(
      "✅ Service Worker registered successfully:",
      registration.scope,
    );

    // Handle updates
    registration.addEventListener("updatefound", () => {
      console.log("SW: New service worker found, installing...");
      const newWorker = registration.installing;

      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            console.log("SW: New service worker installed, please refresh");
            // Optionally show user a notification to refresh
          }
        });
      }
    });

    // Listen for controlled state
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("SW: Controller changed, reloading page...");
      window.location.reload();
    });
  } catch (error) {
    console.error("❌ Service Worker registration failed:", error);
  }
};

// Function to force reload and clear everything
export const forceReloadAndClear = async (): Promise<void> => {
  try {
    await clearAllCaches();

    // Send message to service worker to clear its caches too
    if (navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          console.log("SW: Cache cleared by service worker");
          window.location.reload();
        }
      };

      navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" }, [
        messageChannel.port2,
      ]);
    } else {
      window.location.reload();
    }
  } catch (error) {
    console.error("Error during force reload:", error);
    window.location.reload();
  }
};
