// Delay helper for rate limit retry
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch token prices from CoinGecko using contract addresses
 */
export const fetchTokenPrices = async (
  platform = "ethereum",
  contractAddresses = []
) => {
  if (!contractAddresses.length) return {};

  const addresses = contractAddresses.join(",").toLowerCase();

  const url = `https://api.coingecko.com/api/v3/simple/token_price/${platform}?contract_addresses=${addresses}&vs_currencies=usd&include_24hr_change=true`;

  try {
    const res = await fetch(url);

    if (res.status === 429) {
      console.warn("CoinGecko rate limit hit. Retrying...");
      await delay(2000);
      return fetchTokenPrices(platform, contractAddresses);
    }

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error("Token price fetch error:", error.message);
    return {};
  }
};

/**
 * Fetch native coin price
 */
export const fetchNativePrice = async (id = "ethereum") => {
  const FALLBACK_PRICES = {
    ethereum: { usd: 2500, usd_24h_change: 0 },
    binancecoin: { usd: 350, usd_24h_change: 0 },
    "matic-network": { usd: 0.7, usd_24h_change: 0 },
    optimism: { usd: 3.5, usd_24h_change: 0 },
    arbitrum: { usd: 1.8, usd_24h_change: 0 },
  };

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`;

  try {
    const res = await fetch(url);

    if (res.status === 429) {
      await delay(1500);
      return fetchNativePrice(id);
    }

    if (!res.ok) throw new Error("API error");

    const data = await res.json();

    return data[id] || FALLBACK_PRICES[id] || { usd: 0, usd_24h_change: 0 };
  } catch (error) {
    console.warn(`Using fallback price for ${id}`);
    return FALLBACK_PRICES[id] || { usd: 0, usd_24h_change: 0 };
  }
};