import React,{useEffect,useRef,useState} from 'react';
import {motion,AnimatePresence,useSpring} from 'framer-motion';
import {speak} from './voice';

const quips=[
 'hi, I’m Glo ✨ Unnati’s build buddy',
 'is it a bike day? 🏍️',
 'passport’s packed. tabs are open.',
 'shipping beats perfect. every time.',
 'psst: try a new shade below 💄',
 'I run on RAG and lip gloss.'
];

export default function Mascot({mini=false,onClick,label,voice=false,greeting,onSecret,outfit=''}){
 const ref=useRef(null);
 const [quip,setQuip]=useState(mini?'':greeting||quips[0]);
 const [spins,setSpins]=useState(0);
 const [n,setN]=useState(1);
 const px=useSpring(0,{stiffness:180,damping:18});
 const py=useSpring(0,{stiffness:180,damping:18});
 useEffect(()=>{
  const move=e=>{const r=ref.current?.getBoundingClientRect(); if(!r)return; const dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height*.42), d=Math.hypot(dx,dy)||1; px.set(dx/d*Math.min(5,d/30)); py.set(dy/d*Math.min(4,d/30));};
  window.addEventListener('pointermove',move);
  return ()=>window.removeEventListener('pointermove',move);
 },[px,py]);
 useEffect(()=>{if(mini||!quip)return; const t=setTimeout(()=>setQuip(''),3200); return ()=>clearTimeout(t);},[quip,mini]);
 const click=()=>{setSpins(s=>s+1); if(onClick){if(voice)speak('Ask me anything about Unnati!'); return onClick();} if(onSecret&&n%7===6){setN(n+1); return onSecret();} const line=quips[n%quips.length]; setQuip(line); setN(n+1); if(voice)speak(line);};
 return <div className={mini?'mascot mini':'mascot'} ref={ref}>
  {mini?<div className="mascot-bubble">ask unnati?</div>:<AnimatePresence>{quip&&<motion.div key={quip} className="mascot-bubble" initial={{opacity:0,y:8,scale:.9}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-6,scale:.95}}>{quip}</motion.div>}</AnimatePresence>}
  <motion.button className="mascot-button" onClick={click} aria-label={label||'Glo the mascot. Click for a fun fact.'} animate={{rotate:spins*360}} transition={{type:'spring',stiffness:120,damping:14}} whileHover={{scale:1.05}} whileTap={{scale:.94}}>
   <svg viewBox="0 -8 200 236" aria-hidden="true">
    <defs>
     <linearGradient id="glo-shell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset=".6" stopColor="#ffe3f0"/><stop offset="1" stopColor="#e9dcff"/></linearGradient>
     <linearGradient id="glo-visor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b1d48"/><stop offset="1" stopColor="#6b2f78"/></linearGradient>
     <linearGradient id="glo-helmet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff4f93"/><stop offset="1" stopColor="#9b5de5"/></linearGradient>
     <linearGradient id="glo-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e9c46a"/><stop offset=".5" stopColor="#fff1c4"/><stop offset="1" stopColor="#d4a640"/></linearGradient>
    </defs>
    <ellipse className="mascot-shadow" cx="100" cy="220" rx="44" ry="6"/>
    <motion.g animate={{y:[0,-7,0]}} transition={{duration:3.2,repeat:Infinity,ease:'easeInOut'}}>
     {outfit!=='helmet'&&<g><line x1="100" y1="46" x2="100" y2="30" stroke="#d9b6e6" strokeWidth="4" strokeLinecap="round"/>
     <rect x="91" y="18" width="18" height="14" rx="3" fill="url(#glo-gold)"/>
     <path d="M93 18 V9 Q93 5 97 4 L107 0 V18 Z" fill="#ff4f93"/></g>}
     <rect x="40" y="44" width="120" height="100" rx="46" fill="url(#glo-shell)" stroke="#f3c6dc" strokeWidth="2"/>
     <ellipse cx="70" cy="60" rx="16" ry="7" fill="#fff" opacity=".9" transform="rotate(-22 70 60)"/>
     <rect x="54" y="66" width="92" height="50" rx="25" fill="url(#glo-visor)"/>
     <path d="M66 76 Q76 70 90 71" stroke="#fff" strokeOpacity=".3" strokeWidth="3" fill="none" strokeLinecap="round"/>
     <g className="mascot-eyes">
      <ellipse cx="82" cy="92" rx="9" ry="11" fill="#fff"/>
      <ellipse cx="118" cy="92" rx="9" ry="11" fill="#fff"/>
      <motion.g style={{x:px,y:py}}>
       <circle cx="82" cy="93" r="5" fill="#3b1d48"/><circle cx="84" cy="90" r="1.6" fill="#fff"/>
       <circle cx="118" cy="93" r="5" fill="#3b1d48"/><circle cx="120" cy="90" r="1.6" fill="#fff"/>
      </motion.g>
     </g>
     <ellipse cx="62" cy="127" rx="9" ry="5" fill="#ff9cc5" opacity=".75"/>
     <ellipse cx="138" cy="127" rx="9" ry="5" fill="#ff9cc5" opacity=".75"/>
     <path d="M90 127 Q100 136 110 127" stroke="#3b1d48" strokeWidth="3" fill="none" strokeLinecap="round"/>
     <rect x="70" y="146" width="60" height="50" rx="24" fill="url(#glo-shell)" stroke="#f3c6dc" strokeWidth="2"/>
     <path className="mascot-heart" d="M100 178 L91 169 A5 5 0 0 1 100 162 A5 5 0 0 1 109 169 Z"/>
     <path d="M72 162 Q54 168 50 184" stroke="#f3c6dc" strokeWidth="11" fill="none" strokeLinecap="round"/>
     <AnimatePresence>
      {outfit==='labcoat'&&<motion.g key="coat" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}>
       <path d="M64 152 Q100 140 136 152 L138 198 Q100 204 62 198 Z" fill="#fff" stroke="#e2d8ee" strokeWidth="2"/>
       <path d="M100 146 L88 172 M100 146 L112 172" stroke="#cfc3df" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
       <rect x="110" y="178" width="15" height="11" rx="2" fill="none" stroke="#cfc3df" strokeWidth="2"/>
       <line x1="114" y1="172" x2="114" y2="181" stroke="#d6337f" strokeWidth="2.5" strokeLinecap="round"/>
      </motion.g>}
      {outfit==='shades'&&<motion.g key="shades" initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}}>
       <rect x="66" y="80" width="30" height="22" rx="9" fill="#120a16"/><rect x="104" y="80" width="30" height="22" rx="9" fill="#120a16"/>
       <path d="M96 88 H104" stroke="#120a16" strokeWidth="4"/><path d="M72 86 L80 84" stroke="#fff" strokeOpacity=".6" strokeWidth="2.5" strokeLinecap="round"/><path d="M110 86 L118 84" stroke="#fff" strokeOpacity=".6" strokeWidth="2.5" strokeLinecap="round"/>
      </motion.g>}
      {outfit==='helmet'&&<motion.g key="helmet" initial={{opacity:0,y:-24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-24}}>
       <path d="M32 96 Q32 28 100 28 Q168 28 168 96 Q152 66 100 64 Q48 66 32 96 Z" fill="url(#glo-helmet)"/>
       <path d="M100 28 V64" stroke="#fff" strokeOpacity=".75" strokeWidth="7"/>
       <ellipse cx="66" cy="46" rx="12" ry="5" fill="#fff" opacity=".5" transform="rotate(-25 66 46)"/>
      </motion.g>}
     </AnimatePresence>
     <motion.g style={{originX:0,originY:1}} animate={{rotate:[0,-22,4,-22,0]}} transition={{duration:1.4,repeat:Infinity,repeatDelay:2.6}}>
      <path d="M128 160 Q148 152 154 134" stroke="#f3c6dc" strokeWidth="11" fill="none" strokeLinecap="round"/>
     </motion.g>
    </motion.g>
    <path className="sparkle s1" d="M26 70 L29 79 L38 82 L29 85 L26 94 L23 85 L14 82 L23 79 Z"/>
    <path className="sparkle s2" d="M176 40 L178 46 L184 48 L178 50 L176 56 L174 50 L168 48 L174 46 Z"/>
    <path className="sparkle s3" d="M172 150 L174 155 L179 157 L174 159 L172 164 L170 159 L165 157 L170 155 Z"/>
   </svg>
  </motion.button>
 </div>;
}
