const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function loadService(name, get, clock = Date) {
  const source = fs.readFileSync(path.join(__dirname, '../src/services', name + '.service.ts'), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const context = { exports: {}, URL, URLSearchParams, Date: clock, require: (name) => {
    if (name === '@/lib/axios') return { axiosInstance: { get } };
    if (name === '@/lib/constants') return { API_BASE_URL: 'https://example.com/api/v1' };
    throw new Error(`Unexpected dependency: ${name}`);
  } };
  vm.runInNewContext(code, context);
  return context.exports[name + 'Service'];
}

test('home shares concurrent requests and refreshes after its TTL', async () => {
  let calls = 0;
  let now = 0;
  const service = loadService('home', async () => {
    calls++;
    return { data: { data: { branches: [{ _id: 'b', image: '/image.png' }], courses: [], tutorials: [] } } };
  }, { now: () => now });
  const first = service.getHome();
  assert.equal(service.getHome(), first);
  const data = await first;
  assert.equal(data.branches[0].image, 'https://example.com/image.png');
  await service.getHome();
  assert.equal(calls, 1);
  now = 60001;
  await service.getHome();
  assert.equal(calls, 2);
});

test('failed homepage requests can be retried', async () => {
  let calls = 0;
  const service = loadService('home', async () => {
    if (++calls === 1) throw new Error('offline');
    return { data: { data: {} } };
  });
  await assert.rejects(service.getHome());
  await service.getHome();
  assert.equal(calls, 2);
});

test('curriculum includes every page, preserves order, and bounds concurrency', async () => {
  let active = 0;
  let maximum = 0;
  let calls = 0;
  const service = loadService('tutorial', async (url) => {
    const params = new URL(url, 'https://example.com').searchParams;
    assert.equal(params.get('summary'), 'true');
    assert.equal(params.get('branch'), 'engineering');
    assert.equal(params.get('subject'), 'basics');
    calls++;
    maximum = Math.max(maximum, ++active);
    await new Promise(resolve => setTimeout(resolve, 2));
    active--;
    const page = Number(params.get('page'));
    return { data: { data: { tutorials: [{ _id: String(page), slug: `lesson-${page}` }], pagination: { totalPages: 7 } } } };
  });
  const [list, duplicate] = await Promise.all([service.getCurriculum('engineering', 'basics'), service.getCurriculum('engineering', 'basics')]);
  assert.equal(list, duplicate);
  assert.equal(list.map(item => item.id).join(','), '1,2,3,4,5,6,7');
  assert.equal(maximum, 3);
  await service.getCurriculum('engineering', 'basics');
  assert.equal(calls, 7);
});
