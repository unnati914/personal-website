import React,{useEffect,useRef,useState} from 'react';
import {getAudio} from './voice';

const H=240, GROUND=H-40, PLAYER_X=90;
const kinds=[
 {name:'pothole',w:48,h:10},
 {name:'cow',emoji:'🐄',w:42,h:34,size:40},
 {name:'auto-rickshaw',emoji:'🛺',w:42,h:36,size:40},
 {name:'road works',emoji:'🚧',w:30,h:28,size:30}
];
const readBest=()=>{try{return Number(localStorage.getItem('glo-ride-best'))||0}catch{return 0}};

function blip(freq,dur,type='square'){
 const c=getAudio(); if(!c)return; const t=c.currentTime;
 const o=c.createOscillator(), g=c.createGain(); o.type=type; o.frequency.setValueAtTime(freq,t); o.frequency.exponentialRampToValueAtTime(freq*(type==='sawtooth'?.25:2),t+dur);
 g.gain.setValueAtTime(.12,t); g.gain.exponentialRampToValueAtTime(.001,t+dur); o.connect(g).connect(c.destination); o.start(t); o.stop(t+dur);
}

function rr(ctx,x,y,w,h,r){ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fill();}

function drawRider(ctx,x,y,spin,col){
 ctx.save(); ctx.lineCap='round'; ctx.lineJoin='round';
 ctx.strokeStyle=col.ink; ctx.lineWidth=4;
 [x-18,x+18].forEach(wx=>{ctx.beginPath(); ctx.arc(wx,y-11,10,0,Math.PI*2); ctx.stroke(); ctx.save(); ctx.translate(wx,y-11); ctx.rotate(spin); ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(-8,0); ctx.lineTo(8,0); ctx.moveTo(0,-8); ctx.lineTo(0,8); ctx.stroke(); ctx.restore();});
 ctx.beginPath(); ctx.moveTo(x-18,y-11); ctx.lineTo(x-4,y-22); ctx.lineTo(x+12,y-22); ctx.lineTo(x+18,y-11); ctx.moveTo(x+12,y-22); ctx.lineTo(x+16,y-32); ctx.stroke();
 ctx.fillStyle=col.accentDeep; rr(ctx,x-6,y-31,19,9,4);
 ctx.fillStyle='#ffe3f0'; rr(ctx,x-16,y-44,13,16,6);
 ctx.strokeStyle='#f3c6dc'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(x-6,y-38); ctx.lineTo(x+14,y-34); ctx.stroke();
 ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x-9,y-54,11,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='#f3c6dc'; ctx.lineWidth=2; ctx.stroke();
 ctx.fillStyle='#3b1d48'; rr(ctx,x-7,y-59,15,9,4.5);
 ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x+4,y-55,1.8,0,Math.PI*2); ctx.fill();
 ctx.strokeStyle='#d9b6e6'; ctx.beginPath(); ctx.moveTo(x-9,y-65); ctx.lineTo(x-9,y-70); ctx.stroke();
 ctx.fillStyle='#ff4f93'; rr(ctx,x-12,y-77,6,7,2);
 ctx.restore();
}

export default function GloRide({sound}){
 const canvas=useRef(null), wrap=useRef(null), soundRef=useRef(sound); soundRef.current=sound;
 const [state,setState]=useState('ready'); const [score,setScore]=useState(0); const [best,setBest]=useState(readBest); const [killer,setKiller]=useState('');
 const g=useRef({}), visible=useRef(false), stateRef=useRef('ready');
 const setPhase=p=>{stateRef.current=p; setState(p);};

 const reset=()=>{g.current={y:0,vy:0,dist:0,speed:6,obstacles:[],nextIn:60,spin:0,frame:0};};
 const jump=()=>{
  if(stateRef.current!=='running'){reset(); setScore(0); setPhase('running'); return;}
  if(g.current.y===0){g.current.vy=-11.5; if(soundRef.current)blip(330,.15);}
 };

 useEffect(()=>{
  reset();
  const io=new IntersectionObserver(([e])=>{
   visible.current=e.isIntersecting;
  },{threshold:.3});
  io.observe(wrap.current);
  const key=e=>{
   if(!visible.current||e.target.closest?.('input,textarea,button,[role="dialog"]'))return;
   if(e.key===' '||e.key==='ArrowUp'){e.preventDefault(); jump();}
  };
  window.addEventListener('keydown',key);
  let raf;
  const tick=()=>{
   raf=requestAnimationFrame(tick);
   const c=canvas.current; if(!c||!visible.current)return;
   const W=c.clientWidth, dpr=window.devicePixelRatio||1;
   if(c.width!==Math.round(W*dpr)){c.width=Math.round(W*dpr); c.height=Math.round(H*dpr);}
   const ctx=c.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
   const css=getComputedStyle(document.documentElement);
   const col={ink:css.getPropertyValue('--ink').trim()||'#2a1830',line:css.getPropertyValue('--line').trim()||'#efdbe8',accent:css.getPropertyValue('--accent').trim()||'#ffb8d9',accentDeep:css.getPropertyValue('--accent-deep').trim()||'#d6337f'};
   const s=g.current, running=stateRef.current==='running';
   if(running){
    s.frame++; s.speed=Math.min(14,6+s.dist/900); s.dist+=s.speed; s.spin+=s.speed/10;
    s.vy+=.6; s.y=Math.min(0,s.y+s.vy); if(s.y===0)s.vy=0;
    if(--s.nextIn<=0){const k=kinds[Math.floor(Math.random()*kinds.length)]; s.obstacles.push({...k,x:W+20}); s.nextIn=Math.round((55+Math.random()*60)*(7/s.speed)*1.4);}
    s.obstacles.forEach(o=>o.x-=s.speed); s.obstacles=s.obstacles.filter(o=>o.x>-60);
    const py=GROUND+s.y;
    const hit=s.obstacles.find(o=>o.x<PLAYER_X+20&&o.x+o.w>PLAYER_X-22&&py>GROUND-o.h+6);
    if(s.frame%6===0)setScore(Math.floor(s.dist/10));
    if(hit){
     const final=Math.floor(s.dist/10); setScore(final); setKiller(hit.name); setPhase('over');
     if(soundRef.current)blip(220,.5,'sawtooth');
     setBest(b=>{const nb=Math.max(b,final); try{localStorage.setItem('glo-ride-best',String(nb))}catch{} return nb;});
    }
   }
   ctx.clearRect(0,0,W,H);
   // parallax hills
   ctx.fillStyle=col.accent; ctx.globalAlpha=.35;
   const off=(s.dist*.15)%220;
   for(let x=-off-220;x<W+220;x+=220){ctx.beginPath(); ctx.moveTo(x,GROUND); ctx.lineTo(x+110,GROUND-90); ctx.lineTo(x+220,GROUND); ctx.fill();}
   ctx.globalAlpha=1;
   // road
   ctx.fillStyle=col.line; ctx.fillRect(0,GROUND,W,40);
   ctx.strokeStyle='#fff'; ctx.lineWidth=3; ctx.setLineDash([22,18]); ctx.lineDashOffset=s.dist%40; ctx.beginPath(); ctx.moveTo(0,GROUND+22); ctx.lineTo(W,GROUND+22); ctx.stroke(); ctx.setLineDash([]);
   // obstacles
   ctx.textAlign='left'; ctx.textBaseline='bottom';
   s.obstacles.forEach(o=>{
    if(o.name==='pothole'){ctx.fillStyle=col.ink; ctx.globalAlpha=.85; ctx.beginPath(); ctx.ellipse(o.x+o.w/2,GROUND+3,o.w/2,6,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;}
    else{ctx.font=`${o.size}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`; ctx.fillText(o.emoji,o.x,GROUND+4);}
   });
   drawRider(ctx,PLAYER_X,GROUND+s.y,s.spin,col);
  };
  raf=requestAnimationFrame(tick);
  return ()=>{cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('keydown',key);};
 },[]);

 return <div className="glo-ride" ref={wrap}>
  <div className="ride-head"><div><div className="section-label">mini game</div><h3>glo’s highway dash</h3></div><div className="ride-score"><strong>{score} m</strong><span>best {best} m</span></div></div>
  <div className="ride-stage" onPointerDown={e=>{e.preventDefault(); jump();}}>
   <canvas ref={canvas} style={{height:H}} aria-label="Glo's highway dash game. Press space, the up arrow or tap to jump."/>
   {state!=='running'&&<div className="ride-overlay">
    {state==='over'?<><strong>crashed into {killer==='pothole'?'a pothole':`the ${killer}`}! 💥</strong><span>{score} m · tap or press space to ride again</span></>:<><strong>dodge potholes, cows & autos</strong><span>tap or press space to jump</span></>}
   </div>}
  </div>
 </div>;
}
