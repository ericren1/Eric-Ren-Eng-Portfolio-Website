const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
});

const field = (value, fallback = 'Unknown') =>
  (typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 1024) : '') || fallback;

function normalizeIP(value) {
  const ip = (value || '').trim().toLowerCase();
  try {
    return ip.includes(':') ? new URL('http://[' + ip + ']').hostname : ip;
  } catch {
    return ip;
  }
}

async function readPayload(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const decoder = new TextDecoder();
  let text = '', size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        throw new RangeError();
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}

async function notify(webhook, embed) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowed_mentions: { parse: [] }, embeds: [embed] }),
      signal: controller.signal,
    });
    if (!response.ok) console.warn('Visitor notification was not delivered.');
    await response.body?.cancel();
  } catch {
    console.warn('Visitor notification was not delivered.');
  } finally {
    clearTimeout(timeout);
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') return json({ success: false }, 405, { Allow: 'POST' });
  const origin = request.headers.get('Origin');
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site') {
    return json({ success: false }, 403);
  }
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
    return json({ success: false }, 415);
  }
  let payload;
  try {
    payload = await readPayload(request);
  } catch (error) {
    return json({ success: false }, error instanceof RangeError ? 413 : 400);
  }
  if (!payload || typeof payload.page !== 'string' || !payload.page.startsWith('/') ||
      payload.page.startsWith('//') || typeof payload.referrer !== 'string') {
    return json({ success: false }, 400);
  }
  const ip = request.headers.get('CF-Connecting-IP');
  const ignoredIPs = (env.IGNORED_VISITOR_IPS || '').split(',').map(normalizeIP).filter(Boolean);
  if (ip && ignoredIPs.includes(normalizeIP(ip))) return json({ success: true }, 202);
  if (!env.DISCORD_WEBHOOK_URL) return json({ success: false }, 503);

  const timestamp = new Date().toISOString();
  const embed = {
    title: 'Portfolio visit',
    color: 0x626b50,
    fields: [
      { name: 'Page', value: field(payload.page), inline: false },
      { name: 'IP address', value: field(ip), inline: true },
      { name: 'Country', value: field(request.headers.get('CF-IPCountry')), inline: true },
      { name: 'Referrer', value: field(payload.referrer, 'Direct visit'), inline: false },
      { name: 'User agent', value: field(request.headers.get('User-Agent')), inline: false },
      { name: 'Timestamp', value: timestamp, inline: false },
    ],
    timestamp,
  };
  context.waitUntil(notify(env.DISCORD_WEBHOOK_URL, embed));
  return json({ success: true }, 202);
}
