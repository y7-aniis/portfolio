function setLanguage(lang){document.documentElement.lang=lang==='zh'?'zh-CN':'en';localStorage.setItem('portfolioLanguage',lang);document.querySelectorAll('header nav a').forEach((e,i)=>e.textContent=(lang==='zh'?['作品','关于','联系']:['WORK','ABOUT','CONTACT'])[i]);document.querySelectorAll('[data-zh]').forEach(e=>e.textContent=e.dataset[lang]);document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));}document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));setLanguage(localStorage.getItem('portfolioLanguage')==='zh'?'zh':'en');

const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');const challenge=document.querySelector('.wego-challenge');const barriers=[...document.querySelectorAll('.barrier')];const question=document.querySelector('.wego-question');let scrollQueued=false;
function updateChallenge(){scrollQueued=false;const rect=document.querySelector('.participation-path').getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight*.85-rect.top)/(Math.min(rect.height,innerHeight)*.8)));challenge.style.setProperty('--path-progress',motionPreference.matches?1:progress);barriers.forEach((b,i)=>b.classList.toggle('shown',motionPreference.matches||progress>i*.22));if(question.getBoundingClientRect().top<innerHeight*.88)question.classList.add('shown');}
if(!motionPreference.matches)challenge.classList.add('motion-ready');function requestChallenge(){if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateChallenge)}}addEventListener('scroll',requestChallenge,{passive:true});addEventListener('resize',requestChallenge);motionPreference.addEventListener('change',()=>{challenge.classList.toggle('motion-ready',!motionPreference.matches);requestChallenge()});requestChallenge();

const direction=document.querySelector('.wego-direction');
const directionSteps=[...direction.querySelectorAll('.direction-step')];
function updateDirection(){let stage=1;directionSteps.forEach((step,i)=>{const visible=motionPreference.matches||step.getBoundingClientRect().top<innerHeight*.82;step.classList.toggle('is-visible',visible);if(visible)stage=i+1});direction.dataset.stage=stage;}
if(!motionPreference.matches)direction.classList.add('direction-motion');
let directionQueued=false;function requestDirection(){if(directionQueued)return;directionQueued=true;requestAnimationFrame(()=>{directionQueued=false;updateDirection()})}addEventListener('scroll',requestDirection,{passive:true});addEventListener('resize',requestDirection);motionPreference.addEventListener('change',()=>{direction.classList.toggle('direction-motion',!motionPreference.matches);requestDirection()});requestDirection();

const discovery=document.querySelector('.wego-discovery');
const discoverySteps=[...discovery.querySelectorAll('.discovery-step')];
const demoButtons=[...discovery.querySelectorAll('[data-demo-step]')];
function showDiscovery(index){discovery.dataset.active=String(index);demoButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)))}
function updateDiscovery(){let index=0;discoverySteps.forEach((step,i)=>{if(step.getBoundingClientRect().top<innerHeight*.55)index=i});showDiscovery(index)}
demoButtons.forEach(b=>b.addEventListener('click',()=>showDiscovery(Number(b.dataset.demoStep))));
let discoveryQueued=false;function requestDiscovery(){if(discoveryQueued)return;discoveryQueued=true;requestAnimationFrame(()=>{discoveryQueued=false;updateDiscovery()})}addEventListener('scroll',requestDiscovery,{passive:true});addEventListener('resize',requestDiscovery);updateDiscovery();

const onboarding=document.querySelector('.wego-onboarding');let onboardStep=0;const onboardTabs=[...onboarding.querySelectorAll('[data-onboard]')];
function setOnboard(step){onboardStep=Math.max(0,Math.min(2,step));onboardTabs.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===onboardStep)));onboarding.querySelectorAll('.onboard-panel').forEach((p,i)=>p.hidden=i!==onboardStep);onboarding.querySelectorAll('.onboarding-note').forEach((p,i)=>p.hidden=i!==onboardStep);onboarding.querySelector('.onboarding-status').textContent=''}
onboardTabs.forEach(b=>b.addEventListener('click',()=>setOnboard(Number(b.dataset.onboard))));
onboarding.querySelectorAll('.onboard-back').forEach(b=>b.addEventListener('click',()=>setOnboard(onboardStep-1)));
function nextOnboard(){if(onboardStep<2)setOnboard(onboardStep+1);else document.querySelector('#discovery').scrollIntoView({behavior:motionPreference.matches?'instant':'smooth'})}
onboarding.querySelectorAll('.onboard-next,.onboard-skip').forEach(b=>b.addEventListener('click',nextOnboard));
onboarding.querySelector('.sample-email').addEventListener('click',e=>e.currentTarget.style.outline='2px solid #111');
onboarding.querySelectorAll('.interest-options button').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'))));
onboarding.querySelectorAll('.calendar-options button').forEach(b=>b.addEventListener('click',()=>{onboarding.querySelectorAll('.calendar-options button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));onboarding.querySelector('.onboarding-status').textContent=document.documentElement.lang==='zh-CN'?'已选中演示选项，未连接真实日历。':'Option selected for this demo. No calendar is connected.'}));

setOnboard(0);

// Phone-framed walkthrough. All sending is confined to this local prototype.
(()=>{
 const film=document.querySelector('.buddy-film');if(!film)return;
 const $=s=>film.querySelector(s), node=id=>$(`[data-node-id="${id}"]`);
 const scenes=[...film.querySelectorAll('.film-scene')],steps=[...film.querySelectorAll('.film-steps li')];
 const touch=$('.film-touch'),success=$('.film-success'),status=$('.film-status'),canvas=$('.film-canvas'),glass=$('.film-glass');
 const resize=()=>canvas.style.zoom=glass.clientWidth/390;new ResizeObserver(resize).observe(glass);resize();
 let playing=!motionPreference.matches,visible=false,elapsed=0,last=0,current=-1,phase='',manualTimer;
 const zh=()=>document.documentElement.lang==='zh-CN';
 function pause(){playing=false;touch.classList.remove('visible');}
 const labels=[['Find someone with shared interests','发现有共同兴趣的人'],['View Mia’s profile','查看 Mia 的个人资料'],['Choose an introduction prompt','选择自我介绍提示'],['Swipe to send','向右滑动发送'],['Message sent · Continue in Messages','发送成功 · 进入消息界面']];
 function show(scene,step=scene){if(scene!==current){scenes.forEach((s,i)=>s.hidden=i!==scene);current=scene;}steps.forEach((s,i)=>s.classList.toggle('current',i===step));status.textContent=labels[step][zh()?1:0];}
 const box=node('267:1307');box.replaceChildren();const input=document.createElement('textarea');input.setAttribute('aria-label','Your introduction');box.append(input);
 const promptText={
 'Going alone':'Hi! I’m going to this event alone. Is anyone else looking for someone to go with?',
 'Same faculty':'Hi! I’d love to meet someone from the same faculty. What are you studying?',
 'New to melbourne':'Hi! I’m new to Melbourne and would love to meet people and explore events together.',
 'Same interests':'Hi! It looks like we have similar interests. What activities do you usually enjoy?',
 'Live nearby':'Hi! I live nearby. Would anyone like to travel to the event together?'
 };
 const chips=[...node('267:1306').querySelectorAll('button')];
 const selectedColors=['#8b9767','#d4a1be','#a3b2cb','#d4a1be','#d5bd61'];
 chips.forEach(b=>b.dataset.originalBackground=b.style.background);
 function choose(label){input.value=promptText[label]||'';chips.forEach((b,i)=>{const active=b.textContent.trim()===label;b.setAttribute('aria-pressed',String(active));b.style.background=active?selectedColors[i]:b.dataset.originalBackground;b.style.transform=active?'translateY(4px)':'';b.style.boxShadow=active?'inset 0 3px 4px #0005':'0 3px 3px #0002';b.querySelector('p').style.color=active?'white':'black';});}
 chips.forEach(b=>b.addEventListener('click',()=>{pause();choose(b.textContent.trim())}));input.addEventListener('input',pause);
 const slider=document.createElement('div');slider.className='film-swipe';slider.innerHTML='<label for="buddy-swipe">Swipe and Let’s go</label><span class="swipe-knob" aria-hidden="true">»</span><input id="buddy-swipe" type="range" min="0" max="100" value="0" aria-label="Swipe right to send introduction">';node('267:1292').replaceWith(slider);
 const range=slider.querySelector('input'),knob=slider.querySelector('.swipe-knob');
 function setSwipe(v){range.value=v;knob.style.transform=`translateX(${v*2.71}px)`;}
 function updateChat(){const chat=node('587:2633');const texts=[...chat.querySelectorAll('p')];const preview=texts.find(p=>p.dataset.sentPreview||p.textContent.trim()==='[photo]');if(preview){preview.dataset.sentPreview='true';preview.textContent=input.value;preview.style.cssText+=';width:265px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';}const name=texts.find(p=>p.textContent.trim()==='Mia Li');if(name)name.textContent='Mia';}
 function sent(manual=false){updateChat();success.textContent=zh()?'发送成功':'Message sent';success.hidden=false;if(manual){clearTimeout(manualTimer);manualTimer=setTimeout(()=>{success.hidden=true;show(3,4);setSwipe(0);},850);}}
 range.addEventListener('pointerdown',pause);range.addEventListener('keydown',pause);
 range.addEventListener('input',()=>{if(!input.value.trim()){setSwipe(0);status.textContent=zh()?'请先选择提示或写一段介绍。':'Choose a prompt or write an introduction first.';return;}setSwipe(Number(range.value));if(Number(range.value)>=95){range.disabled=true;sent();manualTimer=setTimeout(()=>{success.hidden=true;show(3,4);range.disabled=false;setSwipe(0);},850);}});
 range.addEventListener('change',()=>{if(Number(range.value)<95)setSwipe(0)});
 function openProfile(){pause();success.hidden=true;show(1,1);}
 const mia=node('587:2621');mia.setAttribute('aria-label','View Mia profile');mia.addEventListener('click',openProfile);
 [node('587:2622'),node('267:340'),node('587:2624')].filter(Boolean).forEach(b=>{b.disabled=true;b.setAttribute('aria-label','Profile preview');});
 const send=node('587:2615');send.setAttribute('role','button');send.tabIndex=0;send.setAttribute('aria-label','View Mia profile');send.addEventListener('click',openProfile);send.addEventListener('keydown',e=>{if(e.key==='Enter')openProfile()});
 $('.profile-connect').addEventListener('click',()=>{pause();show(2,2)});$('.profile-back').addEventListener('click',()=>{pause();show(0,0)});
 function reset(){clearTimeout(manualTimer);elapsed=0;phase='';input.value='';choose('');success.hidden=true;range.disabled=false;setSwipe(0);show(0,0);$('.film-progress span').style.width='0%';}
 $('.film-try').addEventListener('click',()=>{reset();pause();status.textContent=zh()?'点击 Mia 的卡片开始。':'Select Mia’s card to begin.';});
 function cursor(x,y){touch.style.left=x+'px';touch.style.top=y+'px';touch.classList.add('visible');}
 function tick(now){const dt=last?Math.min(now-last,100):0;last=now;if(playing&&visible&&!document.hidden){elapsed+=dt;if(elapsed>=23000)reset();const t=elapsed/1000;$('.film-progress span').style.width=(t/23*100)+'%';
 let next=t<3?'list':t<7?'profile':t<9?'intro':t<11?'alone':t<15?'interests':t<17?'swipe':t<18?'sent':'chat';
 if(phase!==next){phase=next;success.hidden=true;if(next==='list')show(0,0);if(next==='profile')show(1,1);if(next==='intro')show(2,2);if(next==='alone')choose('Going alone');if(next==='interests')choose('Same interests');if(next==='swipe')show(2,3);if(next==='sent')sent();if(next==='chat')show(3,4);}
 touch.classList.remove('visible');if(t>1.7&&t<3)cursor(102,268);else if(t>5.5&&t<7)cursor(195,776);else if(next==='alone')cursor(110,200);else if(next==='interests'&&t<12)cursor(116,344);else if(next==='swipe'){const v=Math.min(100,(t-15)/1.6*100);setSwipe(v);cursor(57+v*2.71,778);}
 }requestAnimationFrame(tick);}
 new IntersectionObserver(entries=>{const entered=entries[0].isIntersecting;if(entered&&!visible){reset();playing=!motionPreference.matches;}visible=entered;},{threshold:.2}).observe(film);
 motionPreference.addEventListener('change',()=>{if(motionPreference.matches)pause()});

 reset();requestAnimationFrame(tick);
})();

(()=>{const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const hero=document.querySelector('.wego-hero'),particleCanvas=document.querySelector('.wego-hero-particles');
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
 const walker=document.createTreeWalker(hero.querySelector('.wego-hero-text'),NodeFilter.SHOW_TEXT);let node;
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
new MutationObserver(()=>{sampleWidth=0;queueDissolve();}).observe(hero.querySelector('.wego-hero-text'),{subtree:true,childList:true,characterData:true});queueDissolve();

})();
