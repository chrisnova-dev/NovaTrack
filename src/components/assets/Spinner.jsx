export default function Spinner() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex gap-2">
        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:.15s]"></span>
        <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:.3s]"></span>
      </div>
    </div>
  );
}