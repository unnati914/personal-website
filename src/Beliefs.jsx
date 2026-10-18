import React,{useState} from 'react';
import {motion} from 'framer-motion';

// The first five come from lessons already on the site; the last two are drafts to edit.
const beliefs=[
 {take:'Shipping beats protecting an idea.',why:'A shipped version creates better evidence than a perfect plan in a doc.'},
 {take:'A fast v1 is only the beginning.',why:'The prototype is the easy part. Scaling it is where the real problem starts.'},
 {take:'Working is not the same as wanted.',why:'A product that technically works still needs a reason for people to come back.'},
 {take:'Weird questions are worth asking.',why:'Even when the product doesn’t continue, the question teaches you something.'},
 {take:'ship → learn → iterate → repeat',why:'The whole loop. Everything else is commentary.'},
 {take:'Evals before vibes.',why:'If you can’t measure an agent, you can’t improve it.'},
 {take:'RAG is a retrieval problem first.',why:'Most “the LLM is wrong” bugs are really search bugs. Fix retrieval and accuracy follows.'}
];

export default function Beliefs(){
 const [flipped,setFlipped]=useState({});
 return <section id="beliefs" className="beliefs">
  <div className="section-label">07 / things I believe</div>
  <h2>hot takes,<br/><span>lightly toasted.</span></h2>
  <div className="belief-grid">{beliefs.map((b,i)=><motion.button key={i} className={flipped[i]?'belief flipped':'belief'} aria-pressed={!!flipped[i]} onClick={()=>setFlipped(f=>({...f,[i]:!f[i]}))} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}>
   <motion.div className="belief-inner" animate={{rotateY:flipped[i]?180:0}} transition={{duration:.5,type:'spring',stiffness:140,damping:18}}>
    <div className="belief-face front"><span>0{i+1}</span><strong>{b.take}</strong><small>tap to flip ↻</small></div>
    <div className="belief-face back"><span>why</span><p>{b.why}</p></div>
   </motion.div>
  </motion.button>)}</div>
 </section>;
}
