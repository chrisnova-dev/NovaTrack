import React from "react";
import { useNavigate } from "react-router-dom";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-3xl font-bold text-white mb-2">
        Coming Soon
      </h1>
      <p className="text-slate-500 mb-8">
        This feature is currently under development.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="text-cyan-400 hover:text-cyan-300 text-sm font-bold uppercase tracking-widest transition-colors"
      >
        ← Go Back
      </button>
    </div>
  );
}