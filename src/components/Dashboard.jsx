
const DashboardCard = ({ title, value, subtitle, icon, loading }) => {
  return (
    <div className="bg-[#1a1b23] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        {/* If an icon is provided, render it here */}
        {icon && !loading && (
          <img src={icon} alt="network" className="w-8 h-8 rounded-full border border-white/10 shadow-lg" />
        )}
      </div>
      
      <div className="space-y-1">
        <p className={`text-3xl font-bold text-white tracking-tight ${loading ? 'animate-pulse bg-white/10 h-9 w-32 rounded' : ''}`}>
          {!loading && value}
        </p>
        <p className="text-gray-500 text-sm font-medium">{subtitle}</p>
      </div>
      
      {/* Decorative accent line */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full w-0" />
    </div>
  );
};

export default DashboardCard;