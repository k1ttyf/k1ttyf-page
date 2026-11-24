
const API = 'https://ws.audioscrobbler.com/2.0/';
const NOW_TTL = 15;
const DURATION_TTL = 86400;
const PLACEHOLDER = '2a96cbd8b46e442fc41c2b86b821562f';

const ALLOWED_ORIGINS = [/^https:\/\/(www\.)?k1ttyf\.xyz$/, /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/];

const corsHeaders = (origin) => {
  const ok = origin && ALLOWED_ORIGINS.some((re) => re.test(origin));
  return ok ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : { Vary: 'Origin' };
};

const json = (data, origin, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${NOW_TTL}`,
      ...corsHeaders(origin),
    },
  });

const lastfm = async (env, params) => {
  const url = new URL(API);
  Object.entries({ ...params, api_key: env.LASTFM_KEY, format: 'json' })
    .forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url, { headers: { 'User-Agent': 'k1ttyf-np-widget' } });
  if (!res.ok) throw new Error('last.fm ' + res.status);
  const data = await res.json();
  if (data.error) throw new Error('last.fm error ' + data.error);
  return data;
};

const getDuration = async (env, ctx, artist, track) => {
  const cache = caches.default;
  const key = new Request('https://cache.internal/duration?' + new URLSearchParams({ artist, track }));
  const hit = await cache.match(key);
  if (hit) return parseInt(await hit.text(), 10) || 0;

  let ms = 0;
  try {
    const data = await lastfm(env, { method: 'track.getInfo', artist, track, autocorrect: 1 });
    ms = parseInt(data.track && data.track.duration, 10) || 0;
  } catch (e) {
    return 0;
  }
  ctx.waitUntil(cache.put(key, new Response(String(ms), {
    headers: { 'Cache-Control': `public, max-age=${DURATION_TTL}` },
  })));
  return ms;
};

const pickImage = (t) => {
  const imgs = t.image || [];
  const img = imgs.find((i) => i.size === 'extralarge') || imgs[imgs.length - 1];
  const src = img && img['#text'];
  return src && !src.includes(PLACEHOLDER) ? src : '';
};

const estimateStart = (prev, prevDurMs, curDurMs) => {
  if (!prev || !prev.date || !prevDurMs) return null;
  const now = Date.now();
  const guess = parseInt(prev.date.uts, 10) * 1000 + prevDurMs;
  const limit = curDurMs || 15 * 60 * 1000;
  if (guess <= now + 5000 && now - guess <= limit) return Math.min(guess, now);
  return null;
};

const buildNowPlaying = async (env, ctx) => {
  const data = await lastfm(env, { method: 'user.getrecenttracks', user: env.LASTFM_USER, limit: 2 });
  const tracks = (data.recenttracks && data.recenttracks.track) || [];
  const cur = tracks[0];
  if (!cur || !(cur['@attr'] && cur['@attr'].nowplaying === 'true')) return { playing: false };

  const prev = tracks[1];
  const artist = cur.artist['#text'];
  const [durationMs, prevDurMs] = await Promise.all([
    getDuration(env, ctx, artist, cur.name),
    prev ? getDuration(env, ctx, prev.artist['#text'], prev.name) : 0,
  ]);

  return {
    playing: true,
    name: cur.name,
    artist,
    album: (cur.album && cur.album['#text']) || '',
    url: cur.url || '',
    image: pickImage(cur),
    durationMs,
    startMs: estimateStart(prev, prevDurMs, durationMs),
  };
};

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin');
    const { pathname } = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: { ...corsHeaders(origin), 'Access-Control-Allow-Methods': 'GET' } });
    }
    if (request.method !== 'GET' || pathname !== '/lastfm/now-playing') {
      return json({ error: 'not found' }, origin, 404);
    }

    const cache = caches.default;
    const key = new Request('https://cache.internal/now-playing');
    const hit = await cache.match(key);
    if (hit) return json(await hit.json(), origin);

    try {
      const payload = await buildNowPlaying(env, ctx);
      ctx.waitUntil(cache.put(key, new Response(JSON.stringify(payload), {
        headers: { 'Cache-Control': `public, max-age=${NOW_TTL}` },
      })));
      return json(payload, origin);
    } catch (e) {
      return json({ error: 'upstream' }, origin, 502);
    }
  },
};
