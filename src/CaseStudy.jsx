import React,{useEffect} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import {X} from 'lucide-react';

export default function CaseStudy({role,onClose}){
 useEffect(()=>{if(!role)return; const esc=e=>e.key==='Escape'&&onClose(); window.addEventListener('keydown',esc); return ()=>window.removeEventListener('keydown',esc);},[role,onClose]);
 return <AnimatePresence>{role&&<motion.div className="overlay drawer-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
  <motion.article className="case-drawer" role="dialog" aria-label={`${role.name} case study`} initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',stiffness:260,damping:30}} onClick={e=>e.stopPropagation()}>
   <button className="close" onClick={onClose} aria-label="Close case study"><X/></button>
   <div className="section-label">case study · {role.year}</div>
   <h2>{role.name}</h2>
   <strong className="case-role">{role.role}</strong>
   <p className="case-context">{role.detail}</p>
   <div className="case-stats">{role.impact.split(' · ').map((s,i)=><motion.div key={s} className="case-stat" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.15+i*.1}}>{s}</motion.div>)}</div>
   <h3>what I built</h3>
   <ol className="case-built">{role.built.map((b,i)=><motion.li key={b} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:.3+i*.08}}>{b}</motion.li>)}</ol>
   <h3>stack & skills</h3>
   <div className="case-stack">{role.stack.map(s=><span key={s}>{s}</span>)}</div>
   <a className="primary case-cta" href="/resume.pdf" download>download full resume ↓</a>
  </motion.article>
 </motion.div>}</AnimatePresence>;
}
