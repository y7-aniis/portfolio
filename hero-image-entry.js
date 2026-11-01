// Opacity-only entrance keeps the scroll-particle sampling geometry unchanged.
(()=>{
 const visual=document.querySelector('.wego-screens, .heatguard-visual');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!visual||reduced.matches)return;
 visual.style.opacity='0';
 let ready=false,visible=false,played=false;
 function start(){
  if(!ready||!visible||document.hidden||played)return;
  played=true;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   if(reduced.matches){visual.style.opacity='';return;}
   const entry=visual.animate([{opacity:0},{opacity:1}],{
    duration:visual.matches('.wego-screens')?1600:1100,
    delay:180,easing:'ease-in-out',fill:'both'
   });
   const finish=()=>{visual.style.opacity='';entry.cancel();};
   entry.finished.then(finish,()=>{visual.style.opacity='';});
  }));
 }
 const observer=new IntersectionObserver(entries=>{
  visible=entries.some(entry=>entry.isIntersecting);start();
  if(played)observer.disconnect();
 },{threshold:0.15});
 observer.observe(visual);
 document.addEventListener('visibilitychange',start);
 reduced.addEventListener('change',()=>{if(reduced.matches)visual.style.opacity='';});
 Promise.all([...visual.querySelectorAll('img')].map(img=>img.decode().catch(()=>{})))
  .then(()=>document.fonts.ready).then(()=>{ready=true;start();});
})();
