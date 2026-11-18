/*En todas las estrategias, el primer paso es subir a cache archivos
elegidos como necesarios, la elección depende del proyecto y sus necesidades
de carga sin conexión a interner*/ 

//CONSTANTES DE ALMACENAMIENTO CACHE
const CACHE ='cache-1';
const CACHE_DINAMICO ='dinamico-1';
const CACHE_ESTATICO ='estatico-1';
const CACHE_INMUTABLE ='inmutable-1';


/***********************INSTALACIÓN ************************
Indicamos que durante el proceso de instalación se registren 
los archivos base en cache acorde a su tipo
************************************************************/

self.addEventListener('install', evento=>{
    /*Promesa que crea el proceso de creación del espacio 
    en cache y agrega los archivos necesarios para cargar nuestra
    aplicación*/
    const cacheBase =caches.open(CACHE)
        .then(cache=>{
            return cache.addAll([
                '/',
                '/index.html',
                '/css/style.css',
                '/img/main.jpg',
                '/js/app.js'
            ]);
        });

        //Separamos los archivos que no se modificarán en un espacio de cache inmutable
        const cacheInmutable =  caches.open(CACHE_INMUTABLE)
            .then(cache=>{
                cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css');
            });
       
            //Indicamos que la instalación espere hasta que las promesas se cumplan
        evento.waitUntil(Promise.all([cacheBase, cacheInmutable]));
});


/******************* FUNCIÓN DE LIMPIEZA DE CACHE ********************
/*Debemos mantener un número limitado e archivos para no sobrepasar el
espacio de almacenamiento cache, por ello se crea está función.
**********************************************************************/

//recibimos el nombre del espacio de cache a limpiar y el número de archivos permitido
function limpiarCache(nombreCache, numeroItems){
    //abrimos el cache
    caches.open(nombreCache)
        .then(cache=>{
            //recuperamos el arreglo de archivos existentes en el espacio de cache
            return cache.keys()
                .then(keys=>{
                    //si el número de archivos supera el limite permitido
                    if (keys.length>numeroItems){
                        //eliminamos el más antiguo y repetimos el proceso
                        cache.delete(keys[0])
                            .then(limpiarCache(nombreCache, numeroItems));
                    }
                });
        });
}


/************************ ESTRATEGÍA 4  *****************************
                   CACHE WITH NETWORK UPDATE
El usuario accede a la información de cache pero se actualizan en 
segundo plano las actualizaciones del sitio.
***********************************************************************/

self.addEventListener('fetch', evento =>{
   //Procesamos las peticiones del sitio

   //Abre el cache
   const respuesta = caches.open(CACHE)
       .then (cache => {
        //en segundo plano se recupera la versión actual de la web (fetch)
           fetch(evento.request)
               .then(resp=>{
                   //se actualizan los cambios
                   cache.put(evento.request,resp);
               });
           //retorna la petición con lo encontrado en cache
           return cache.match(evento.request);
       });
       
       //retornamos la respuesta
       evento.respondWith(respuesta);
   
       //si lo que se busca es el estilo de bootstrao, como se encuentra 
       //en otra sección de cache lo enviamos como respuesta individual
       if (evento.request.url.includes('bootstrap')){
           evento.respondWith(caches.match(evento.request));
       }


});