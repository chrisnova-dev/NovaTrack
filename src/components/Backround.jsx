import React from "react";

const BlockchainBackground = () => {
  return (
    <div className="absolute inset-0 z-0 bg-[#0B0E14] overflow-hidden pointer-events-none">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
      
      {/* SVG Circuit & Cubes */}
      <svg
        className="absolute top-10 right-10 w-[600px] h-[600px] opacity-60"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Connection Lines */}
        <path
          d="M50 200H150M150 200L200 150M200 150H300M150 200L200 250M200 250H300"
          stroke="#22D3EE"
          strokeWidth="0.5"
          strokeDasharray="4 4"
          className="opacity-30"
        />
        

        {/* Isometric Cubes (Representing Blocks) */}
        {[
          { x: 220, y: 80 },
          { x: 140, y: 180 },
          { x: 280, y: 220 },
        ].map((cube, i) => (
          <g key={i} transform={`translate(${cube.x}, ${cube.y})`} className="animate-pulse" style={{ animationDelay: `${i * 1}s` }}>
            {/* Cube Sides */}
            <path d="M0 20L20 10L40 20L20 30L0 20Z" fill="#22D3EE" fillOpacity="0.2" stroke="#22D3EE" />
            <path d="M0 20V40L20 50V30L0 20Z" fill="#22D3EE" fillOpacity="0.1" stroke="#22D3EE" />
            <path d="M20 30V50L40 40V20L20 30Z" fill="#22D3EE" fillOpacity="0.15" stroke="#22D3EE" />
            {/* Glowing Center Point */}
            <circle cx="20" cy="30" r="2" fill="#22D3EE" className="shadow-[0_0_10px_#22D3EE]" />
          </g>
        ))}

        {/* Animated Nodes (Dots) */}
        {[
          { cx: 150, cy: 200 },
          { cx: 200, cy: 150 },
          { cx: 300, cy: 150 },
          { cx: 200, cy: 250 },
        ].map((node, i) => (
          <circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r="3"
            fill="#22D3EE"
            className="animate-ping"
            style={{ animationDuration: '3s', animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </svg>

      {/* Hexagon Mesh Pattern (Left side) */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }}
      />
    </div>
  );
};

export default BlockchainBackground;