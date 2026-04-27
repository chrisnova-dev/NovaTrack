import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const RiskItem = ({ title, status, desc }) => {
  const isSafe = status === 'safe';
  return (
    <div className="flex gap-4 p-4 bg-[#111827]/40 border border-gray-800 rounded-xl">
      {isSafe ? <CheckCircle2 className="text-green-500 shrink-0" /> : <AlertTriangle className="text-red-500 shrink-0" />}
      <div>
        <h4 className="text-white font-medium">{title}</h4>
        <p className="text-gray-400 text-sm mt-1">{desc}</p>
      </div>
    </div>
  );
};

const RiskDetails = ({ checks }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-4 pb-20">
      <h3 className="text-white font-semibold">Security Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map((check, i) => (
          <RiskItem key={i} {...check} />
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
        <h4 className="text-cyan-400 font-bold mb-2">Beginner's Guide</h4>
        <p className="text-gray-400 text-sm leading-relaxed">
          The risk score is calculated based on contract transparency and owner permissions. 
          A "High Risk" rating usually means the owner can stop trading or remove funds 
          unexpectedly (often called a "Rug Pull").
        </p>
      </div>
    </div>
  );
};

export default RiskDetails;