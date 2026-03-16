import React from "react";
import Navbar from "./Navbar";

const MainDashboardLayout = ({ children, showWallet = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-900 to-blue-950 p-6">
      {/* Navbar */}
      <Navbar showWallet={showWallet} />

      {/* Main content */}
      <main className="mt-6">{children}</main>
    </div>
  );
};

export default MainDashboardLayout;