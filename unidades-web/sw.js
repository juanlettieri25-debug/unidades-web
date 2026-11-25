// versión 8aea614f65
const CACHE = 'ul-8aea614f65';
const CARCASA = ['./', 'index.html', 'manifest.webmanifest', 'icono-192.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CARCASA)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((n) => n !== CACHE).map((n) => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;   // Supabase y todo lo de otro origen pasa directo
  // primero la red (así siempre se ve la versión nueva); si no hay red, lo último guardado
  e.respondWith(fetch(e.request).then((r) => { if (r.ok && CARCASA.some((x) => u.pathname.endsWith(x === './' ? '/' : x))) { const c = r.clone(); caches.open(CACHE).then((h) => h.put(e.request, c)); } return r; })
    .catch(() => caches.match(e.request).then((r) => r || caches.match('index.html'))));
});
