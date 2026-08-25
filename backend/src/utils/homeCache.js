const HOME_CACHE_TTL_MS = 5 * 60 * 1000;

let cachedValue = null;
let expiresAt = 0;
let pendingLoad = null;

const getHomeCache = () => (
  cachedValue && Date.now() < expiresAt ? cachedValue : null
);

const setHomeCache = (value) => {
  cachedValue = value;
  expiresAt = Date.now() + HOME_CACHE_TTL_MS;
  return value;
};

const loadHomeCache = async (loader) => {
  const cached = getHomeCache();
  if (cached) return { value: cached, status: 'HIT' };

  if (!pendingLoad) {
    pendingLoad = Promise.resolve()
      .then(loader)
      .then(setHomeCache)
      .finally(() => {
        pendingLoad = null;
      });
  }

  return { value: await pendingLoad, status: 'MISS' };
};

const invalidateHomeCache = () => {
  cachedValue = null;
  expiresAt = 0;
};

module.exports = {
  HOME_CACHE_TTL_MS,
  getHomeCache,
  loadHomeCache,
  invalidateHomeCache
};
