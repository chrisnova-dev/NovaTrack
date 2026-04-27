import React from 'react';

const StatCard = ({ label, value, subtext }) => (
  <div className="bg-[#111827]/50 border border-gray-800 p-5 rounded-2xl">
    <p className="text-gray-400 text-sm mb-1">{label}</p>
    <h3 className="text-2xl font-bold text-white">{value}</h3>
    {subtext && <p className="text-cyan-500 text-xs mt-1">{subtext}</p>}
  </div>
);

const PortfolioOverview = ({ data }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard label="Net Worth" value={`$${data.totalValue}`} subtext="+2.5% vs last week" />
      <StatCard label="Total Assets" value={data.assetsCount} />
      <StatCard label="Native Balance" value={`${data.ethBalance} ETH`} />
      <StatCard label="Top Holding" value={data.topToken} />
    </div>
  );
};

export default PortfolioOverview;