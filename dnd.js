// Retain the gallery position when returning from the case study.
for(const link of document.querySelectorAll('.return-home'))link.addEventListener('click',()=>{if(sessionStorage.getItem('portfolioScroll'))sessionStorage.setItem('restorePortfolio','1');});
const translations={'Design Idea':'设计理念','Introduction':'项目介绍','01 / THE CHALLENGE':'01 / 设计挑战','02 / USER RESEARCH':'02 / 用户研究','03 / DEFINED OPPORTUNITIES':'03 / 设计机会','04 / DESIGN SOLUTIONS':'04 / 设计方案','05 / TESTING & ITERATION':'05 / 测试与迭代','06 / REFLECTION':'06 / 反思','What we achieved':'项目成果','What I learned':'我的收获'};
for(const el of document.querySelectorAll('h2,h3,.chapter-label'))if(translations[el.textContent]){el.dataset.en=el.textContent;el.dataset.zh=translations[el.textContent];}
for(const button of document.querySelectorAll('[data-lang]'))button.addEventListener('click',()=>{const lang=button.dataset.lang;document.documentElement.lang=lang;document.querySelectorAll('[data-en]').forEach(el=>el.textContent=el.dataset[lang]);document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b===button));});

// Progressive enhancement: the original case study stays readable without JS.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('revealed');
  revealObserver.unobserve(entry.target);
}), {threshold: .15});
for (const section of document.querySelectorAll('.case-section,.case-hero')) {
  const elements = [...section.querySelectorAll('h1,h2,h3,.chapter-label,.hero-copy p,.storyboard,.research-grid,.opportunities,.solution-board,.solution-caption,.metrics,.chart,.iteration,.achievement,.learnings,.hero-phones')];
  elements.filter(el => !elements.some(parent => parent !== el && parent.contains(el))).forEach((el, i) => {
    el.classList.add('reveal-item');
    el.style.setProperty('--reveal-delay', `${i % 3 * 100}ms`);
    revealObserver.observe(el);
  });
}

const roles = document.querySelector('.opportunities');
const roleCards = [...roles.children];
let pinnedRole = null;
function highlightRole(index) {
  roleCards.forEach((card, i) => {
    card.classList.toggle('role-muted', index !== null && i !== index);
    card.classList.toggle('role-selected', i === index);
    card.querySelector('button').setAttribute('aria-pressed', String(i === pinnedRole));
  });
}
roleCards.forEach((card, index) => {
  const heading = card.querySelector('h3');
  const button = document.createElement('button');
  button.className = 'role-control';
  button.type = 'button';
  while (heading.firstChild) button.append(heading.firstChild);
  heading.append(button);
  button.setAttribute('aria-pressed', 'false');
  card.addEventListener('pointerenter', e => {if (e.pointerType === 'mouse') highlightRole(index);});
  button.addEventListener('focus', () => highlightRole(index));
  button.addEventListener('click', () => {pinnedRole = pinnedRole === index ? null : index; highlightRole(pinnedRole);});
});
roles.addEventListener('pointerleave', () => highlightRole(pinnedRole));
roles.addEventListener('focusout', e => {if (!roles.contains(e.relatedTarget)) highlightRole(pinnedRole);});
roles.addEventListener('keydown', e => {if (e.key === 'Escape') {pinnedRole = null; highlightRole(null);}});

const explorerConfigs = [
  {hint:'Explore Spellbook or Search independently to view spell details.', links:[[0,2,38,49,'Open graphical spell details'],[1,2,25,23,'Open Fireball details']]},
  {hint:'Start with Party Manager: view a character or assign rewards.', links:[[1,0,10,39,'View character sheet'],[1,2,13,73,'Assign player rewards']]},
  {hint:'Explore joining a campaign or choosing a character template as separate tasks.', links:[[0,2,20,63,'Explore joining a campaign'],[0,1,20,23,'Explore character templates']]}
];
document.querySelectorAll('.solution-board').forEach((board, group) => {
  const config = explorerConfigs[group];
  const columns = [...board.querySelectorAll('.screen-column')];
  const toolbar = document.createElement('div');
  toolbar.className = 'explorer-toolbar';
  const hint = document.createElement('span'); hint.textContent = config.hint;
  const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = 'Reset';
  const status = document.createElement('span'); status.className = 'interaction-status'; status.setAttribute('aria-live','polite');
  toolbar.append(hint,reset,status); board.after(toolbar);
  function select(index) {
    columns.forEach((col,i) => {
      col.classList.toggle('screen-active',i === index);
      col.querySelector('.screen-label').setAttribute('aria-pressed',String(i === index));
    });
    if(index !== null) {
      const phone = columns[index].querySelector('.phone');
      if(!reducedMotion.matches) phone.animate([{opacity:.35,transform:'translateX(8px)'},{opacity:1,transform:'translateX(0)'}],{duration:300,easing:'ease-out'});
      status.textContent = `${columns[index].querySelector('.screen-label').textContent} selected`;
    } else status.textContent = 'All screens available';
  }
  columns.forEach(col => {
    const old = col.querySelector('.screen-label');
    const button = document.createElement('button'); button.className = 'screen-label'; button.type = 'button'; button.textContent = old.textContent;
    button.setAttribute('aria-pressed','false'); old.replaceWith(button);
    button.addEventListener('click',()=>select(columns.indexOf(col)));
  });
  config.links.forEach(([from,to,x,y,label]) => {
    const hotspot = document.createElement('button'); hotspot.type = 'button'; hotspot.className = 'screen-hotspot'; hotspot.setAttribute('aria-label',label); hotspot.title = label;
    hotspot.style.left = `${x}%`; hotspot.style.top = `${y}%`;
    hotspot.addEventListener('click',()=>select(to)); columns[from].querySelector('.phone').append(hotspot);
  });
  reset.addEventListener('click',()=>select(null));
});

const comparisonNotes = [
  ['Original campaign hierarchy.', 'DM status is more prominent and Add Campaign is visually distinct.'],
  ['Radio buttons and quantity controls appear together.', 'Redundant radio buttons are removed; quantities determine reward recipients.']
];
document.querySelectorAll('.comparison').forEach((comparison,index) => {
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

// Only the existing hero has a phone composition; no new showcase is added.
const mockupGroup = document.querySelector('.hero-phones');
let parallaxFrame;
function updateMockups() {
  parallaxFrame = null;
  const rect = mockupGroup.getBoundingClientRect();
  const enabled = !reducedMotion.matches && innerWidth > 650;
  const progress = Math.max(-1,Math.min(1,(innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
  mockupGroup.querySelectorAll('.phone').forEach((phone,i)=>phone.style.transform=`translateY(${enabled ? progress * (i===1 ? -8 : i===0 ? -20 : -14) : 0}px)`);
}
function scheduleMockups(){if(!parallaxFrame) parallaxFrame=requestAnimationFrame(updateMockups);}
addEventListener('scroll',scheduleMockups,{passive:true}); addEventListener('resize',scheduleMockups); reducedMotion.addEventListener('change',scheduleMockups); scheduleMockups();
