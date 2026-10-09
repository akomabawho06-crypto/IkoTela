// IkoTela service worker — offline shell lang. Hindi nito kine-cache ang sync (Google) o ibang domain.
const V='ikotela-v3',SHELL=['/','/index.html','/manifest.webmanifest','/icon-192.png','/icon-512.png','/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==self.location.origin||u.pathname==='/sw.js')return; // sync at fonts: diretso sa network
  if(r.mode==='navigate'){ // network-first para laging updated; cache kapag offline
    e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put('/index.html',c))}return res}).catch(()=>caches.match('/index.html').then(m=>m||caches.match('/'))));return}
  e.respondWith(caches.match(r).then(m=>{const f=fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>m);return m||f}));
});
