import React from "react";
import { useAuth } from "./AuthProvider";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";
import { Wifi, WifiOff } from "lucide-react";

export function SyncNotification() {
  const { user } = useAuth();
  const { isOnline, isSyncing } = useFirebaseSync();

  // Don't show if user is not logged in
  if (!user) return null;

  // Simple status indicator only - no popup notifications
  return (
    <div className="fixed top-4 right-4 z-40 flex items-center space-x-2">
      <div
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
          isOnline
            ? "bg-green-50 border-green-200"
            : "bg-orange-50 border-orange-200"
        }`}
      >
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-600" />
        ) : (
          <WifiOff className="w-4 h-4 text-orange-600" />
        )}
        <span
          className={`text-xs font-medium ${
            isOnline ? "text-green-700" : "text-orange-700"
          }`}
        >
          {isSyncing ? "Sincronizando..." : isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
}
