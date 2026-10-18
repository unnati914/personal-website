import React,{useEffect,useRef,useState} from 'react';
import {motion,AnimatePresence} from 'framer-motion';

export default function CommandPalette({open,onClose,commands}){
 const [query,setQuery]=useState('');
 const [sel,setSel]=useState(0);
 const inputRef=useRef(null);
 useEffect(()=>{if(open){setQuery('');setSel(0);setTimeout(()=>inputRef.current?.focus(),0);}},[open]);
 const list=commands.filter(c=>`${c.label} ${c.group} ${c.keywords||''}`.toLowerCase().includes(query.toLowerCase()));
 const run=c=>{onClose(); setTimeout(c.run,50);};
 const onKey=e=>{
  if(e.key==='ArrowDown'){e.preventDefault();setSel(s=>Math.min(s+1,list.length-1));}
  else if(e.key==='ArrowUp'){e.preventDefault();setSel(s=>Math.max(s-1,0));}
  else if(e.key==='Enter'&&list[sel])run(list[sel]);
  else if(e.key==='Escape')onClose();
 };
 return <AnimatePresence>{open&&<motion.div className="overlay palette-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
  <motion.div className="palette" role="dialog" aria-label="Command palette" initial={{y:-16,opacity:0,scale:.98}} animate={{y:0,opacity:1,scale:1}} exit={{y:-16,opacity:0,scale:.98}} onClick={e=>e.stopPropagation()}>
   <input ref={inputRef} value={query} onChange={e=>{setQuery(e.target.value);setSel(0);}} onKeyDown={onKey} placeholder="jump to a section, project or action…" aria-label="Search commands"/>
   <ul role="listbox">
    {list.map((c,i)=><li key={c.group+c.label} role="option" aria-selected={i===sel} className={i===sel?'active':''} onMouseEnter={()=>setSel(i)} onClick={()=>run(c)}><span className="palette-icon">{c.icon}</span>{c.label}<small>{c.group}</small></li>)}
    {!list.length&&<li className="palette-empty">nothing found. Glo is looking too 👀</li>}
   </ul>
   <div className="palette-foot"><span>↑↓ move</span><span>enter open</span><span>esc close</span></div>
  </motion.div>
 </motion.div>}</AnimatePresence>;
}
