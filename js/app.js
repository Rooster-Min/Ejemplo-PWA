var url=windows.location.href;
var ubicacionsw='/Ejemplo-PWA/sw.js';
if(navigator.serviceWorker){
   if(url.includes('localhost')){
         ubicacionsw='/sw.js';
   }
   navigator.serviceWorker.register(ubicacionsw); 
}  