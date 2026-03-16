import React from "react";

const DashboardCard = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-[#1a202c] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl group hover:border-purple-500/30 transition-all duration-300">
      {/* Subtle Background Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all" />
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 text-sm font-medium tracking-wide uppercase">
          {title}
        </h3>
        {icon && (
          <div className="text-purple-400 bg-purple-400/10 p-2 rounded-xl">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </h2>
        
        {/* If there is a trend (like +5%), show it here */}
        {trend && (
          <div className="flex items-center gap-1">
            <span className={`text-xs font-bold ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend}
            </span>
            <span className="text-gray-500 text-[10px] uppercase font-bold">vs yesterday</span>
          </div>
        )}
      </div>

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-purple-500 group-hover:w-full transition-all duration-500" />
    </div>
  );
};

export default DashboardCard;