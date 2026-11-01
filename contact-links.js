(()=>{
 const button=document.querySelector('#contact .email-copy');
 if(!button)return;
 const wrap=button.parentElement,tooltip=wrap.querySelector('[role="tooltip"]');
 const status=document.querySelector('#contact .contact-status');
 let timer,busy=false,hovered=false,focused=false,touch=false,generation=0;
 let pointer=null,typing;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function position(){
  if(!pointer)return;
  tooltip.classList.add('follow-pointer');
  const x=Math.max(8,Math.min(pointer.x+18,innerWidth-tooltip.offsetWidth-12));
  const y=Math.max(8,Math.min(pointer.y-8,innerHeight-tooltip.offsetHeight-12));
  tooltip.style.left=x+'px';tooltip.style.top=y+'px';
 }
 function anchor(){pointer=null;tooltip.classList.remove('follow-pointer');tooltip.style.left='';tooltip.style.top='';}
 button.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'){pointer={x:event.clientX,y:event.clientY};position();}});
 function show(message){
  cancelAnimationFrame(typing);wrap.classList.add('show-tooltip');
  if(!pointer||reduced.matches){tooltip.textContent=message;position();return;}
  const start=performance.now();
  function tick(now){const t=Math.min(1,(now-start)/160);tooltip.textContent=message.slice(0,Math.ceil((1-(1-t)**3)*message.length));position();if(t<1)typing=requestAnimationFrame(tick);}
  typing=requestAnimationFrame(tick);
 }
 function reset(){cancelAnimationFrame(typing);anchor();clearTimeout(timer);generation++;wrap.classList.remove('show-tooltip');tooltip.textContent='Copy email';status.textContent='';}
 button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;pointer={x:event.clientX,y:event.clientY};position();show('Copy email');}});
 button.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'){hovered=false;reset();if(focused)show('Copy email');}});
 button.addEventListener('pointerdown',event=>{touch=event.pointerType==='touch'||event.pointerType==='pen';if(touch)anchor();});
 button.addEventListener('keydown',()=>{touch=false;anchor();});
 button.addEventListener('focus',()=>{focused=true;show('Copy email');});
 button.addEventListener('blur',()=>{focused=false;reset();});
 button.addEventListener('click',async()=>{
  if(busy)return;
  busy=true;clearTimeout(timer);const request=++generation;
  try{
   if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
   await navigator.clipboard.writeText('1978860656@qq.com');
   if(request===generation){show('Copied!');status.textContent='Email address copied.';}
  }catch(error){
   if(request===generation){show('Could not copy. Please try again.');status.textContent='Could not copy email. Please try again.';}
  }finally{
   busy=false;
   if(request===generation&&(touch||(!hovered&&!focused)))timer=setTimeout(reset,3000);
  }
 });
})();
