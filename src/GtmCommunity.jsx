import React,{useState} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import {ArrowUpRight} from 'lucide-react';
import {reach,gtmTabs} from './gtmData';

export default function GtmCommunity(){
 const [tab,setTab]=useState(gtmTabs[0].id);
 const active=gtmTabs.find(t=>t.id===tab);
 const onKey=e=>{const i=gtmTabs.findIndex(t=>t.id===tab); const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0; if(!d)return; e.preventDefault(); const next=gtmTabs[(i+d+gtmTabs.length)%gtmTabs.length]; setTab(next.id); document.getElementById(`gtm-tab-${next.id}`)?.focus();};
 return <section id="gtm" className="gtm">
  <div className="section-label">04 / gtm & community</div>
  <div className="gtm-head"><h2>I also get people<br/><span>to show up.</span></h2><p>Before and alongside engineering, I’ve done DevRel, run launches, made brand campaigns and built communities. Every item below links to the real post.</p></div>
  <div className="reach">{reach.map((r,i)=>{const Tag=r.url?'a':'div'; return <motion.div key={r.label} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}><Tag className="reach-card" {...(r.url?{href:r.url,target:'_blank',rel:'noreferrer'}:{})}><strong>{r.n}</strong><span>{r.label}</span></Tag></motion.div>})}</div>
  <div className="gtm-tabs" role="tablist" aria-label="GTM and community work" onKeyDown={onKey}>{gtmTabs.map(t=><button key={t.id} id={`gtm-tab-${t.id}`} role="tab" aria-selected={tab===t.id} aria-controls="gtm-panel" tabIndex={tab===t.id?0:-1} className={tab===t.id?'active':''} onClick={()=>setTab(t.id)}>{t.label}<small>{t.items.length}</small></button>)}</div>
  <div id="gtm-panel" role="tabpanel" aria-labelledby={`gtm-tab-${tab}`}>
   <p className="gtm-intro">{active.intro}</p>
   <AnimatePresence mode="wait"><motion.ul key={tab} className="gtm-list" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.25}}>
    {active.items.map(it=><li key={it.name}><a href={it.url} {...(/^https?:/.test(it.url)?{target:'_blank',rel:'noreferrer'}:{})}><div><h3>{it.name}</h3><p>{it.what}</p></div>{it.metric?<span className="gtm-metric">{it.metric}</span>:<span className="gtm-metric-empty"/>}<ArrowUpRight className="gtm-arrow" size={18}/></a></li>)}
   </motion.ul></AnimatePresence>
  </div>
 </section>;
}
