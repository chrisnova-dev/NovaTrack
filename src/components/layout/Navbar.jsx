import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-slate-800 bg-[#0d121f] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          {/* <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div> */}
          <h1 className="text-xl font-bold text-white">
            Nova<span className="text-indigo-400">Track</span>
          </h1>
        </div>

        {/* Desktop Links (Hidden on mobile) */}
        <div className="hidden md:flex gap-10 text-sm font-medium">
          <Link to="/" className="text-white border-b-2 border-indigo-500 pb-1">←</Link> 
          <Link to="/home" className="text-slate-400 hover:text-indigo-400 transition border-b-2 pb-1">Dashboard</Link>
          <Link to="/market" className="text-slate-400 hover:text-indigo-400 transition">Market</Link>
          <Link to="/about" className="text-slate-400 hover:text-indigo-400 transition">About</Link>
        </div>

        {/* Connect Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <ConnectButton />
          </div>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300 hover:text-white transition"
          >
            {isOpen ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#0d121f] border-t border-slate-800 px-6 py-6 flex flex-col gap-6 animate-in slide-in-from-top-2">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-white text-lg font-medium border-l-4 border-indigo-500 pl-4">Home</Link>
          <Link to="/home" onClick={() => setIsOpen(false)} className="text-slate-400 text-lg font-medium pl-4">Dashboard</Link>
          <Link to="/market" onClick={() => setIsOpen(false)} className="text-slate-400 text-lg font-medium pl-4">Market</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="text-slate-400 text-lg font-medium pl-4">About</Link>
          
          <div className="pt-4 border-t border-slate-800">
            <ConnectButton 
            showBalance={false}
            chainStatus="icon"
            accountStatus="address"
            
            />
          </div>
        </div>
      )}
    </nav>
  );
}