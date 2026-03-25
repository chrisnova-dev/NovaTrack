import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="relative min-h-screen w-full bg-[#0B0E14] text-slate-200 selection:bg-cyan-500/30">
      
      {/* 1. THE DECORATIVE LAYERS */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 blur-[130px] rounded-full" />
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
            backgroundRepeat: 'repeat'
          }}
        />
      </div>

      {/* --- MOVED NAVBAR --- */}
      <Navbar />

      {/* 2. THE CONTENT LAYER */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar was here before - I removed it from here */}
        
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <Outlet />
        </main>

        {/* <footer className="py-12 text-center text-slate-700 text-xs tracking-widest uppercase border-t border-slate-800/50 mt-10">
          NovaTrack &copy; 2026
        </footer> */}
      </div>
    </div>
  );
}