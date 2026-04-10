export default function Spinner() {

  const dots = [
    { delay: "0s" },
    { delay: ".15s" },
    { delay: ".3s" }
  ];

  return (

    <div className="flex items-center justify-center pt-24 pb-16">
      
      <div className="flex items-center gap-2.5"> 
        {dots.map((dot, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full relative group`}
          >

            <span 
              className="absolute inset-0 bg-cyan-500 rounded-full animate-bounce" 
              style={{ animationDelay: dot.delay }}
            />
            

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