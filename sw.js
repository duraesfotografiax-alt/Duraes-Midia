// Service worker: deixa o app instalável e mostra as notificações do Fluxo da Mídia.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});

self.addEventListener("push", e => {
  let d = {};
  try{ d = e.data ? e.data.json() : {}; }catch(_){ d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Fluxo da Mídia", {
    body: d.body || "Abra o app para ver as postagens de hoje.",
    icon: "icon-192.png",
    badge: "icon-192.png",
    tag: d.tag || "fluxo",
    renotify: true,
    data: { url: d.url || "./?aba=fluxo" }
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./?aba=fluxo", self.registration.scope).href;
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all){
      if (c.url.startsWith(self.registration.scope)){
        try{ c.postMessage({ abrir: "fluxo" }); }catch(_){}
        return c.focus();
      }
    }
    return self.clients.openWindow(url);
  })());
});
