import React from 'react';
import { Twitter, Send, Disc } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-12 border-t border-slate-800/40 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="flex flex-col items-center md:items-start gap-2">
          <h3 className="text-xl font-black tracking-tighter text-white">
            Nova<span className="text-cyan-400">Track</span>
          </h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em]">
            © 2026 All Rights Reserved
          </p>
        </div>

        {/* Quick Links - Clean & Bold */}
        <div className="flex gap-8 text-[13px] font-bold text-slate-400 uppercase tracking-widest">
          <button className="hover:text-white transition-colors">Privacy</button>
          <button className="hover:text-white transition-colors">Terms</button>
          <button className="hover:text-white transition-colors">Support</button>
        </div>

  
        <div className="flex gap-5">
          {[
            { Icon: Twitter, link: "*" },
            { Icon: Send, link: "*" },
            { Icon: Disc, link: "*" }
          ].map((social, i) => (
            <a 
              key={i} 
              href={social.link}
              className="text-slate-400 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-300"
            >
              <social.Icon size={20} strokeWidth={2.5} />
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
};

export default Footer;