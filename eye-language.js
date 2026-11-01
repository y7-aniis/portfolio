(()=>{
 const eye=document.querySelector('.eye-language');
 const sync=()=>eye.classList.toggle('is-chinese',document.documentElement.lang==='zh-CN');
 new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 sync();
})();
