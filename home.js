const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const work=document.querySelector('.work'),pin=document.querySelector('.work-pin'),gallery=document.querySelector('.gallery'),viewport=document.querySelector('.gallery-window');
let travel=0,targetX=0,currentX=0;
function measure(){travel=Math.max(0,gallery.scrollWidth-viewport.clientWidth);work.style.height=reduce?'auto':`${pin.offsetHeight+travel+180}px`;}
addEventListener('resize',measure);document.fonts.ready.then(measure);measure();
viewport.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;e.preventDefault();const d=e.key==='ArrowRight'?1:-1;if(reduce)viewport.scrollBy({left:d*300});else scrollBy({top:d*320,behavior:'smooth'});});
for(const a of document.querySelectorAll('[data-project]'))a.addEventListener('click',()=>{sessionStorage.setItem('portfolioScroll',String(scrollY));sessionStorage.setItem('restorePortfolio','1');});
function restore(){if(sessionStorage.getItem('restorePortfolio')==='1'){sessionStorage.removeItem('restorePortfolio');const y=Number(sessionStorage.getItem('portfolioScroll')||0);requestAnimationFrame(()=>{measure();window.scrollTo({top:y,behavior:'instant'});currentX=Math.max(0,Math.min(travel,y-work.offsetTop));});}}
addEventListener('pageshow',restore);restore();
for(const b of document.querySelectorAll('[data-lang]'))b.onclick=()=>{document.documentElement.lang=b.dataset.lang;document.querySelectorAll('[data-lang]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('[data-en]').forEach(x=>x.textContent=x.dataset[b.dataset.lang]);};
// Source image stays intact; a clipped pupil layer provides local movement.
const canvas=document.querySelector('#eyes'),ctx=canvas.getContext('2d'),eye=new Image();eye.src='assets/home-v3/33826.png';
let W=0,H=0,mx=0,my=0,px=0,py=0,nextBlink=performance.now()+5000,blinkStart=-10000;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function resizeEyes(){W=canvas.clientWidth;H=canvas.clientHeight;canvas.width=W*devicePixelRatio;canvas.height=H*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}
function geometry(){const s=Math.min(W*.51,730);return {s,y:H*.16,x:W/2};}
eye.onload=resizeEyes;addEventListener('resize',resizeEyes);resizeEyes();
addEventListener('pointermove',e=>{mx=clamp((e.clientX-innerWidth/2)/(innerWidth/2),-1,1);my=clamp((e.clientY-innerHeight/2)/(innerHeight/2),-1,1);});document.addEventListener('pointerleave',()=>{mx=0;my=0;});
function drawEye(x,y,s,flip,blink){ctx.save();ctx.translate(x+(flip?s:0),y+s*.5);ctx.scale(flip?-1:1,1-blink*.96);ctx.translate(0,-s*.5);ctx.drawImage(eye,0,0,s,s);/* Pupil is clipped inside the central eye region; exterior is stationary. */ctx.save();ctx.beginPath();ctx.ellipse(s*.42,s*.45,s*.085,s*.062,0,0,Math.PI*2);ctx.clip();ctx.fillStyle='white';ctx.fillRect(s*.32,s*.37,s*.2,s*.17);ctx.drawImage(eye,(flip?-px:px)*s*.014,py*s*.01,s,s);ctx.restore();ctx.restore();}
const reveals=[...document.querySelectorAll('.project-card')].map(card=>{const c=card.querySelector('canvas'),g=c.getContext('2d');let active=false;card.addEventListener('pointerenter',()=>active=true);card.addEventListener('pointerleave',()=>active=false);card.addEventListener('focus',()=>active=true);card.addEventListener('blur',()=>active=false);return {card,c,g,v:0,get active(){return active;}};});
// Scroll choreography: readable lines, a reversible palette, and original flower layers.
const about=document.querySelector('#about'),flower=document.querySelector('.flower');
let bloom=reduce?1:0,flowerTurn=0,nearFlower=false;
const lineNodes=[];
function splitLines(){
 for(const el of document.querySelectorAll('.about-copy h2,.about-copy p')){
 const words=(el.dataset.copy||el.textContent).trim().split(/\s+/);el.dataset.copy=words.join(' ');el.replaceChildren();
 const spans=words.map(word=>{const span=document.createElement('span');span.textContent=word+' ';el.append(span);return span;});
 const groups=[];let top=-1;for(const span of spans){const y=span.offsetTop;if(y!==top){groups.push([]);top=y;}groups.at(-1).push(span.textContent);}
 el.replaceChildren();for(const group of groups){const line=document.createElement('span');line.className='reveal-line';line.textContent=group.join('');el.append(line);}
 }
 lineNodes.splice(0,lineNodes.length,...document.querySelectorAll('.reveal-line'));
}
document.fonts.ready.then(splitLines);addEventListener('resize',splitLines);splitLines();
addEventListener('pointermove',e=>{const r=flower.getBoundingClientRect();const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);nearFlower=Math.hypot(dx,dy)<r.width*.7;});
flower.addEventListener('focus',()=>nearFlower=true);flower.addEventListener('blur',()=>nearFlower=false);
let dots=[];
function sampleEyes(){const c=document.createElement('canvas');c.width=c.height=180;const g=c.getContext('2d');g.drawImage(eye,0,0,180,180);const d=g.getImageData(0,0,180,180).data;for(let y=0;y<180;y+=2)for(let x=0;x<180;x+=2){const k=(y*180+x)*4;if(d[k+3]>150&&d[k]<130)dots.push({x:x/180,y:y/180,dx:Math.sin(x*12.9+y*3.1),dy:Math.cos(y*9.2+x*1.7)});}}
eye.addEventListener('load',sampleEyes);if(eye.complete&&eye.naturalWidth)sampleEyes();
function updateFlower(){
 const box=about.getBoundingClientRect();const target=reduce?1:clamp((innerHeight*.85-box.top)/(innerHeight*.95),0,1);bloom+=(target-bloom)*.075;const eased=bloom*bloom*(3-2*bloom);flower.style.setProperty('--bloom',eased);flower.dataset.bloom=eased.toFixed(3);
 flowerTurn+=((nearFlower&&!reduce?9:0)-flowerTurn)*.025;flower.style.rotate=flowerTurn+'deg';
 const dark=reduce?1:clamp((innerHeight-box.top)/(innerHeight*.65),0,1);const bg=Math.round(255-250*dark),fg=Math.round(17+238*dark);about.style.backgroundColor=`rgb(${bg},${bg},${bg})`;about.style.color=`rgb(${fg},${fg},${fg})`;flower.style.opacity=dark;
 // Match the departing sticky surface so the white-to-black change fills the viewport.
 const pinDark=reduce?0:dark;pin.style.backgroundColor=`rgb(${Math.round(255-250*pinDark)},${Math.round(255-250*pinDark)},${Math.round(255-250*pinDark)})`;pin.style.color=`rgb(${Math.round(17+238*pinDark)},${Math.round(17+238*pinDark)},${Math.round(17+238*pinDark)})`;
 for(const line of lineNodes){const y=line.getBoundingClientRect().top;const reveal=reduce?1:clamp((innerHeight*.9-y)/150,0,1);line.style.opacity=reveal;line.style.transform=`translateY(${(1-reveal)*18}px)`;}
}
function frame(t){targetX=clamp(scrollY-work.offsetTop,0,travel);currentX+=(targetX-currentX)*.12;if(!reduce)gallery.style.transform=`translate3d(${-currentX}px,0,0)`;document.querySelector('.progress span').style.width=`${20+80*(travel?currentX/travel:0)}%`;document.querySelector('.gallery-count').textContent=`0${Math.min(5,1+Math.round((travel?currentX/travel:0)*4))} — 05`;
px+=(mx-px)*.045;py+=(my-py)*.045;ctx.clearRect(0,0,W,H);
if(eye.complete&&eye.naturalWidth){const {s,y,x}=geometry();if(t>nextBlink){blinkStart=t;nextBlink=t+5000+Math.random()*3000;}const bt=(t-blinkStart)/650;const blink=!reduce&&bt>=0&&bt<1?Math.sin(bt*Math.PI)**2:0;
const dissolve=reduce?0:clamp((scrollY-70)/470,0,1);
ctx.globalAlpha=1-clamp(dissolve*3,0,1);drawEye(x-s,y,s,true,blink);drawEye(x,y,s,false,blink);ctx.globalAlpha=1;
if(dissolve>0&&dissolve<1){ctx.fillStyle='#111';ctx.globalAlpha=Math.min(1,dissolve*6)*(1-dissolve);for(let side=0;side<2;side++)for(const p of dots){const sx=side?x+p.x*s:x-p.x*s;ctx.beginPath();ctx.arc(sx+p.dx*dissolve*240,y+p.y*s+p.dy*dissolve*170+dissolve*80,Math.max(.6,s/300)*(1-dissolve*.55),0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}
const heading=document.querySelector('.work-heading');heading.style.opacity=reduce?1:clamp((scrollY-220)/300,0,1);
}
updateFlower();
for(const r of reveals){r.v+=((r.active?1:0)-r.v)*.085;const w=r.c.clientWidth,h=r.c.clientHeight;if(r.c.width!==w||r.c.height!==h){r.c.width=w;r.c.height=h;}r.g.clearRect(0,0,w,h);if(!reduce){r.g.fillStyle=`rgba(255,255,255,${.24*(1-r.v)})`;r.g.fillRect(0,0,w,h);r.g.fillStyle='#111';for(let y=4;y<h;y+=8)for(let x=4;x<w;x+=8){const threshold=(Math.sin(x*2.4+y*4.1)+1)/2;const radius=.7*clamp(1-r.v*1.7+threshold*.3,0,1);if(radius<.05)continue;r.g.beginPath();r.g.arc(x+r.v*threshold*12,y-r.v*threshold*16,radius,0,7);r.g.fill();}}}
requestAnimationFrame(frame);}
requestAnimationFrame(frame);
// Type the work-section eyebrow once when it enters the viewport.
const workEyebrow=document.querySelector('.work-heading p');
const eyebrowText=workEyebrow.textContent;
if(!reduce){
 workEyebrow.setAttribute('aria-label',eyebrowText);
 const copy=document.createElement('span');copy.className='typing-copy';copy.setAttribute('aria-hidden','true');
 const cursor=document.createElement('span');cursor.className='typing-cursor';cursor.setAttribute('aria-hidden','true');
 workEyebrow.replaceChildren(copy,cursor);
 let started=false;
 const typingObserver=new IntersectionObserver(entries=>{
  if(started||!entries.some(e=>e.isIntersecting))return;
  started=true;typingObserver.disconnect();let n=0;
  function typeNext(){copy.textContent=eyebrowText.slice(0,++n);if(n<eyebrowText.length)setTimeout(typeNext,65);else workEyebrow.classList.add('typing-done');}
  typeNext();
 },{threshold:1,rootMargin:'0px 0px -8% 0px'});
 typingObserver.observe(workEyebrow);
}

document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>localStorage.setItem('portfolioLanguage',b.dataset.lang)));const savedLanguage=localStorage.getItem('portfolioLanguage');if(savedLanguage)document.querySelector(`[data-lang="${savedLanguage}"]`)?.click();
