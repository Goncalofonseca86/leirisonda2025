import React from "react";
import Login from "../client/pages/Login";
import "./styles/globals.css";

function App() {
  // Simple routing based on current path
  const currentPath = window.location.pathname;

  // For this demo, we'll always show the login page
  // In a real app, you'd have a proper router here
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
