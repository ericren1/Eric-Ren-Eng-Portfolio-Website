const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
});

const field = (value, fallback = 'Unknown') =>
  (typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/[\\`*_~|<>\[\]]/g, '').trim().slice(0, 300) : '') || fallback;

function normalizeIP(value) {
  const ip = (value || '').trim().toLowerCase();
  try {
    return ip.includes(':') ? new URL('http://[' + ip + ']').hostname : ip;
  } catch {
    return ip;
  }
}

export function maskIP(value) {
  const ip = normalizeIP(value).replace(/^\[|\]$/g, '');
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip) && ip.split('.').every(part => Number(part) <= 255)) {
    return ip.split('.').slice(0, 3).join('.') + '.xxx';
  }
  if (ip.includes(':')) {
    const parts = ip.split('::');
    if (parts.length > 2) return 'Unknown';
    const left = parts[0] ? parts[0].split(':') : [];
    const right = parts[1] ? parts[1].split(':') : [];
    const expanded = parts.length === 2 ? [...left, ...Array(Math.max(0, 8-left.length-right.length)).fill('0'), ...right] : left;
    if (expanded.length === 8 && expanded.every(part => /^[0-9a-f]{1,4}$/.test(part))) {
      return expanded.slice(0, 3).map(part=>parseInt(part,16).toString(16)).join(':') + ':xxxx:xxxx:xxxx:xxxx:xxxx';
    }
  }
  return 'Unknown';
}

export function clientInfo(ua = '') {
  const browser = [[/Edg(?:e|A|iOS)?\/([\d.]+)/,'Edge'],[/OPR\/([\d.]+)/,'Opera'],[/(?:Firefox|FxiOS)\/([\d.]+)/,'Firefox'],[/(?:Chrome|CriOS)\/([\d.]+)/,'Chrome'],[/Version\/([\d.]+).*Safari/,'Safari']].find(([pattern])=>pattern.test(ua));
  return {
    browser: browser ? browser[1]+' '+ua.match(browser[0])[1].split('.')[0] : 'Unknown',
    os: /iPhone|iPad|iPod/.test(ua) ? 'iOS / iPadOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Macintosh|Mac OS X/.test(ua) ? 'macOS' : /CrOS/.test(ua) ? 'ChromeOS' : /Linux/.test(ua) ? 'Linux' : 'Unknown',
    device: /iPad|Tablet|Android(?!.*Mobile)/i.test(ua) ? 'Tablet' : /Mobile|iPhone|iPod/i.test(ua) ? 'Mobile' : ua ? 'Desktop / laptop' : 'Unknown',
  };
}

export function createVisitGuard() {
  const visitors = new Map(), pages = new Map();
  let total = 0, expires = 0, blockedUntil = 0;
  return {
    reserve(ip, page, now = Date.now()) {
      for (const [key,entry] of visitors) if (entry.expires <= now) visitors.delete(key);
      for (const [key,expiry] of pages) if (expiry <= now) pages.delete(key);
      if (now >= expires) { total = 0; expires = now + 60000; }
      const visitor = normalizeIP(ip), event = visitor+'|'+page;
      const entry = visitors.get(visitor);
      if (now < blockedUntil || pages.has(event) || total >= 30 || (entry?.count || 0) >= 5 || visitors.size >= 1024 || pages.size >= 1024) return false;
      visitors.set(visitor, {count:(entry?.count || 0)+1, expires:entry?.expires || now+60000});
      pages.set(event,now+60000);
      total++;
      return true;
    },
    pause(milliseconds) { blockedUntil = Math.max(blockedUntil, Date.now()+milliseconds); },
  };
}

const visitGuard = createVisitGuard();

function referrerSite(value) {
  if (!value) return 'Direct visit';
  try { const url=new URL(value);return /^https?:$/.test(url.protocol) ? field(url.origin) : 'Unknown'; } catch { return 'Unknown'; }
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
    if (!response.ok) {
      const retry = Number(response.headers.get('Retry-After'));
      visitGuard.pause(response.status === 429 ? Math.min(300,Math.max(1,retry || 60))*1000 : 10000);
      console.warn('Visitor notification was not delivered.');
    }
    await response.body?.cancel();
  } catch {
    visitGuard.pause(10000);
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
  const ua = request.headers.get('User-Agent') || '';
  const cf = request.cf || {};
  if (cf.botManagement?.verifiedBot || /bot\b|crawler|spider|headless|curl\/|wget\/|python-requests|facebookexternalhit|preview|slurp/i.test(ua)) return json({ success: true }, 202);
  if (!ip) return json({ success: true }, 202);
  if (!env.DISCORD_WEBHOOK_URL) return json({ success: false }, 503);
  const page = payload.page.split(/[?#]/)[0].slice(0,500);
  if (!visitGuard.reserve(ip,page)) return json({ success: true }, 202);

  const timestamp = new Date().toISOString();
  const client = clientInfo(ua);
  const city = field(cf.city);
  const region = field(cf.region);
  const country = field(cf.country || request.headers.get('CF-IPCountry'));
  const location = [cf.city,cf.region,cf.country].filter(value=>typeof value==='string'&&value.trim()).map(value=>field(value)).join(', ');
  const embed = {
    title: 'Portfolio visit',
    description: '**'+field(cf.asOrganization)+'**\nISP / Host / Network Organization',
    color: 0x4b5739,
    fields: [
      { name: 'ASN', value: cf.asn ? 'AS'+field(String(cf.asn)) : 'Unknown', inline: true },
      { name: 'Masked IP', value: maskIP(ip), inline: true },
      { name: 'City', value: city, inline: true },
      { name: 'Region', value: region, inline: true },
      { name: 'Country', value: country, inline: true },
      { name: 'Visitor timezone', value: field(cf.timezone), inline: true },
      { name: 'Approximate location', value: cf.city ? '[Open city in Google Maps](https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(location)+')' : 'Unavailable', inline: false },
      { name: 'Page visited', value: field(page), inline: true },
      { name: 'Referring website', value: referrerSite(payload.referrer), inline: true },
      { name: 'Device', value: client.device, inline: true },
      { name: 'Browser', value: client.browser, inline: true },
      { name: 'Operating system', value: client.os, inline: true },
      { name: 'Time (America/Toronto)', value: new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',dateStyle:'medium',timeStyle:'long'}).format(new Date(timestamp)), inline: false },
    ],
    footer: {text:'Approximate network location; organization may be an ISP, VPN, or cloud host, not an employer.'},
    timestamp,
  };
  context.waitUntil(notify(env.DISCORD_WEBHOOK_URL, embed));
  return json({ success: true }, 202);
}
