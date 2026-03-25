import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Globe,
  Zap,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 1 } },
};

export default function Landing() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">
        {label} ({symbol})
      </p>
      <p className="text-base font-semibold mt-1 text-white">
        ${prices?.[id]?.usd?.toLocaleString() ?? "---"}{" "}
        <span
          className={`text-[12px] ml-1 font-bold ${
            prices?.[id]?.usd_24h_change > 0 ? "text-cyan-400" : "text-rose-500"
          }`}
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

  const faqs = [
    {
      q: "Do I need to create an account?",
      a: "No. You only need to connect your wallet. There is no signup required.",
    },
    {
      q: "Is my wallet safe?",
      a: "Yes. NovaTrack does not control your wallet and cannot access your funds. The platform only reads public blockchain information.",
    },
    {
      q: "Which wallets are supported?",
      a: "NovaTrack supports EVM wallets such as MetaMask and WalletConnect compatible wallets.",
    },
    {
      q: "Can NovaTrack move my crypto?",
      a: "No. NovaTrack cannot send, withdraw, or control your assets. It only displays information from the blockchain.",
    },
    {
      q: "Does NovaTrack store my data?",
      a: "No personal wallet data is stored on our servers. Your wallet stays fully under your control.",
    },
  ];

  return (
    <div className="min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Logo */}
        <motion.h3 
          className="text-[22px] md:text-[24px] font-black tracking-tighter text-white"
          initial="hidden" animate="show" variants={fadeUp}
        >
          Nova<span className="text-cyan-400">Track</span>
        </motion.h3>

        {/* Trending Row */}
        <motion.div 
          className="mt-8 relative max-w-5xl mx-auto"
          initial="hidden" animate="show" variants={scaleIn}
        >
          <div className="overflow-x-auto no-scrollbar border-y border-cyan-500/20 bg-cyan-950/10 backdrop-blur-md">
            <div className="flex items-center divide-x divide-dotted divide-cyan-900/50 py-6 md:justify-center">
              <AssetTicker label="Bitcoin" id="bitcoin" symbol="BTC" />
              <AssetTicker label="Ethereum" id="ethereum" symbol="ETH" />
              <AssetTicker label="Solana" id="solana" symbol="SOL" />
              <AssetTicker label="Binance" id="binancecoin" symbol="BNB" />
              <AssetTicker label="Ripple" id="ripple" symbol="XRP" />
            </div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <div className="mt-20 md:mt-32 flex flex-col items-center text-center">
          <motion.h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8"
            initial="hidden" animate="show" variants={fadeUp}
          >
            Smart Portfolio <br />
            <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              Tracking
            </span>
          </motion.h2>

          <motion.p className="max-w-2xl text-slate-400 text-lg md:text-2xl font-semibold tracking-wide leading-relaxed"
            initial="hidden" animate="show" variants={fadeUp}
          >
            NovaTrack helps you monitor your crypto empire in one place. Connect
            your wallets, track live prices, and optimize your holdings with
            zero friction.
          </motion.p>

          <motion.div 
            className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-20 sm:px-0"
            initial="hidden" animate="show" variants={fadeUp}
          >
            <button
              onClick={() => navigate("/home")}
              className="w-full sm:px-10 py-4 rounded-full bg-cyan-500 hover:bg-cyan-400 hover:scale-105 transition-all duration-300 font-black uppercase italic tracking-widest text-sm text-black shadow-lg shadow-cyan-500/20"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/about")}
              className="w-full sm:px-10 py-4 rounded-full border border-slate-700 text-white hover:bg-slate-800/50 hover:border-cyan-500/50 transition-all font-black uppercase italic tracking-widest text-sm"
            >
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Multichain Support */}
        <div className="mt-32 md:mt-48 flex flex-col items-center text-center">
          <motion.h2 className="text-3xl md:text-6xl font-heading leading-tight font-semibold text-white"
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
          >
            Track Assets Across <br className="hidden md:block" />
            <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              Every Chain
            </span>
          </motion.h2>

          <motion.p className="mt-6 max-w-xl text-slate-400 font-medium opacity-80 text-lg md:text-xl leading-relaxed"
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
          >
            Connect once and track your assets across multiple blockchains in
            real time. No switching wallets, no confusion.
          </motion.p>

          {/* Stats Row */}
          <motion.div 
            className="mt-10 flex items-center gap-6 border-y border-slate-800/40 py-8 w-full max-w-xl justify-center bg-slate-900/10 backdrop-blur-sm"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={scaleIn}
          >
            <div className="text-center group">
              <p className="text-3xl text-white tracking-tighter transition-transform group-hover:scale-110 duration-500">
                8
              </p>
              <p className="text-[11px] text-cyan-400 font-bold uppercase tracking-[0.25em] mt-2">
                Chains
              </p>
            </div>
            <div className="h-16 w-[1px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
            <div className="text-center group">
              <p className="text-3xl text-white tracking-tighter transition-transform group-hover:scale-110 duration-500">
                100+
              </p>
              <p className="text-[11px] text-cyan-400 font-bold uppercase tracking-[0.25em] mt-2">
                Protocols
              </p>
            </div>
          </motion.div>

          {/* Chains Grid */}
          <div className="mt-14 w-full max-w-5xl mx-auto overflow-hidden mask-fade flex flex-col gap-6">
            <div className="animate-scroll-left flex gap-3 shrink-0">
              {[
                { name: "Ethereum", logo: "public/ethereum-eth-logo.svg" },
                { name: "BNB Chain", logo: "public/bnb-bnb-logo.svg" },
                { name: "Polygon", logo: "public/polygon-matic-logo.svg" },
                { name: "Arbitrum", logo: "public/arbitrum-arb-logo.svg" },
                { name: "Ethereum", logo: "public/ethereum-eth-logo.svg" },
                { name: "BNB Chain", logo: "public/bnb-bnb-logo.svg" },
                { name: "Polygon", logo: "public/polygon-matic-logo.svg" },
                { name: "Arbitrum", logo: "public/arbitrum-arb-logo.svg" },
              ].map((chain, i) => (
                <div
                  key={`row1-${i}`}
                  className="flex items-center shrink-0 gap-3 px-5 py-2.5 bg-[#0F172A]/60 border border-slate-800/60 rounded-xl hover:border-cyan-500/40 hover:bg-[#1E293B]/80 transition-all cursor-default group"
                >
                  <img
                    src={chain.logo}
                    alt={chain.name}
                    className="w-5 h-5 object-contain filter brightness-110 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-sm font-bold text-slate-300 tracking-tight">
                    {chain.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="animate-scroll-right flex gap-3 shrink-0">
              {[
                { name: "Optimism", logo: "public/optimism-ethereum-op-logo.svg" },
                { name: "Base", logo: "public/based-brett-brett-logo.svg" },
                { name: "Avalanche", logo: "public/avalanche-avax-logo.svg" },
                { name: "Fantom", logo: "public/fantom-ftm-logo.svg" },
                { name: "Optimism", logo: "public/optimism-ethereum-op-logo.svg" },
                { name: "Base", logo: "public/based-brett-brett-logo.svg" },
                { name: "Avalanche", logo: "public/avalanche-avax-logo.svg" },
                { name: "Fantom", logo: "public/fantom-ftm-logo.svg" },
              ].map((chain, i) => (
                <div
                  key={`row2-${i}`}
                  className="flex items-center shrink-0 gap-3 px-5 py-2.5 bg-[#0F172A]/60 border border-slate-800/60 rounded-xl hover:border-cyan-500/40 hover:bg-[#1E293B]/80 transition-all cursor-default group"
                >
                  <img
                    src={chain.logo}
                    alt={chain.name}
                    className="w-5 h-5 object-contain filter brightness-110 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-sm font-bold text-slate-300 tracking-tight">
                    {chain.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Use NovaTrack */}
        <div className="mt-40 w-full max-w-5xl mx-auto">
          <motion.h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight text-center mb-16"
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
          >
            Why Use NovaTrack
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {[
              { icon: <LayoutDashboard size={20} />, title: "Simple and clear dashboard", desc: "Many crypto tools are confusing. NovaTrack focuses on simplicity so anyone can understand their portfolio." },
              { icon: <Globe size={20} />, title: "All assets in one view", desc: "Instead of checking many wallets and platforms, NovaTrack shows everything together." },
              { icon: <Zap size={20} />, title: "Real-time market information", desc: "Track the value of your assets and see how prices change in the market." },
              { icon: <ShieldCheck size={20} />, title: "Secure wallet connection", desc: "Your wallet stays in your control. NovaTrack only reads public blockchain data." },
            ].map((feature, i) => (
              <motion.div key={i} className="flex gap-5"
                initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={fadeUp}
              >
                <div className="flex-shrink-0 mt-1 w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                  <div className="text-cyan-400">{feature.icon}</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-2">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-40 pb-40 w-full max-w-3xl mx-auto">
          <motion.h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight text-center mb-16"
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="bg-[#0F172A]/40 border border-slate-800/60 rounded-3xl overflow-hidden transition-all duration-300 hover:border-slate-700"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                >
                  <span className="text-lg md:text-xl font-bold text-white tracking-tight pr-4">
                    {faq.q}
                  </span>
                  <div className="flex-shrink-0">
                    {openFaq === index ? (
                      <Minus size={24} className="text-cyan-400" />
                    ) : (
                      <Plus size={24} className="text-white" />
                    )}
                  </div>
                </button>

                <div
                  className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === index
                      ? "max-h-40 pb-8 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                    {faq.a}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}