import React from 'react';
import {motion} from 'framer-motion';
import {ArrowUpRight, Printer, Mail} from 'lucide-react';
import {featured,talks,writing,testimonials} from './workData';

export function FeaturedWork({onCaseStudy}){
 return <section id="work" className="work"><div className="section-label">02 / selected work</div><h2>things I’ve built<br/><span>& shipped</span></h2>
  <div className="feature-grid">{featured.map((p,i)=>{
   const Tag=p.caseStudy?motion.button:motion.a;
   const props=p.caseStudy?{type:'button',onClick:()=>onCaseStudy(p.caseStudy)}:{href:p.url,...(/^https?:/.test(p.url)?{target:'_blank',rel:'noreferrer'}:{})};
   return <Tag key={p.name} className="feature" {...props} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}}>
    <div className="feature-media">{p.img?<img src={p.img} alt={`${p.name} screenshot`} loading="lazy"/>:<div className="feature-big"><strong>{p.big}</strong><span>{p.small}</span></div>}</div>
    <div className="feature-body"><div className="project-top"><span>0{i+1}</span><span className="tag">{p.tag}</span></div><h3>{p.name}<ArrowUpRight size={20}/></h3><p>{p.desc}</p><div className="feature-result">{p.result}</div><span className="project-cta">{p.cta} ↗</span></div>
   </Tag>;})}</div>
 </section>;
}

export function WritingTalks(){
 const List=({items})=><ul className="gtm-list">{items.map(it=><li key={it.name}><a href={it.url} target="_blank" rel="noreferrer"><div><h3>{it.name}</h3><p>{it.what}</p></div>{it.kind?<span className="gtm-metric">{it.kind}</span>:<span className="gtm-metric-empty"/>}<ArrowUpRight className="gtm-arrow" size={18}/></a></li>)}</ul>;
 return <section id="writing" className="gtm writing"><div className="section-label">05 / writing & talks</div>
  <div className="gtm-head"><h2>explaining things<br/><span>is half the job.</span></h2><p>Talks at developer events, plus tutorials, threads and videos that break down AI and careers in plain words.</p></div>
  <div className="writing-grid"><div><h3 className="writing-sub">talks</h3><List items={talks}/></div><div><h3 className="writing-sub">writing & video</h3><List items={writing}/></div></div>
 </section>;
}

export function Testimonials(){
 if(!testimonials.length)return null;
 return <section className="testimonials"><div className="section-label">kind words</div><div className="quote-grid">{testimonials.map(t=><figure key={t.name} className="quote"><blockquote>“{t.quote}”</blockquote><figcaption><strong>{t.url?<a href={t.url} target="_blank" rel="noreferrer">{t.name}</a>:t.name}</strong><span>{t.role}</span></figcaption></figure>)}</div></section>;
}

export function RecruiterSummary(){
 return <section className="recruiter-summary recruiter-only">
  <div className="rs-top"><div><h1>Unnati Chhabra</h1><p className="rs-role">AI Engineer · DevRel · Delhi, India</p></div><button className="primary rs-print" onClick={()=>window.print()}><Printer size={16}/> print / save as PDF</button></div>
  <p className="rs-links"><a href="mailto:chhabraunnati234@gmail.com"><Mail size={14}/> chhabraunnati234@gmail.com</a><a href="https://www.unnati-chhabra.xyz">unnati-chhabra.xyz</a><a href="https://www.linkedin.com/in/unnati-chhabra-/">linkedin.com/in/unnati-chhabra-</a><a href="https://github.com/unnati914">github.com/unnati914</a><a href="https://x.com/Unnati_twts">x.com/Unnati_twts</a></p>
  <p className="rs-summary">AI engineer with 3+ years building production systems: GenAI agents and RAG at Grid Dynamics, payments at Paysecure, and ordering and OCR at Zomato. Also ex-DevRel (AssetMantle, Keploy, Zenduty, Tezos India), founder of the CodXCrypt community, and 60K followers on X.</p>
  <div className="rs-stats"><div><strong>200–300</strong><span>users on the VISA GenAI agent</span></div><div><strong>~70%</strong><span>of Zomato HyperPure GMV through Parchi Orders</span></div><div><strong>60K</strong><span>followers on X</span></div><div><strong>500</strong><span>registrations for my dev conference</span></div></div>
 </section>;
}
