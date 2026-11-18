self.addEventListener('install',evento=>{
    console.log("SW: INSTALANDO SERVICE WORKER");
    const instalacion=new Promise((resolve,reject)=>{
        setTimeout(()=>{
    console.log("SW: INSTALACION TERMINADA")
      self.skipWaiting();
      resolve();
    
   },5000)
})
evento.waitUntil(instalacion);
})