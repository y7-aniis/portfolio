(()=>{
 const nav=document.querySelector('.case-chapter-nav');
 if(!nav)return;
 const links=[...nav.querySelectorAll('a')];
 const sections=links.map(link=>document.querySelector(link.hash));
 let queued=false;
 function update(){
  queued=false;
  const threshold=nav.getBoundingClientRect().height+100;
  let active=0;
  sections.forEach((section,index)=>{if(section&&section.getBoundingClientRect().top<=threshold)active=index;});
  links.forEach((link,index)=>{
   link.classList.toggle('active',index===active);
   if(index===active)link.setAttribute('aria-current','location');
   else link.removeAttribute('aria-current');
  });
 }
 function request(){if(!queued){queued=true;requestAnimationFrame(update);}}
 addEventListener('scroll',request,{passive:true});
 addEventListener('resize',request);
 update();
})();
