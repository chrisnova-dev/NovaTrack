import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();


  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/home" },
    { name: "Market", path: "/market" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <h1 className="text-xl font-black tracking-tighter uppercase italic text-white transition-transform group-hover:scale-105">
            Nova<span className="text-indigo-500">Track</span>
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em]">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-all duration-300 relative pb-1 ${
                isActive(link.path) ? "text-white" : "text-slate-500 hover:text-indigo-400"
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side: Wallet & Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ConnectButton accountStatus="address" showBalance={false} chainStatus="icon" />
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-lg"
          >
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 bg-[#020617] border-b border-white/5 px-6 py-10 flex flex-col items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              onClick={() => setIsOpen(false)} 
              className={`text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 transition-all ${
                isActive(link.path) ? "text-white scale-110" : "text-slate-600 hover:text-indigo-400"
              }`}
            >
              {isActive(link.path) && (
                <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)] animate-pulse" />
              )}
              {link.name}
            </Link>
          ))}
          
          <div className="pt-6 border-t border-white/5 w-full flex justify-center">
            <ConnectButton showBalance={false} />
          </div>
        </div>
      )}
    </nav>
  );
}