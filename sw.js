/* عامل خدمة بسيط: يجعل المشغل قابلاً للتثبيت ويفتح الواجهة بسرعة.
   الصفحة من الشبكة أولاً (لتصل التحديثات فوراً)، والأيقونات من الذاكرة. طلبات البيانات إلى Google لا تُحفظ أبداً. */
const CACHE = 'kh-v3', SHELL = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  if (r.mode === 'navigate' || u.pathname.endsWith('.html') || u.pathname.endsWith('/') || u.pathname.endsWith('config.js')) {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; }).catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r)));
});
