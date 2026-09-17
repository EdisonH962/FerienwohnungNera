/* Scroll controls for the geometric FASSADEN-WUNDER scene. Native scrolling is never intercepted. */
(() => {
  'use strict';
  const root=document.documentElement,hero=document.getElementById('top'),canvas=document.getElementById('siteWorld'),main=document.getElementById('main');
  const panels=Array.from(document.querySelectorAll('[data-cinema-panel]')),links=Array.from(document.querySelectorAll('[data-cinema-step]'));
  const hud=document.getElementById('cinemaHud'),meter=document.getElementById('cinemaMeter');
  if(!hero||!canvas||panels.length!==3||!window.Nera3D)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  const motion=()=>!root.classList.contains('motion-off')&&!reduced.matches&&!navigator.connection?.saveData;
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
  let renderer=null,attempted=false,ready=false,current=-1,pendingFocus=-1;
  let raf=0,resizeFrame=0,top=0,range=1,target=0,position=0,lastTime=0,lastPaint=0,clock=0;
  let pointerX=0,pointerY=0,viewX=0,viewY=0;
  const initialHash=location.hash;
  function instant(y){const old=root.style.scrollBehavior;root.style.scrollBehavior='auto';window.scrollTo({top:Math.max(0,y),behavior:'instant'});root.style.scrollBehavior=old;}
  function measure(){top=hero.getBoundingClientRect().top+scrollY;range=Math.max(1,hero.offsetHeight-innerHeight);target=clamp((scrollY-top)/range)*2;}
  function request(){if(!raf&&!document.hidden)raf=requestAnimationFrame(tick);}
  function startRenderer(){
    if(attempted||!motion())return;
    attempted=true;
    try{renderer=window.Nera3D.create(canvas);if(renderer){renderer.draw(0,0);root.classList.add('world-ready');}}
    catch{renderer=null;root.classList.remove('world-ready');}
    window.dispatchEvent(new Event('site:worldready'));
  }
  function reset(){
    panels.forEach(panel=>{panel.inert=false;panel.removeAttribute('aria-hidden');panel.classList.remove('is-near','is-current');panel.style.cssText='';});
    links.forEach(link=>link.removeAttribute('aria-current'));current=-1;
  }
  function layout(preserve=true){
    const was=ready,rect=hero.getBoundingClientRect(),inside=rect.bottom>100&&rect.top<innerHeight;
    const before=was?Math.max(0,current):Math.max(0,panels.findIndex(p=>p.getBoundingClientRect().bottom>innerHeight*.3));
    const anchor=Array.from(document.querySelectorAll('[data-scene]')).find(el=>el!==hero&&el.getBoundingClientRect().bottom>100),anchorTop=anchor?.getBoundingClientRect().top;
    ready=Boolean(renderer)&&motion()&&innerWidth>=300&&innerHeight>=460;
    root.classList.toggle('cinema-ready',ready);
    if(ready&&panels.some(p=>p.querySelector('.cinema-copy').scrollHeight>p.clientHeight+2))ready=false;
    root.classList.toggle('cinema-ready',ready);hud.hidden=!ready;
    if(!ready)reset();
    measure();
    if(preserve&&was!==ready){
      if(!inside&&anchor&&anchorTop!==undefined)instant(scrollY+anchor.getBoundingClientRect().top-anchorTop);
      else if(inside&&scrollY>40)instant(ready?top+range*before/2:scrollY+panels[before].getBoundingClientRect().top-90);
      measure();
    }
    position=target;renderer?.resize();
    if(renderer&&motion()){renderer.draw(ready?position:0,clock,viewX,viewY);root.classList.add('world-ready');}
    else root.classList.remove('world-ready');
    request();
  }
  function paintCopy(){
    if(!ready)return;
    const selected=Math.round(position);
    panels.forEach((panel,i)=>{
      const delta=position-i,opacity=1-smooth(.12,.49,Math.abs(delta));
      panel.classList.toggle('is-near',opacity>.003);
      panel.style.setProperty('--panel-opacity',opacity.toFixed(4));
      panel.style.setProperty('--copy-y',(-clamp(delta,-1,1)*34).toFixed(2)+'px');
      panel.style.setProperty('--ink-reveal',(smooth(.05,.46,Math.abs(delta))*100).toFixed(2)+'%');
      if(selected!==current){panel.inert=i!==selected;panel.setAttribute('aria-hidden',String(i!==selected));panel.classList.toggle('is-current',i===selected);}
    });
    if(selected!==current){current=selected;links.forEach((link,i)=>{if(i===selected)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');});}
    hero.style.setProperty('--scrim',(smooth(.35,.8,position)*.58).toFixed(3));
    meter.style.transform='scaleX('+(position/2*.96+.04).toFixed(4)+')';
    if(pendingFocus===selected&&Math.abs(position-selected)<.025){panels[selected].tabIndex=-1;panels[selected].focus({preventScroll:true});pendingFocus=-1;}
  }
  function tick(time){
    raf=0;if(document.hidden){lastTime=0;return;}
    const dt=lastTime?Math.min(64,time-lastTime):17;lastTime=time;
    const blend=1-Math.pow(.79,dt/16.67);position+=(target-position)*blend;viewX+=(pointerX-viewX)*blend;viewY+=(pointerY-viewY)*blend;
    paintCopy();
    const visible=scrollY+innerHeight>top&&scrollY<top+(ready?hero.offsetHeight:innerHeight);
    const run=renderer&&motion()&&!main.inert&&visible;
    if(run&&time-lastPaint>=1000/30){clock+=Math.min(.075,(time-lastPaint)/1000);lastPaint=time;renderer.draw(ready?position:0,clock,viewX,viewY);}
    if(run||ready&&Math.abs(target-position)>.001)request();
  }
  function go(index,behavior='smooth',focus=false){if(!ready)return;measure();pendingFocus=focus?index:-1;window.scrollTo({top:top+range*index/2,behavior});request();}
  links.forEach(link=>link.addEventListener('click',event=>{
    if(!ready||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();try{history.replaceState(null,'',link.hash);}catch{}
    go(Number(link.dataset.cinemaStep),'smooth',event.detail===0);
  }));
  window.addEventListener('scroll',()=>{measure();request();},{passive:true});
  window.addEventListener('resize',()=>{if(!resizeFrame)resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;layout();});},{passive:true});
  window.addEventListener('pointermove',event=>{if(!fine.matches||event.pointerType!=='mouse'||!motion())return;pointerX=(event.clientX/innerWidth-.5)*2;pointerY=(event.clientY/innerHeight-.5)*2;request();},{passive:true});
  document.addEventListener('pointerleave',()=>{pointerX=pointerY=0;request();});
  window.addEventListener('site:motionchange',()=>{startRenderer();layout();});
  window.addEventListener('site:overlaychange',request);
  window.addEventListener('hashchange',()=>{const i=panels.findIndex(p=>'#'+p.id===location.hash);if(i>=0)go(i);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;lastTime=0;}else{measure();lastPaint=performance.now();request();}});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();renderer=null;attempted=false;root.classList.remove('world-ready');layout();});
  canvas.addEventListener('webglcontextrestored',()=>{attempted=false;startRenderer();layout();});
  if('ResizeObserver'in window)new ResizeObserver(()=>{measure();request();}).observe(main);
  startRenderer();layout(false);
  document.fonts?.ready.then(()=>{layout();const i=panels.findIndex(p=>'#'+p.id===initialHash);if(i>=0)go(i,'instant');});
})();
