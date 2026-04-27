import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

const RiskSummary = ({ score, level }) => {
  const styles = {
    "Safe": { color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", Icon: ShieldCheck },
    "Moderate Risk": { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", Icon: Shield },
    "High Risk": { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", Icon: ShieldAlert },
  };

  const current = styles[level] || styles["Moderate Risk"];

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 mb-6`}>
      <div className={`${current.bg} ${current.border} border rounded-2xl p-6 flex flex-col items-center text-center`}>
        <current.Icon className={`${current.color} w-12 h-12 mb-2`} />
        <p className="text-gray-400 text-sm uppercase tracking-widest">Security Rating</p>
        <h2 className={`${current.color} text-3xl font-black mb-2`}>{level}</h2>
        <div className="h-2 w-full max-w-xs bg-gray-800 rounded-full mt-2 overflow-hidden">
          <div 
            className={`${current.color.replace('text', 'bg')} h-full transition-all duration-1000`} 
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default RiskSummary;