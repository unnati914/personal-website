import React,{useEffect,useMemo,useRef} from 'react';
import {motion,AnimatePresence} from 'framer-motion';

const code=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export function useKonami(onUnlock){
 const cb=useRef(onUnlock); cb.current=onUnlock;
 useEffect(()=>{
  let i=0;
  const handler=e=>{const k=e.key.length===1?e.key.toLowerCase():e.key; i=k===code[i]?i+1:(k===code[0]?1:0); if(i===code.length){i=0;cb.current();}};
  window.addEventListener('keydown',handler);
  return ()=>window.removeEventListener('keydown',handler);
 },[]);
}

const bits=['💄','🏍️','✨','🗺️','💖','⚡'];

export function Confetti({burst}){
 const pieces=useMemo(()=>burst?Array.from({length:40},(_,i)=>({id:`${burst}-${i}`,char:bits[i%bits.length],x:Math.random()*100,delay:Math.random()*.6,spin:(Math.random()-.5)*720,dur:2.2+Math.random()*1.4})):[],[burst]);
 return <div className="confetti" aria-hidden="true"><AnimatePresence>{pieces.map(p=><motion.span key={p.id} style={{left:`${p.x}vw`}} initial={{y:'-10vh',rotate:0,opacity:1}} animate={{y:'110vh',rotate:p.spin,opacity:[1,1,0]}} transition={{duration:p.dur,delay:p.delay,ease:'easeIn'}}>{p.char}</motion.span>)}</AnimatePresence></div>;
}
