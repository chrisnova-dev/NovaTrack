const AssetCardList = ({ assets }) => {
  return (
    <div className="space-y-3">
      {assets.map((asset, i) => (
        <div
          key={i}
          className="bg-[#1a202c] border border-white/10 rounded-xl p-4 flex justify-between items-center"
        >
          <div className="flex items-center gap-3">

            <img
              src={asset.logo}
              className="w-8 h-8 rounded-full"
            />

            <div>
              <p className="text-white font-semibold">
                {asset.symbol}
              </p>

              <p className="text-gray-400 text-xs">
                {asset.balance}
              </p>
            </div>

          </div>

          <div className="text-right">

            <p className="text-white font-bold">
              ${asset.value}
            </p>

            <p
              className={`text-xs ${
                asset.change24h > 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {asset.change24h}%
            </p>

          </div>
        </div>
      ))}
    </div>
  );
};

export default AssetCardList;