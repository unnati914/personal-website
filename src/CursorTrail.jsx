import React,{useEffect,useRef} from 'react';

function star(ctx,x,y,r){ctx.beginPath(); ctx.moveTo(x,y-r); ctx.lineTo(x+r*.3,y-r*.3); ctx.lineTo(x+r,y); ctx.lineTo(x+r*.3,y+r*.3); ctx.lineTo(x,y+r); ctx.lineTo(x-r*.3,y+r*.3); ctx.lineTo(x-r,y); ctx.lineTo(x-r*.3,y-r*.3); ctx.closePath(); ctx.fill();}

// Sparkles follow the mouse; inside the garage they turn into tyre marks. Mouse only, never on touch.
export default function CursorTrail({disabled}){
 const ref=useRef(null);
 useEffect(()=>{
  if(disabled||window.matchMedia('(pointer: coarse)').matches)return;
  const c=ref.current, ctx=c.getContext('2d');
  let parts=[], raf=0, last=null;
  const resize=()=>{const d=window.devicePixelRatio||1; c.width=innerWidth*d; c.height=innerHeight*d; ctx.setTransform(d,0,0,d,0,0);};
  resize();
  const draw=()=>{
   const css=getComputedStyle(document.documentElement), accent=css.getPropertyValue('--accent-deep').trim()||'#d6337f', ink=css.getPropertyValue('--ink').trim()||'#2a1830';
   ctx.clearRect(0,0,innerWidth,innerHeight);
   parts.forEach(p=>{
    p.life-=p.decay; ctx.globalAlpha=Math.max(0,p.life);
    if(p.kind==='spark'){p.x+=p.vx; p.y+=p.vy; ctx.fillStyle=p.alt?'#9b5de5':accent; star(ctx,p.x,p.y,p.r*p.life+.5);}
    else{ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.globalAlpha*=.45; ctx.fillStyle=ink; ctx.fillRect(-6,-8,12,3); ctx.fillRect(-6,5,12,3); ctx.restore();}
   });
   ctx.globalAlpha=1;
   parts=parts.filter(p=>p.life>0).slice(-140);
   raf=parts.length?requestAnimationFrame(draw):0;
  };
  const move=e=>{
   if(e.pointerType!=='mouse')return;
   const p={x:e.clientX,y:e.clientY};
   if(last){
    const dx=p.x-last.x, dy=p.y-last.y; if(Math.hypot(dx,dy)<7)return;
    if(e.target.closest?.('#garage'))parts.push({kind:'tyre',x:p.x,y:p.y,a:Math.atan2(dy,dx),life:1,decay:.01});
    else parts.push({kind:'spark',x:p.x,y:p.y,vx:(Math.random()-.5)*.6,vy:.2+Math.random()*.6,r:2+Math.random()*3,life:1,decay:.03,alt:Math.random()>.5});
   }
   last=p;
   if(!raf)raf=requestAnimationFrame(draw);
  };
  window.addEventListener('pointermove',move,{passive:true});
  window.addEventListener('resize',resize);
  return ()=>{window.removeEventListener('pointermove',move); window.removeEventListener('resize',resize); cancelAnimationFrame(raf);};
 },[disabled]);
 if(disabled)return null;
 return <canvas ref={ref} className="cursor-trail" aria-hidden="true"/>;
}
