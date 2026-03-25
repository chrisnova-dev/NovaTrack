export default function Spinner() {
  // Config for the dots to keep the code clean and 'human'
  const dots = [
    { delay: "0s" },
    { delay: ".15s" },
    { delay: ".3s" }
  ];

  return (
    // Height adjusted from 60vh to a flexible padding, 
    // better for fitting inside cards or the AssetTable area.
    <div className="flex items-center justify-center pt-24 pb-16">
      
      {/* Relative container handles the spacing */}
      <div className="flex items-center gap-2.5"> 
        {dots.map((dot, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full relative group`}
          >
            {/* 1. Main Dot: Cyan with refined size/delay */}
            <span 
              className="absolute inset-0 bg-cyan-500 rounded-full animate-bounce" 
              style={{ animationDelay: dot.delay }}
            />
            
            {/* 2. Visual Polish: Subtle Background Glow */}
            <div 
              className="absolute -inset-1.5 bg-cyan-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" 
              style={{ animationDelay: dot.delay }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}