// Delay helper for rate-limit retries
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* -------------------------------- */
/* PRICE CACHE (prevents API spam)  */
/* -------------------------------- */
const priceCache = {};
const CACHE_TIME = 60000; // 1 minute cache

/* -------------------------------- */
/* BATCH FETCH NATIVE PRICES        */
/* -------------------------------- */

/**
 * Fetches multiple native prices in a single request to avoid 429 errors.
 * @param {string[]} ids - Array of CoinGecko IDs (e.g., ['ethereum', 'binancecoin'])
 */
export const fetchAllNativePrices = async (ids = [], retry = 0) => {
  if (!ids.length) return {};

  const batchKey = ids.sort().join(",");
  
  // Check Cache first
  if (priceCache[batchKey] && Date.now() - priceCache[batchKey].time < CACHE_TIME) {
    return priceCache[batchKey].data;
  }

  const FALLBACK_PRICES = {
    ethereum: { usd: 2500, usd_24h_change: 0 },
    binancecoin: { usd: 350, usd_24h_change: 0 },
    "polygon-ecosystem": { usd: 0.7, usd_24h_change: 0 },
    optimism: { usd: 3.5, usd_24h_change: 0 },
    arbitrum: { usd: 1.8, usd_24h_change: 0 },
    base: { usd: 2500, usd_24h_change: 0 },
    monad: { usd: 1.0, usd_24h_change: 0 }
  };

  const idString = ids.join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idString}&vs_currencies=usd&include_24hr_change=true`;

  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/json" }
    });

    // Handle Rate Limiting
    if (res.status === 429 && retry < 2) {
      console.warn("Batch Price Limit hit. Retrying in 3s...");
      await delay(3000);
      return fetchAllNativePrices(ids, retry + 1);
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // Update Cache
    priceCache[batchKey] = {
      data,
      time: Date.now()
    };

    return data;
  } catch (error) {
    console.warn("Price fetch failed, using partial fallbacks", error.message);
    // Return fallbacks for requested IDs so UI doesn't break
    const result = {};
    ids.forEach(id => {
      result[id] = FALLBACK_PRICES[id] || { usd: 0, usd_24h_change: 0 };
    });
    return result;
  }
};

/* -------------------------------- */
/* FETCH TOKEN PRICES (PER PLATFORM)*/
/* -------------------------------- */

export const fetchTokenPrices = async (
  platform = "ethereum",
  contractAddresses = [],
  retry = 0
) => {
  if (!contractAddresses.length) return {};

  const cleanAddresses = contractAddresses.map(a => a.toLowerCase());
  const cacheKey = `${platform}-${cleanAddresses.join(",")}`;

  if (priceCache[cacheKey] && Date.now() - priceCache[cacheKey].time < CACHE_TIME) {
    return priceCache[cacheKey].data;
  }

  const url = `https://api.coingecko.com/api/v3/simple/token_price/${platform}?contract_addresses=${cleanAddresses.join(",")}&vs_currencies=usd&include_24hr_change=true`;

  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/json" }
    });

    if (res.status === 429 && retry < 2) {
      await delay(2000);
      return fetchTokenPrices(platform, contractAddresses, retry + 1);
    }

    if (!res.ok) throw new Error("Token Price API Error");

    const data = await res.json();
    priceCache[cacheKey] = { data, time: Date.now() };
    return data;
  } catch (error) {
    console.error("Token price error:", error.message);
    return {};
  }
};

// Kept for backward compatibility but routes to the batch function internally
export const fetchNativePrice = async (id = "ethereum") => {
  const result = await fetchAllNativePrices([id]);
  return result[id] || { usd: 0, usd_24h_change: 0 };
};