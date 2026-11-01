const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const comparisonNotes = [
  ['Original campaign hierarchy.', 'DM status is more prominent and Add Campaign is visually distinct.'],
  ['Radio buttons and quantity controls appear together.', 'Redundant radio buttons are removed; quantities determine reward recipients.']
];
document.querySelectorAll('.comparison').forEach((comparison,index) => {
  index=Number(comparison.dataset.comparison);
  const figures = [...comparison.querySelectorAll('figure')];
  const controls = document.createElement('div'); controls.className = 'comparison-controls'; controls.setAttribute('role','group'); controls.setAttribute('aria-label',index ? 'Reward Players comparison' : 'Campaign List comparison');
  const stage = document.createElement('div'); stage.className = 'comparison-stage';
  figures.forEach(fig => stage.append(fig));
  const note = document.createElement('p'); note.className = 'comparison-note'; note.setAttribute('aria-live','polite');
  const buttons = ['Before','After'].map((name,i)=>{
    const button = document.createElement('button'); button.type = 'button'; button.textContent = name;
    button.addEventListener('click',()=>show(i,true)); controls.append(button); return button;
  });
  function show(active,flash) {
    figures.forEach((fig,i)=> {fig.classList.toggle('comparison-visible',i===active); fig.setAttribute('aria-hidden',String(i!==active));});
    buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===active)));
    note.textContent = comparisonNotes[index][active];
    stage.classList.remove('change-highlight');
    if(active && flash && !reducedMotion.matches) {void stage.offsetWidth; stage.classList.add('change-highlight');}
  }
  comparison.classList.add('comparison-interactive'); comparison.append(controls,stage,note); show(0,false);
});


const roleCopy=[['Understand spells quickly and create characters easily.','Visual spell lookup + character templates'],['Access party information without disrupting gameplay.','Party Manager + character sheets'],['Greater flexibility for custom characters and spells.','Custom content support (future scope)']];
document.querySelectorAll('[data-role]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-role]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const copy=roleCopy[Number(button.dataset.role)]; document.querySelector('#need').textContent=copy[0];document.querySelector('#opportunity').textContent=copy[1];
 if(!reducedMotion.matches)document.querySelector('.relationship').animate([{opacity:.4,transform:'translateX(-6px)'},{opacity:1,transform:'none'}],{duration:300,easing:'ease-out'});
}));
const demos=[
 {start:0,names:['Spellbook','Search','Spell details'],links:[[0,1,76,10,16,12,'Search spells'],[0,2,7,43,85,11,'Preview spell details'],[1,2,5,17,90,12,'Open Fireball details']]},
 {start:1,names:['Character Sheet','Party Manager','Reward Players'],links:[[1,0,10,39,19,20,'View character sheet'],[1,2,12,70,35,9,'Assign rewards']]},
 {start:0,names:['Campaign List','Character Templates','Join Campaign'],links:[[0,1,14,25,72,12,'Explore character templates'],[0,2,14,59,72,17,'Explore joining a campaign']]}
];
document.querySelectorAll('[data-demo]').forEach((demo,index)=>{
 index=Number(demo.dataset.demo);
 const config=demos[index],screens=[...demo.querySelectorAll('.demo-screen')],controls=document.querySelector(`[data-controls="${index}"]`);let current=config.start;let history=[];
 demo.classList.add('enhanced');
 const buttons=config.names.map((name,i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.addEventListener('click',()=>show(i));controls.append(b);return b;});
 const back=document.createElement('button');back.type='button';back.className='back';back.textContent='← Back';back.addEventListener('click',()=>{if(history.length)show(history.pop(),false)});controls.append(back);
 const status=document.createElement('span');status.className='demo-status';status.setAttribute('aria-live','polite');controls.append(status);
 function show(next,record=true){if(record&&next!==current)history.push(current);current=next;screens.forEach((s,i)=>s.hidden=i!==next);buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===next)));back.disabled=!history.length;status.textContent=`${config.names[next]} · Select a screen or use the highlighted controls.`;if(!reducedMotion.matches)screens[next].animate([{opacity:0,transform:'translateX(12px)'},{opacity:1,transform:'translateX(0)'}],{duration:300,easing:'ease-out'});}
 config.links.forEach(([from,to,x,y,w,h,label])=>{const b=document.createElement('button');b.type='button';b.className='hotspot';b.setAttribute('aria-label',label);b.title=label;Object.assign(b.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});b.addEventListener('click',()=>show(to));screens[from].querySelector('.phone').append(b);});
 if(index===0){
 const play=document.querySelector('.play-sequence');let timer=null,step=0;
 function stop(){clearInterval(timer);timer=null;play.textContent='Replay walkthrough';play.setAttribute('aria-pressed','false');}
 play.addEventListener('click',()=>{if(timer){stop();return;}step=0;history=[];show(0,false);play.textContent='Pause walkthrough';play.setAttribute('aria-pressed','true');timer=setInterval(()=>{step++;show(step);if(step===2)stop();},2200);});
 controls.addEventListener('click',stop);demo.addEventListener('click',stop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 }
 show(config.start,false);
});
const navLinks=[...document.querySelectorAll('.chapter-nav a')];
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}}),{rootMargin:'-10% 0px -65% 0px'});
document.querySelectorAll('section[id]').forEach(s=>observer.observe(s));
const sceneObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');sceneObserver.unobserve(e.target)}}),{threshold:.4});sceneObserver.observe(document.querySelector('.story-track'));

const focusPositions=[['22%','14%'],['35%','25%'],['60%','26%']];
document.querySelectorAll('[data-focus]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-focus]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const [top,height]=focusPositions[Number(button.dataset.focus)],frame=document.querySelector('.focus-window');frame.style.top=top;frame.style.height=height;
}));

// The question emerges once it enters the reading area.
const question=document.querySelector('.question');
if(!reducedMotion.matches){question.classList.add('reveal-ready');const qo=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){question.classList.add('is-visible');qo.disconnect();}},{threshold:.4});qo.observe(question);}
// Sample the visible hero content into dots, then scatter them with scroll.
const hero=document.querySelector('.hero'),particleCanvas=document.querySelector('.hero-particles');
const particleCtx=particleCanvas.getContext('2d');let pending=false,particles=[],sampleWidth=0,sampleHeight=0;
const clamp=n=>Math.max(0,Math.min(1,n));
function sampleHero(){
 const rect=hero.getBoundingClientRect(),w=Math.round(rect.width),h=Math.round(rect.height);if(!w||!h)return;
 sampleWidth=w;sampleHeight=h;particleCanvas.width=w;particleCanvas.height=h;
 const wrapper=particleCanvas.parentElement.getBoundingClientRect();
 particleCanvas.style.left=(rect.left-wrapper.left)+'px';
 particleCanvas.style.top=(rect.top-wrapper.top)+'px';
 particleCanvas.style.width=w+'px';particleCanvas.style.height=h+'px';

 const source=document.createElement('canvas');source.width=w;source.height=h;const ctx=source.getContext('2d');
 hero.querySelectorAll('img').forEach(img=>{if(!img.complete||!img.naturalWidth)return;const r=img.getBoundingClientRect(),clip=img.parentElement.getBoundingClientRect();ctx.save();ctx.beginPath();ctx.rect(clip.left-rect.left,clip.top-rect.top,clip.width,clip.height);ctx.clip();ctx.drawImage(img,r.left-rect.left,r.top-rect.top,r.width,r.height);ctx.restore();});
 const walker=document.createTreeWalker(hero.querySelector('.hero-text'),NodeFilter.SHOW_TEXT);let node;
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
Promise.all([...hero.querySelectorAll('img')].map(img=>img.decode().catch(()=>{}))).then(()=>document.fonts.ready).then(()=>{sampleHero();queueDissolve()});queueDissolve();

// Language changes can reflow text without changing the hero dimensions.
new MutationObserver(()=>{sampleWidth=0;queueDissolve();}).observe(hero.querySelector('.hero-text'),{subtree:true,childList:true,characterData:true});
