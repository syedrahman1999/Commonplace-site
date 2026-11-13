const CACHE_NAME='patternwork-classrooms-v5.2.0';
const APP_SHELL=[
  './',
  './index.html',
  './manifest.webmanifest',
  './src/styles.css',
  './src/classroom.css',
  './src/content.js',
  './src/arabic.js',
  './src/case-thematic-relations.js',
  './src/structure-linearity.js',
  './src/observations.js',
  './src/retests.js',
  './src/practice.js',
  './src/quality.js',
  './src/investigations.js',
  './src/construction.js',
  './src/app.js',
  './src/mobile.js',
  './assets/favicon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './assets/fonts/Amiri-Arabic-Regular.woff2',
  './assets/fonts/Amiri-Arabic-Bold.woff2',
  './assets/fonts/NotoSansSymbols2-Symbols.woff2'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('patternwork-classrooms-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{
      if(response.ok)caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',response.clone()));
      return response;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
    if(response.ok)caches.open(CACHE_NAME).then(cache=>cache.put(request,response.clone()));
    return response;
  })));
});
