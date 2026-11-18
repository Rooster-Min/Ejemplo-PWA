self.addEventListener('fetch', evento => {
    const respuestaOffline = new Response("ocupas conexion a internet master ;)");
    
    const respuesta = fetch(evento.request)
        .catch(() => respuestaOffline); 
        
    evento.respondWith(respuesta);
});