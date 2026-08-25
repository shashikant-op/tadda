const {
  getHomeCache,
  loadHomeCache,
  invalidateHomeCache
} = require('../utils/homeCache');

describe('homepage cache', () => {
  beforeEach(() => invalidateHomeCache());

  test('reuses loaded public homepage data', async () => {
    const loader = jest.fn().mockResolvedValue({ branches: [], courses: [], tutorials: [] });

    const first = await loadHomeCache(loader);
    const second = await loadHomeCache(loader);

    expect(first.status).toBe('MISS');
    expect(second.status).toBe('HIT');
    expect(loader).toHaveBeenCalledTimes(1);
    expect(getHomeCache()).toEqual(first.value);
  });

  test('deduplicates concurrent cache misses', async () => {
    const loader = jest.fn().mockResolvedValue({ branches: [{ name: 'CS' }] });

    const [first, second] = await Promise.all([
      loadHomeCache(loader),
      loadHomeCache(loader)
    ]);

    expect(loader).toHaveBeenCalledTimes(1);
    expect(first.value).toBe(second.value);
  });

  test('invalidation forces a refresh', async () => {
    const loader = jest.fn()
      .mockResolvedValueOnce({ version: 1 })
      .mockResolvedValueOnce({ version: 2 });

    await loadHomeCache(loader);
    invalidateHomeCache();
    const refreshed = await loadHomeCache(loader);

    expect(refreshed.value).toEqual({ version: 2 });
    expect(loader).toHaveBeenCalledTimes(2);
  });
});
