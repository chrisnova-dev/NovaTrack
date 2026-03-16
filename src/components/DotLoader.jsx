export const DotLoader = () => {
  return (
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 animate-spin">
        <span className="absolute w-2 h-2 bg-purple-500 rounded-full top-0 left-1/2 -translate-x-1/2"></span>
        <span className="absolute w-2 h-2 bg-purple-500 rounded-full bottom-0 left-1/2 -translate-x-1/2"></span>
        <span className="absolute w-2 h-2 bg-purple-500 rounded-full left-0 top-1/2 -translate-y-1/2"></span>
        <span className="absolute w-2 h-2 bg-purple-500 rounded-full right-0 top-1/2 -translate-y-1/2"></span>
      </div>
    </div>
  );
};