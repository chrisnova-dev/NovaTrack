import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Dashboard", path: "/home" },
    { name: "Market", path: "/market" },
    { name: "About", path: "/about" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      // Logic: If the click is NOT on the menu AND NOT on the toggle button, close it.
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) && 
        !event.target.closest('[data-menu-button]')
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="border-b rounded-b-xl border-cyan-500/20  backdrop-blur-xl sticky top-0 z-[100] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <h3 className="relative text-[22px] md:text-[24px] font-black tracking-tighter text-white group cursor-default">
            Nova
            <span className="relative text-cyan-400 transition-all duration-500 group-hover:text-cyan-300">
              Track
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-500 shadow-[0_0_12px_#22d3ee] transition-all duration-500 group-hover:w-full" />
            </span>
            <div className="absolute -inset-x-4 -inset-y-2 bg-cyan-500/5 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
          </h3>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 text-[11px] font-black uppercase tracking-[0.25em]">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-all duration-300 relative ${
                isActive(link.path) ? "text-white" : "text-slate-500 hover:text-cyan-400"
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side: Wallet & Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <ConnectButton accountStatus="address" showBalance={false} chainStatus="icon" />
          </div>

          <button
            data-menu-button // Tag identifying this as the toggle button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-[130] p-2 text-white transition-colors bg-white/5 rounded-full border border-white/10"
          >
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M4 8h16M8 16h12" />
              </svg>
            )}
          </button>
        </div>

        {/* POP-OVER MENU */}
        {isOpen && (
          <div
            ref={menuRef}
            className="md:hidden absolute top-[75px] right-4 w-64 border rounded-2xl p-6  animate-in zoom-in-95 fade-in duration-200 flex flex-col gap-4 text-center bg-[#0B0E14]/100 backdrop-blur-2xl border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] "
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-extrabold uppercase tracking-widest transition-all ${
                    isActive(link.path) ? "text-cyan-400" : "text-slate-500 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="w-full h-px bg-white/5" />
            <div className="flex flex-col gap-4 items-center">
              <ConnectButton showBalance={false} accountStatus="address" />
              <Link
                to="/swap"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 text-center border border-cyan-500/40 rounded-full text-cyan-400 font-bold uppercase tracking-widest text-[10px] hover:bg-cyan-500/10 transition-all"
              >
                Swap Token
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}