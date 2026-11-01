(()=>{const buttons=[...document.querySelectorAll('[data-lang]')];function setLanguage(lang){document.documentElement.lang=lang==='zh'?'zh-CN':'en';localStorage.setItem('portfolioLanguage',lang);document.querySelectorAll('[data-en][data-zh]').forEach(el=>el.textContent=el.dataset[lang]);document.querySelectorAll('header nav a').forEach((a,i)=>a.textContent=(lang==='zh'?['作品','关于','联系']:['WORK','ABOUT','CONTACT'])[i]);buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));}buttons.forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));setLanguage(localStorage.getItem('portfolioLanguage')==='zh'?'zh':'en');})();


(()=>{
 const section=document.querySelector('.heatguard-challenge');
 if(!section||!('IntersectionObserver' in window))return;
 const elements=section.querySelectorAll('.hg-factor,.hg-design-question');
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('hg-visible');observer.unobserve(entry.target);}
  });
 },{threshold:.15});
 section.classList.add('hg-reveal-ready');
 elements.forEach(element=>observer.observe(element));
})();

(()=>{
 const section=document.querySelector('.hg-interviews');
 if(!section||!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('hg-visible');observer.unobserve(entry.target);}
  });
 },{threshold:.15});
 section.classList.add('hg-interview-motion');
 section.querySelectorAll('.hg-quote,.hg-requirement').forEach(element=>observer.observe(element));
})();

(()=>{
 const section=document.querySelector('.hg-concept');
 if(!section||!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('hg-visible');observer.unobserve(entry.target);}
  });
 },{threshold:.25});
 section.classList.add('hg-concept-motion');
 section.querySelectorAll('.hg-concept-core,.hg-concept-part').forEach(element=>observer.observe(element));
})();

(()=>{
 const story=document.querySelector('.hg-product-story');
 if(!story)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const callouts=[...story.querySelectorAll('.hg-product-callout')];
 const clamp=n=>Math.max(0,Math.min(1,n));
 const smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
 let queued=false;
 function update(){
  queued=false;
  story.classList.toggle('hg-product-scroll',!reduced.matches);
  const rect=story.getBoundingClientRect();
  const stage=story.querySelector('.hg-product-stage');
  const p=clamp((20-rect.top)/Math.max(1,rect.height-stage.offsetHeight));
  const side=smooth((p-.12)/.28),inside=smooth((p-.6)/.26);
  story.style.setProperty('--front-opacity',1-side);
  story.style.setProperty('--side-opacity',side*(1-inside));
  story.style.setProperty('--inside-opacity',inside);
  story.style.setProperty('--front-yaw',(-18*side)+'deg');
  story.style.setProperty('--side-yaw',(18*(1-side))+'deg');
  story.style.setProperty('--inside-scale',.84+.16*inside);
  callouts.forEach((el,i)=>el.classList.toggle('hg-visible',reduced.matches||p>i*.18));
 }
 function request(){if(!queued){queued=true;requestAnimationFrame(update);}}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request);
 reduced.addEventListener('change',request);update();
})();

(()=>{
 const section=document.querySelector('.hg-using');
 if(!section)return;
 const steps=[...section.querySelectorAll('.hg-app-step')];
 const screens=[...section.querySelectorAll('.hg-app-screen')];
 function select(index){
  steps.forEach((step,i)=>step.querySelector('button').setAttribute('aria-pressed',String(i===index)));
  screens.forEach((screen,i)=>{screen.classList.toggle('active',i===index);screen.setAttribute('aria-hidden',String(i!==index));});
 }
 steps.forEach((step,i)=>step.querySelector('button').addEventListener('click',()=>select(i)));
 let queued=false;
 function update(){
  queued=false;
  const target=innerHeight*.42;
  let best=0,distance=Infinity;
  steps.forEach((step,i)=>{const r=step.getBoundingClientRect();const d=Math.abs(r.top+r.height*.3-target);if(d<distance){best=i;distance=d;}});
  select(best);
 }
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});
})();

(()=>{const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const hero=document.querySelector('.heatguard-hero'),particleCanvas=document.querySelector('.heatguard-hero-particles');
const particleCtx=particleCanvas.getContext('2d');if(!particleCtx)return;let pending=false,particles=[],sampleWidth=0,sampleHeight=0;
const clamp=n=>Math.max(0,Math.min(1,n));
function sampleHero(){
 const rect=hero.getBoundingClientRect(),w=Math.round(rect.width),h=Math.round(rect.height);if(!w||!h)return;
 sampleWidth=w;sampleHeight=h;particleCanvas.width=w;particleCanvas.height=h;
 // Match the centered hero's actual box, rather than stretching to its full-width wrapper.
 const wrapper=particleCanvas.parentElement.getBoundingClientRect();
 particleCanvas.style.left=(rect.left-wrapper.left)+'px';
 particleCanvas.style.top=(rect.top-wrapper.top)+'px';
 particleCanvas.style.width=w+'px';
 particleCanvas.style.height=h+'px';
 const source=document.createElement('canvas');source.width=w;source.height=h;const ctx=source.getContext('2d');
 hero.querySelectorAll('img').forEach(img=>{if(!img.complete||!img.naturalWidth)return;const r=img.getBoundingClientRect(),clip=img.parentElement.getBoundingClientRect();ctx.save();ctx.beginPath();ctx.rect(clip.left-rect.left,clip.top-rect.top,clip.width,clip.height);ctx.clip();const scale=Math.min(r.width/img.naturalWidth,r.height/img.naturalHeight),dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;ctx.drawImage(img,r.left-rect.left+(r.width-dw)/2,r.top-rect.top+(r.height-dh)/2,dw,dh);ctx.restore();});
 const walker=document.createTreeWalker(hero.querySelector('.heatguard-content'),NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){const style=getComputedStyle(node.parentElement);ctx.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;ctx.fillStyle=style.color;ctx.textBaseline='top';
 for(let i=0;i<node.length;i++){if(!node.textContent[i].trim())continue;const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);const r=range.getBoundingClientRect();ctx.fillText(node.textContent[i],r.left-rect.left,r.top-rect.top);}}
 const data=ctx.getImageData(0,0,w,h).data;particles=[];const gap=w<600?5:6;
 for(let y=0;y<h;y+=gap)for(let x=0;x<w;x+=gap){const i=(y*w+x)*4;if(data[i+3]<70)continue;const n=Math.abs(Math.sin(x*12.9898+y*78.233)*43758.5453)%1;particles.push({x,y,r:1.2+n*1.5,dx:(n-.5)*420,dy:-65-Math.abs(Math.sin(x+y))*210,delay:n*.14});}
}
function dissolveHero(){pending=false;const rect=hero.getBoundingClientRect();if(sampleWidth!==Math.round(rect.width)||sampleHeight!==Math.round(rect.height))sampleHero();
 particleCtx.clearRect(0,0,particleCanvas.width,particleCanvas.height);
 if(reducedMotion.matches){hero.style.opacity='1';return;}
 const progress=clamp(-rect.top/(rect.height*.65));hero.style.opacity=String(1-clamp(progress/.28));
 if(progress===0||progress===1)return;
 const appear=clamp(progress/.15);for(const p of particles){const travel=clamp((progress-p.delay)/(.86-p.delay));const ease=travel*travel;particleCtx.globalAlpha=appear*(1-travel)*(1-travel);particleCtx.fillStyle='#17151a';particleCtx.beginPath();particleCtx.arc(p.x+p.dx*ease,p.y+p.dy*ease,p.r*(1-travel*.7),0,Math.PI*2);particleCtx.fill();}particleCtx.globalAlpha=1;
}
function queueDissolve(){if(!pending){pending=true;requestAnimationFrame(dissolveHero)}}
addEventListener('scroll',queueDissolve,{passive:true});addEventListener('resize',()=>{sampleWidth=0;queueDissolve()});reducedMotion.addEventListener('change',queueDissolve);
Promise.all([...hero.querySelectorAll('img')].map(img=>img.decode().catch(()=>{}))).then(()=>document.fonts.ready).then(()=>{sampleHero();queueDissolve()});
new MutationObserver(()=>{sampleWidth=0;queueDissolve();}).observe(hero.querySelector('.heatguard-content'),{subtree:true,childList:true,characterData:true});queueDissolve();

})();
