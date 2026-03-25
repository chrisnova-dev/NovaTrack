import React from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

const PortfolioChart = () => {
  const rawData = JSON.parse(localStorage.getItem("portfolioHistory")) || [];

  const data = rawData.map((item) => ({
    time: new Date(item.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: item.value,
  }));

  const isUp = data.length > 1 && data[data.length - 1].value > data[0].value;

  return (
    <div className=" backdrop-blur-xl p-6 md:p-8 shadow-2xl transition-all duration-500 hover:border-cyan-500/30">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
        <h3 className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
          Portfolio Performance
        </h3>
      </div>

      <div className="w-full h-48 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0B0E14",
                border: "1px solid rgba(34, 211, 238, 0.2)",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#fff",
              }}
              itemStyle={{ color: "#22d3ee" }}
              cursor={{
                stroke: "#22d3ee",
                strokeWidth: 1,
                strokeDasharray: "5 5",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={isUp ? "#22d3ee" : "#f43f5e"}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 4, fill: "#22d3ee", strokeWidth: 0 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Subtle bottom detail */}
      <div className="mt-4 flex justify-between items-center opacity-40">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">
          Live Tracking
        </span>
        {/* Professional Cyan solid line */}
        <div className="h-[1px] flex-1 mx-4 bg-cyan-700" />
      </div>
    </div>
  );
};

export default PortfolioChart;
