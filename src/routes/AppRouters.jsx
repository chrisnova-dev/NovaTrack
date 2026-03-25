import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Home from "../pages/Home";
import MainLayout from "../components/layout/MainLayout";
import BlockchainBackground from "../components/Backround"; 
import ComingSoon from "../pages/ComingSoon";
import Footer from "../components/layout/Footer"; 

export default function AppRoutes() {
  return (
    <div className="relative min-h-screen w-full">
      
      {/* Background stays at the bottom */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <BlockchainBackground />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              
              {/* Simple redirection for unfinished pages */}
              <Route path="/market" element={<ComingSoon />} />
              <Route path="/about" element={<ComingSoon />} />
              
              {/* This catches any link that doesn't exist */}
              <Route path="*" element={<ComingSoon />} />
            </Route>
          </Routes>
        </div>

        {/* Footer added here, pushed to bottom by flex-grow */}
        <Footer />
      </div>
    </div>
  );
}