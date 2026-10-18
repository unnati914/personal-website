import React,{useEffect,useRef,useState} from 'react';
import {motion,useMotionValue,useTransform,useScroll,useMotionValueEvent} from 'framer-motion';
import {getAudio} from './voice';
import GloRide from './GloRide';

const engines={
 cruiser:{label:'cruiser thump',wave:'sawtooth',f:[75,200],lfo:[8,22],depth:.55,filter:[700,2200]},
 sport:{label:'sports scream',wave:'sawtooth',f:[140,900],lfo:[30,70],depth:.15,filter:[1500,6000]},
 scooter:{label:'scooter putt-putt',wave:'square',f:[120,420],lfo:[20,45],depth:.3,filter:[900,2500]}
};

function useEngine(profileRef){
 const ref=useRef(null);
 const start=()=>{
  const ctx=getAudio(); if(!ctx)return;
  if(ref.current)return;
  const osc=ctx.createOscillator(); osc.type='sawtooth';
  const sub=ctx.createOscillator(); sub.type='square';
  const top=ctx.createOscillator(); top.type='triangle';
  const filter=ctx.createBiquadFilter(); filter.type='lowpass'; filter.Q.value=1.5;
  const chug=ctx.createGain(); chug.gain.value=.6;
  const lfo=ctx.createOscillator(); const lfoDepth=ctx.createGain(); lfoDepth.gain.value=.4;
  const master=ctx.createGain(); master.gain.value=0;
  lfo.connect(lfoDepth).connect(chug.gain);
  osc.connect(filter); sub.connect(filter); top.connect(filter); filter.connect(chug).connect(master).connect(ctx.destination);
  [osc,sub,top,lfo].forEach(n=>n.start());
  ref.current={ctx,osc,sub,top,filter,lfo,lfoDepth,master};
 };
 const update=(rpm,on)=>{
  const e=ref.current; if(!e)return; const t=e.ctx.currentTime;
  // laptop/phone speakers can't reproduce much below ~80Hz, so keep the fundamental audible
  const p=profileRef.current, f=p.f[0]+rpm*(p.f[1]-p.f[0]);
  if(e.osc.type!==p.wave)e.osc.type=p.wave;
  e.osc.frequency.setTargetAtTime(f,t,.05);
  e.sub.frequency.setTargetAtTime(f*2,t,.05);
  e.top.frequency.setTargetAtTime(f*3,t,.05);
  e.lfo.frequency.setTargetAtTime(p.lfo[0]+rpm*(p.lfo[1]-p.lfo[0]),t,.05);
  e.lfoDepth.gain.setTargetAtTime(p.depth,t,.05);
  e.filter.frequency.setTargetAtTime(p.filter[0]+rpm*(p.filter[1]-p.filter[0]),t,.05);
  e.master.gain.setTargetAtTime(on?.16+rpm*.12:0,t,.06);
 };
 useEffect(()=>()=>ref.current?.master.disconnect(),[]);
 return {start,update};
}

export default function Garage({sound}){
 const rpm=useMotionValue(0), shake=useMotionValue(0), spin=useMotionValue(0);
 const hold=useRef(false); const soundRef=useRef(sound); soundRef.current=sound;
 const [revving,setRevving]=useState(false); const [redline,setRedline]=useState(false);
 const [engineKind,setEngineKind]=useState('cruiser'); const profileRef=useRef(engines.cruiser); profileRef.current=engines[engineKind];
 const engine=useEngine(profileRef);
 const needle=useTransform(rpm,[0,1],[-90,90]);
 const speed=useTransform(rpm,r=>Math.round(r*160));
 const wheelie=useTransform(rpm,[.85,1],[0,-9]);
 const glow=useTransform(rpm,[.3,1],[0,1]);
 const [km,setKm]=useState(0); const last=useRef(0);
 const {scrollY}=useScroll();
 useMotionValueEvent(scrollY,'change',v=>{setKm(k=>k+Math.abs(v-last.current)/1000); last.current=v;});
 useEffect(()=>{
  let raf;
  const tick=()=>{
   const r=rpm.get(); const next=hold.current?Math.min(1,r+.01+(1-r)*.025):Math.max(0,r-.016);
   if(next!==r||hold.current){rpm.set(next); shake.set(hold.current?(Math.random()-.5)*next*3:0); spin.set(spin.get()+next*30); setRedline(next>.95);}
   engine.update(next,soundRef.current&&(hold.current||next>.01));
   raf=requestAnimationFrame(tick);
  };
  raf=requestAnimationFrame(tick);
  return ()=>cancelAnimationFrame(raf);
 },[]);
 const down=()=>{hold.current=true; setRevving(true); if(soundRef.current)engine.start();};
 const up=()=>{hold.current=false; setRevving(false); if(soundRef.current)engine.start();};
 const key=(e,v)=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault(); v?down():up();}};
 return <section id="garage" className="garage">
  <div className="section-label">08 / the garage</div>
  <div className="garage-grid">
   <div>
    <h2>off the clock,<br/><span>on the road.</span></h2>
    <p>When I’m not shipping agents, I’m chasing long highways. Hold the button to rev. Glo rides pillion.</p>
    <div className="odometer"><span>odometer</span><strong>{km.toFixed(2)} km</strong><small>scrolled on this page</small></div>
   </div>
   <div className={revving?'garage-card revving':'garage-card'}>
    <motion.svg className="garage-bike" viewBox="0 0 250 150" style={{x:shake,rotate:wheelie,originX:'22%',originY:'92%'}} aria-hidden="true">
     <defs><linearGradient id="tank" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff5c9a"/><stop offset="1" stopColor="#9b5de5"/></linearGradient></defs>
     <g className="puffs"><circle cx="30" cy="100" r="6"/><circle cx="22" cy="96" r="8"/><circle cx="12" cy="92" r="10"/></g>
     <path d="M95 104 L42 98" stroke="#c9b0d2" strokeWidth="7" strokeLinecap="round"/>
     {[[60,108],[195,108]].map(([cx,cy])=><motion.g key={cx} style={{rotate:spin}}><circle cx={cx} cy={cy} r="28" fill="none" stroke="var(--ink)" strokeWidth="7"/><path d={`M${cx-24} ${cy} H${cx+24} M${cx} ${cy-24} V${cy+24}`} stroke="var(--ink)" strokeWidth="2" opacity=".5"/><circle cx={cx} cy={cy} r="5" fill="var(--ink)"/></motion.g>)}
     <path d="M60 108 L112 98 L150 98 L195 108" stroke="var(--ink)" strokeWidth="5" fill="none" strokeLinejoin="round"/>
     <rect x="102" y="82" width="48" height="26" rx="7" fill="var(--ink)"/>
     <path d="M195 108 L172 52" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round"/>
     <path d="M172 52 L160 44 M172 52 L182 46" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round"/>
     <path d="M100 66 Q122 46 154 56 L152 70 L104 72 Z" fill="url(#tank)"/>
     <path d="M70 66 Q86 57 104 62 L102 70 L72 72 Z" fill="var(--ink)"/>
     <circle cx="180" cy="66" r="7" fill="#fff6c9" stroke="var(--ink)" strokeWidth="2"/>
     <motion.path d="M187 66 L240 52 L240 80 Z" fill="#fff6c9" style={{opacity:glow}}/>
     <rect x="80" y="40" width="24" height="26" rx="11" fill="#ffe3f0" stroke="#f3c6dc" strokeWidth="2"/>
     <path d="M100 48 Q140 40 164 45" stroke="#f3c6dc" strokeWidth="6" fill="none" strokeLinecap="round"/>
     <circle cx="92" cy="26" r="17" fill="#fff" stroke="#f3c6dc" strokeWidth="2"/>
     <rect x="88" y="18" width="24" height="14" rx="7" fill="#3b1d48"/>
     <circle cx="104" cy="25" r="2.5" fill="#fff"/>
     <ellipse cx="86" cy="36" rx="4" ry="2.4" fill="#ff9cc5"/>
    </motion.svg>
    <div className="gauge">
     <svg viewBox="0 0 160 96" aria-hidden="true">
      <path d="M20 86 A60 60 0 0 1 140 86" stroke="var(--line)" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <motion.path d="M20 86 A60 60 0 0 1 140 86" stroke="url(#gauge-grad)" strokeWidth="10" fill="none" strokeLinecap="round" style={{pathLength:rpm}}/>
      <defs><linearGradient id="gauge-grad"><stop offset="0" stopColor="#4cc9f0"/><stop offset=".6" stopColor="#9b5de5"/><stop offset="1" stopColor="#ff4f93"/></linearGradient></defs>
      <motion.line x1="80" y1="86" x2="80" y2="36" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" style={{rotate:needle,originX:'50%',originY:'100%'}}/>
      <circle cx="80" cy="86" r="5" fill="var(--ink)"/>
     </svg>
     <div className="gauge-read"><motion.strong>{speed}</motion.strong><span>km/h</span></div>
    </div>
 <div className="engine-picker" role="radiogroup" aria-label="Engine sound">{Object.entries(engines).map(([k,v])=><button key={k} role="radio" aria-checked={engineKind===k} className={engineKind===k?'active':''} onClick={()=>setEngineKind(k)}>{v.label}</button>)}</div>
    <button className="rev-button" onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up} onKeyDown={e=>key(e,true)} onKeyUp={e=>key(e,false)} onContextMenu={e=>e.preventDefault()}>{redline?'redline! 🔥':revving?'vroooom…':'hold to rev'}</button>
    {!sound&&<small className="garage-note">sound is off. turn it on in the header for engine noise.</small>}
   </div>
  </div>
  <GloRide sound={sound}/>
 </section>;
}
