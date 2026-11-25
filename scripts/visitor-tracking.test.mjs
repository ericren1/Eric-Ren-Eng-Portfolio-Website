import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/visit.js';

const webhook = 'https://discord.com/api/webhooks/test/token';
function request(body = { page: '/', referrer: '' }, headers = {}, method = 'POST') {
  return new Request('https://portfolio.example/api/visit', {
    method,
    headers: { 'Content-Type': 'application/json', Origin: 'https://portfolio.example', ...headers },
    ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  });
}
async function visit(incoming, env = { DISCORD_WEBHOOK_URL: webhook }) {
  const tasks = [];
  const response = await onRequest({ request: incoming, env, waitUntil: task => tasks.push(task) });
  await Promise.all(tasks);
  return { response, tasks };
}

test('Sends the Cloudflare IP and visit metadata in a server-side Discord embed', async t => {
  const sent = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    sent.push({ url, options });
    return new Response(null, { status: 204 });
  });
  const { response, tasks } = await visit(request({ page: '/experience', referrer: 'https://search.example/' }, {
    'CF-Connecting-IP': '203.0.113.42', 'CF-IPCountry': 'CA',
    'X-Forwarded-For': '192.0.2.99', 'User-Agent': 'Portfolio visitor',
  }));
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(tasks.length, 1);
  assert.equal(sent[0].url, webhook);
  const payload = JSON.parse(sent[0].options.body);
  const embed = payload.embeds[0];
  const fields = Object.fromEntries(embed.fields.map(field => [field.name, field.value]));
  assert.equal(fields.Page, '/experience');
  assert.equal(fields['IP address'], '203.0.113.42');
  assert.equal(fields.Country, 'CA');
  assert.equal(fields.Referrer, 'https://search.example/');
  assert.equal(fields['User agent'], 'Portfolio visitor');
  assert.ok(Number.isFinite(Date.parse(embed.timestamp)));
  assert.equal(fields.Timestamp, embed.timestamp);
  assert.deepEqual(payload.allowed_mentions, { parse: [] });
});

test('Uses clear fallbacks and keeps embed field values within Discord limits', async t => {
  let embed;
  t.mock.method(globalThis, 'fetch', async (_, options) => {
    embed = JSON.parse(options.body).embeds[0];
    return new Response(null, { status: 204 });
  });
  await visit(request({ page: '/', referrer: '' }, { 'User-Agent': 'x'.repeat(2000) }));
  const fields = Object.fromEntries(embed.fields.map(field => [field.name, field.value]));
  assert.equal(fields['IP address'], 'Unknown');
  assert.equal(fields.Country, 'Unknown');
  assert.equal(fields.Referrer, 'Direct visit');
  assert.equal(fields['User agent'].length, 1024);
});

test('Rejects invalid requests before contacting Discord', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new Error('Unexpected outbound request'); });
  for (const [incoming, status] of [
    [request({}, {}, 'GET'), 405],
    [request({}, { Origin: 'https://other.example' }), 403],
    [request({}, { 'Sec-Fetch-Site': 'cross-site' }), 403],
    [request('{}', { 'Content-Type': 'text/plain' }), 415],
    [request('{'), 400],
    [request(null), 400],
    [request({ page: '//other.example/', referrer: '' }), 400],
    [request({ page: '/', referrer: 123 }), 400],
    [request({ page: '/', referrer: 'x'.repeat(5000) }), 413],
  ]) {
    const { response, tasks } = await visit(incoming);
    assert.equal(response.status, status);
    assert.equal(tasks.length, 0);
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test('Missing webhook configuration never makes an outbound request', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new Error('Unexpected outbound request'); });
  const { response, tasks } = await visit(request(), {});
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { success: false });
  assert.equal(tasks.length, 0);
  assert.equal(fetch.mock.callCount(), 0);
});

test('Discord errors and rejected network requests do not reject background tasks', async t => {
  t.mock.method(console, 'warn', () => {});
  for (const unavailable of [async () => new Response(null, { status: 429 }), async () => { throw new Error('Offline'); }]) {
    const mock = t.mock.method(globalThis, 'fetch', unavailable);
    const { response } = await visit(request());
    assert.equal(response.status, 202);
    assert.deepEqual(await response.json(), { success: true });
    mock.mock.restore();
  }
});
