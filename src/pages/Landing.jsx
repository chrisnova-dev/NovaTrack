import React from "react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState(null);
  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd&include_24hr_change=true",
        );

        const data = await res.json();
        setPrices(data);
      } catch (error) {
        console.error("Error fetching prices", error);
      }
    }

    fetchPrices();

    const interval = setInterval(fetchPrices, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide">
          Nova<span className="text-indigo-400">Track</span>
        </h1>

        {/* Trending Row */}
        <div className="mt-6 overflow-x-auto border border-slate-800 rounded-xl">
          <div className="flex gap-8 px-6 py-4 text-sm whitespace-nowrap">
            <div>
              <p className="text-slate-400">Bitcoin (BTC)</p>
              <p>
                ${prices?.bitcoin?.usd?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "Loading"}{" "}
                <span
                  className={
                    prices?.bitcoin?.usd_24h_change > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {prices ? prices.bitcoin.usd_24h_change.toFixed(2) + "%" : ""}
                </span>
              </p>
            </div>

            <div>
              <p className="text-slate-400">Ethereum (ETH)</p>
              <p>
                ${prices?.ethereum?.usd?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "Loading"}{" "}
                <span
                  className={
                    prices?.ethereum?.usd_24h_change > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {prices
                    ? prices.ethereum.usd_24h_change.toFixed(2) + "%"
                    : ""}
                </span>
              </p>
            </div>

            <div>
              <p className="text-slate-400">Solana (SOL)</p>
              <p>
                ${prices?.solana?.usd?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })  ?? "Loading"}{" "}
                <span
                  className={
                    prices?.solana?.usd_24h_change > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {prices ? prices.solana.usd_24h_change.toFixed(2) + "%" : ""}
                </span>
              </p>
            </div>

            <div>
              <p className="text-slate-400">BNB</p>
              <p>
                ${prices?.binancecoin?.usd?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "Loading"}{" "}
                <span
                  className={
                    prices?.binancecoin?.usd_24h_change > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {prices
                    ? prices.binancecoin.usd_24h_change.toFixed(2) + "%"
                    : ""}
                </span>
              </p>
            </div>

            <div>
              <p className="text-slate-400">XRP</p>
              <p>
                ${prices?.ripple?.usd?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "Loading"}{" "}
                <span
                  className={
                    prices?.ripple?.usd_24h_change > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {prices ? prices.ripple.usd_24h_change.toFixed(2) + "%" : ""}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mt-24 max-w-3xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Smart Portfolio Tracking
            <br />
            For Modern Investors
          </h2>

          <p className="mt-6 text-slate-300 text-lg">
            NovaTrack helps you track your crypto assets in one place. Connect
            your wallets, see your portfolio value, and monitor how your coins
            are performing in the market.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/home")}
              className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 transition font-semibold"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/about")}
              className="px-8 py-3 rounded-full border border-slate-600 hover:bg-slate-800 transition font-semibold"
            >
              About NovaTrack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
