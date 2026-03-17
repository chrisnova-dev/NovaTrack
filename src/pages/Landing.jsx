import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


export default function Landing() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    async function fetchPrices() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd&include_24hr_change=true",
        );
        if (res.status === 429) {
          setTimeout(fetchPrices, 5000);
          return;
        }
        const data = await res.json();
        if (!isCancelled) setPrices(data);
      } catch (error) {
        console.error("Error fetching prices", error);
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);

  const AssetTicker = ({ label, id, symbol }) => (
    <div className="flex flex-col items-center px-6 min-w-fit">
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
        {label} ({symbol})
      </p>
      <p className="text-sm font-medium mt-1">
        ${prices?.[id]?.usd?.toLocaleString() ?? "---"}{" "}
        <span
          className={`text-[11px] ml-1 font-bold ${prices?.[id]?.usd_24h_change > 0 ? "text-green-400" : "text-red-400"}`}
        >
          {prices
            ? (prices[id].usd_24h_change > 0 ? "+" : "") +
              prices[id].usd_24h_change.toFixed(2) +
              "%"
            : ""}
        </span>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Logo */}
        <h1 className="text-2xl font-black tracking-tighter uppercase italic text-center md:text-left">
          Nova<span className="text-indigo-500">Track</span>
        </h1>

        {/* Trending Row - Centered and Dotted */}
        <div className="mt-8 relative max-w-5xl mx-auto">
          <div className="overflow-x-auto no-scrollbar border-y border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
            <div className="flex md:justify-center items-center divide-x divide-dotted divide-slate-700 py-6">
              <AssetTicker label="Bitcoin" id="bitcoin" symbol="BTC" />
              <AssetTicker label="Ethereum" id="ethereum" symbol="ETH" />
              <AssetTicker label="Solana" id="solana" symbol="SOL" />
              <AssetTicker label="Binance" id="binancecoin" symbol="BNB" />
              <AssetTicker label="Ripple" id="ripple" symbol="XRP" />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mt-20 md:mt-32 flex flex-col items-center text-center">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase italic">
            Smart Portfolio <br />
            <span className="text-indigo-500">Tracking</span>
          </h2>

          <p className="mt-8 max-w-2xl text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
            NovaTrack helps you monitor your crypto empire in one place. Connect
            your wallets, track live prices, and optimize your holdings with
            zero friction.
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate("/home")}
              className="px-10 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 hover:scale-105 transition-all duration-300 font-black uppercase italic tracking-widest text-sm shadow-lg shadow-indigo-600/20"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/about")}
              className="px-10 py-4 rounded-full border border-slate-700 hover:bg-slate-800 transition-all font-black uppercase italic tracking-widest text-sm"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full -z-10" />
    </div>
  );
}
