import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import SettingsModal from "./SettingsModal";

export default function Layout() {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-6 left-6 w-9 h-9 bg-gray-600 bg-opacity-80 hover:bg-opacity-100 text-white rounded-full flex items-center justify-center transition-all shadow-lg"
        style={{ fontSize: "16px" }}
      >
        ⚙️
      </button>

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
