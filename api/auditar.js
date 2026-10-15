// Análisis mínimo de una web para el adelanto de auditoría del portfolio.
// Lee solo el HTML inicial de una URL pública y devuelve datos simples; el sitio arma el informe.
const dns = require('node:dns').promises;
const net = require('node:net');

const MAX_BYTES = 2 * 1024 * 1024;
const TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 3;

// Direcciones que nunca se consultan (red local, loopback, metadatos de nubes, etc.)
function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19));
  }
  const v = ip.toLowerCase();
  if (v.startsWith('::ffff:')) return isPrivateIp(v.slice(7));
  return v === '::' || v === '::1' || v.startsWith('fc') || v.startsWith('fd') ||
    v.startsWith('fe8') || v.startsWith('fe9') || v.startsWith('fea') || v.startsWith('feb') || v.startsWith('ff');
}

async function assertPublic(u) {
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('protocolo');
  if (u.port && u.port !== '80' && u.port !== '443') throw new Error('puerto');
  if (u.username || u.password) throw new Error('credenciales');
  const host = u.hostname.replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) throw new Error('host');
  const addrs = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true });
  if (!addrs.length || addrs.some(a => isPrivateIp(a.address))) throw new Error('host');
}

async function readLimited(res) {
  const reader = res.body.getReader();
  const chunks = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > MAX_BYTES) { await reader.cancel(); break; }
    chunks.push(value);
  }
  return { html: Buffer.concat(chunks.map(c => Buffer.from(c))).toString('utf8'), bytes: size };
}

const count = (html, re) => (html.match(re) || []).length;
const attr = (tag, name) => { const m = tag.match(new RegExp('\\s' + name + '\\s*=\\s*("([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i')); return m ? (m[2] ?? m[3] ?? m[4] ?? '') : null; };

// Links y botones sin nombre: no tienen texto, aria-label, title ni una imagen con alt adentro
function namedControls(html) {
  const unnamed = re => (html.match(re) || []).filter(m => {
    const open = (m.match(/^<[^>]*>/) || [''])[0];
    if (attr(open, 'aria-label') || attr(open, 'aria-labelledby') || attr(open, 'title')) return false;
    if (/<img\b[^>]*\salt\s*=\s*["'][^"']+["']/i.test(m)) return false;
    return !m.replace(/<[^>]+>/g, '').replace(/&nbsp;|\s/g, '');
  }).length;
  return {
    links: count(html, /<a\b[^>]*href/gi),
    linksNoText: unnamed(/<a\b[^>]*href[^>]*>[\s\S]*?<\/a>/gi),
    buttons: count(html, /<button\b/gi),
    buttonsNoText: unnamed(/<button\b[^>]*>[\s\S]*?<\/button>/gi),
  };
}

function analyze(html) {
  const head = (html.match(/<head[\s\S]*?<\/head>/i) || [html])[0];
  const title = ((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '').replace(/\s+/g, ' ').trim();
  const metas = head.match(/<meta\b[^>]*>/gi) || [];
  const metaBy = (key, val) => metas.find(m => (attr(m, key) || '').toLowerCase() === val);
  const desc = metaBy('name', 'description');
  const viewport = metaBy('name', 'viewport');
  const ogImage = metaBy('property', 'og:image');
  const htmlTag = (html.match(/<html\b[^>]*>/i) || [''])[0];
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const fields = h => (h.match(/<(input|select|textarea)\b[^>]*>/gi) || [])
    .filter(t => !/type\s*=\s*["']?(hidden|submit|button|image|reset)/i.test(t));
  const inputs = fields(html);
  // Un campo dentro de su <label> ya está etiquetado: se evalúan solo los que quedan afuera
  const outside = fields(html.replace(/<label\b[\s\S]*?<\/label>/gi, ''));
  const labelFor = new Set((html.match(/<label\b[^>]*>/gi) || []).map(l => attr(l, 'for')).filter(Boolean));
  const body = (html.match(/<body[\s\S]*<\/body>/i) || [html])[0]
    .replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return {
    title, titleLen: title.length,
    desc: desc ? (attr(desc, 'content') || '').trim().length : 0,
    viewport: !!viewport,
    lang: !!attr(htmlTag, 'lang'),
    h1: count(html, /<h1\b/gi),
    imgs: imgs.length,
    imgsNoAlt: imgs.filter(t => attr(t, 'alt') === null).length,
    inputs: inputs.length,
    inputsNoLabel: outside.filter(t => !attr(t, 'aria-label') && !attr(t, 'aria-labelledby') && !(attr(t, 'id') && labelFor.has(attr(t, 'id')))).length,
    ogImage: !!ogImage,
    favicon: /<link\b[^>]*rel\s*=\s*["'][^"']*icon/i.test(head),
    appleIcon: /<link\b[^>]*rel\s*=\s*["']apple-touch-icon/i.test(head),
    h2: count(html, /<h2\b/gi),
    main: /<main\b|role\s*=\s*["']main/i.test(html),
    nav: /<nav\b|role\s*=\s*["']navigation/i.test(html),
    ...namedControls(html),
    textChars: body.length,
  };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const send = (code, data) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(data)); };
  let raw = String((req.query && req.query.url) || '').trim();
  if (!raw || raw.length > 2048) return send(400, { error: 'url' });
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;

  let u;
  try { u = new URL(raw); } catch { return send(400, { error: 'url' }); }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const started = Date.now();
    let r;
    for (let i = 0; ; i++) {
      await assertPublic(u);
      r = await fetch(u, { redirect: 'manual', signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AuditoriaUX-andreaperez.dev/1.0)', 'Accept': 'text/html,application/xhtml+xml' } });
      const loc = r.headers.get('location');
      if (r.status >= 300 && r.status < 400 && loc) {
        if (i >= MAX_REDIRECTS) return send(422, { error: 'redirects' });
        u = new URL(loc, u);
        continue;
      }
      break;
    }
    if (!/html/i.test(r.headers.get('content-type') || '')) return send(422, { error: 'nohtml' });
    const { html, bytes } = await readLimited(r);
    const ms = Date.now() - started;
    send(200, { url: u.href, host: u.hostname, status: r.status, https: u.protocol === 'https:', ms, kb: Math.round(bytes / 1024), ...analyze(html) });
  } catch (e) {
    send(422, { error: e.name === 'AbortError' ? 'timeout' : 'fetch' });
  } finally {
    clearTimeout(timer);
  }
};
