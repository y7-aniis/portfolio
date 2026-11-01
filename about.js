(()=>{
 const buttons=[...document.querySelectorAll('[data-lang]')];
 function language(lang){document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.querySelectorAll('[data-en][data-zh]').forEach(el=>el.textContent=el.dataset[lang]);buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));document.querySelectorAll('header nav a').forEach((a,i)=>a.textContent=(lang==='zh'?['作品','关于','联系']:['WORK','ABOUT','CONTACT'])[i]);try{localStorage.setItem('portfolioLanguage',lang);}catch(e){}}
 let saved='en';try{saved=localStorage.getItem('portfolioLanguage')==='zh'?'zh':'en';}catch(e){}language(saved);buttons.forEach(b=>b.addEventListener('click',()=>language(b.dataset.lang)));
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.06});document.querySelectorAll('.photo-group').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}
})();

(()=>{
 const card=document.querySelector('.card-flip');if(!card)return;
 let pinned=false,hover=false;
 const render=()=>{const flipped=pinned||hover;card.classList.toggle('is-flipped',flipped);card.setAttribute('aria-pressed',String(flipped));};
 card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;render();}});
 card.addEventListener('pointerleave',()=>{hover=false;render();});
 card.addEventListener('click',()=>{pinned=!pinned;render();});
 card.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=false;hover=false;render();}});
})();
