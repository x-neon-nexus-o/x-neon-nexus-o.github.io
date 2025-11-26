(function(){
var rm=false,coarse=false;
try{rm=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(_){}
try{coarse=matchMedia('(hover: none), (pointer: coarse)').matches}catch(_){}
if(coarse)return;
var root=document.createElement('div');
root.className='custom-cursor';
root.setAttribute('aria-hidden','true');
root.setAttribute('role','presentation');
var ring=document.createElement('div');
ring.className='cursor-ring';
var dot=document.createElement('div');
dot.className='cursor-dot';
root.appendChild(ring);
root.appendChild(dot);
document.body.appendChild(root);
var x=0,y=0,tx=window.innerWidth/2,ty=window.innerHeight/2,moving=false,w=0,h=0,dw=0,dh=0,scale=1;
function dims(){var sr=getComputedStyle(ring);w=parseFloat(sr.width)||32;h=parseFloat(sr.height)||32;var sd=getComputedStyle(dot);dw=parseFloat(sd.width)||8;dh=parseFloat(sd.height)||8}
dims();
function set(){var rt='translate3d('+x+'px,'+y+'px,0) scale('+scale+')';ring.style.transform=rt;var dt='translate3d('+(tx-(dw/2))+'px,'+(ty-(dh/2))+'px,0)';dot.style.transform=dt}
// draw initial position centered
x=tx-(w/2);y=ty-(h/2);set();
function step(){moving=false;var k=rm?1:0.18;x+=((tx-(w/2))-x)*k;y+=((ty-(h/2))-y)*k;set();if(!rm&&(Math.abs((tx-(w/2))-x)>0.1||Math.abs((ty-(h/2))-y)>0.1))requestAnimationFrame(step)}
window.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;if(!moving){moving=true;requestAnimationFrame(step)}},{passive:true})
window.addEventListener('resize',function(){dims();set()},{passive:true})
window.addEventListener('mousedown',function(){root.classList.add('cursor--active');scale=0.9;set()},{passive:true})
window.addEventListener('mouseup',function(){root.classList.remove('cursor--active');scale=root.classList.contains('cursor--interactive')?1.25:1;set()},{passive:true})
var sel='a, button, .btn, [role="button"], input, textarea, select, label';
document.addEventListener('mouseover',function(e){if(e.target&&e.target.closest(sel)){root.classList.add('cursor--interactive');scale=1.25;set()}},{passive:true})
document.addEventListener('mouseout',function(e){if(e.target&&e.target.closest(sel)){root.classList.remove('cursor--interactive');scale=1;set()}},{passive:true})
document.addEventListener('visibilitychange',function(){if(document.hidden)root.classList.add('cursor-hidden');else root.classList.remove('cursor-hidden')})
window.addEventListener('touchstart',function(){root.style.display='none'},{passive:true})
window.addEventListener('hashchange',function(){root.classList.add('cursor--section-transition');setTimeout(function(){root.classList.remove('cursor--section-transition')},400)})
var metrics={pointerEvents:0,rafFrames:0,rafDeltaSum:0,rafDeltaMax:0,start:performance.now()};
var last=performance.now();
function mstep(){var now=performance.now(),d=now-last;last=now;metrics.rafFrames++;metrics.rafDeltaSum+=d;if(d>metrics.rafDeltaMax)metrics.rafDeltaMax=d}
var origRAF=window.requestAnimationFrame;
window.requestAnimationFrame=function(cb){return origRAF(function(ts){mstep();cb(ts)})}
document.addEventListener('pointermove',function(){metrics.pointerEvents++},{passive:true})
window.addEventListener('beforeunload',function(){window.cursorMetrics={avgFrameMs:metrics.rafFrames?metrics.rafDeltaSum/metrics.rafFrames:0,maxFrameMs:metrics.rafDeltaMax,pointerEvents:metrics.pointerEvents,sessionMs:performance.now()-metrics.start}})
})();
