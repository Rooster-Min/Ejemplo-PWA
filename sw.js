// CONSTANTES DE ALMACENAMIENTO CACHE
const CACHE = 'cache-3';
const CACHE_DINAMICO = 'dinamico-1';
const CACHE_ESTATICO = 'estatico-1';
const CACHE_INMUTABLE = 'inmutable-1';

// INSTALACIÓN
self.addEventListener('install', evento => {
    const cacheBase = caches.open(CACHE)
        .then(cache => {
            return cache.addAll([
                './index.html',
                './css/style.css',
                './img/main.jpg',
                './js/app.js',
                './img/no-img.jpeg',
                './pages/offline.html'
            ]);
        });

    const cacheInmutable = caches.open(CACHE_INMUTABLE)
        .then(cache => {
            return cache.add(
                'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
            );
        });

    evento.waitUntil(
        Promise.all([cacheBase, cacheInmutable])
    );
});

// ACTIVACIÓN
self.addEventListener('activate', evento => {
    const respuesta = caches.keys().then(keys => {
        return Promise.all(
            keys.map(key => {
                if (key !== CACHE && key.includes('cache')) {
                    return caches.delete(key);
                }
            })
        );
    });

    evento.waitUntil(respuesta);
});

// LIMPIEZA DE CACHE
function limpiarCache(nombreCache, numeroItems) {
    caches.open(nombreCache)
        .then(cache => {
            return cache.keys().then(keys => {
                if (keys.length > numeroItems) {
                    return cache.delete(keys[0]).then(() => {
                        return limpiarCache(nombreCache, numeroItems);
                    });
                }
            });
        });
}

// CACHE WITH NETWORK FALLBACK
self.addEventListener('fetch', evento => {
    if (evento.request.method !== 'GET') return;

    const respuesta = caches.match(evento.request)
        .then(res => {
            if (res) return res;

            return fetch(evento.request)
                .then(resWeb => {
                    if (resWeb && resWeb.ok) {
                        const copia = resWeb.clone();

                        caches.open(CACHE_DINAMICO)
                            .then(cache => {
                                cache.put(evento.request, copia);
                                limpiarCache(CACHE_DINAMICO, 2);
                            });
                    }

                    return resWeb;
                });
        })
        .catch(() => {
            const accept = evento.request.headers.get('accept') || '';

            if (accept.includes('text/html')) {
                const paginaOffline = new URL(
                    './pages/offline.html',
                    self.registration.scope
                ).href;

                return caches.match(paginaOffline);
            }
        });

    evento.respondWith(respuesta);
});

