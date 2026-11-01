(()=>{const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const hero=document.querySelector('.orchard-hero'),particleCanvas=document.querySelector('.orchard-hero-particles');
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
 hero.querySelectorAll('img').forEach(img=>{if(!img.complete||!img.naturalWidth)return;const r=img.getBoundingClientRect(),clip=img.parentElement.getBoundingClientRect();ctx.save();ctx.beginPath();ctx.rect(clip.left-rect.left,clip.top-rect.top,clip.width,clip.height);ctx.clip();ctx.drawImage(img,r.left-rect.left,r.top-rect.top,r.width,r.height);ctx.restore();});
 const walker=document.createTreeWalker(hero.querySelector('.orchard-hero-text'),NodeFilter.SHOW_TEXT);let node;
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
new MutationObserver(()=>{sampleWidth=0;queueDissolve();}).observe(hero.querySelector('.orchard-hero-text'),{subtree:true,childList:true,characterData:true});queueDissolve();

})();

(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const hero=document.querySelector('.orchard-hero');
 if(!reduced.matches)hero.classList.add('orchard-enter');
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
 }),{threshold:.06});
 document.querySelectorAll('.chapter').forEach(section=>{
  if(!reduced.matches)section.classList.add('orchard-reveal');
  observer.observe(section);
 });
 // Re-sample after entrance transforms settle, so dots match the final layout.
 hero.addEventListener('animationend',()=>dispatchEvent(new Event('resize')));
})();
