import React,{useEffect} from 'react';
import {motion} from 'framer-motion';
import {ArrowUpRight, Mail, Play as PlayIcon} from 'lucide-react';
import {featured} from './workData';
import {buildLog,companies,caseStudies,mediaKit} from './pagesData';

const ext=u=>/^https?:/.test(u)?{target:'_blank',rel:'noreferrer'}:{};
const fmt=d=>new Date(d+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'});
function useMeta(title,noindex){useEffect(()=>{document.title=title; let m=document.querySelector('meta[name=robots]'); if(noindex){if(!m){m=document.createElement('meta');m.name='robots';document.head.appendChild(m);} m.content='noindex';}},[title,noindex]);}
const Missing=()=><section className="page-hero"><div className="section-label">404</div><h1>Nothing here yet.</h1><p className="lede"><a href="/">Back to the site ↗</a></p></section>;

export function BuildLog({limit=4}){
 return <div className="build-log"><div className="build-log-head"><strong>build log</strong><span>one line a week</span></div><ol>{buildLog.slice(0,limit).map(e=><li key={e.date+e.text}><time dateTime={e.date}>{fmt(e.date)}</time>{e.url?<a href={e.url} {...ext(e.url)}>{e.text} <ArrowUpRight size={13}/></a>:<span>{e.text}</span>}</li>)}</ol></div>;
}

export function ForCompany({slug}){
 const c=companies[slug]; useMeta(c?`Unnati Chhabra for ${c.name}`:'Not found',true);
 if(!c)return <Missing/>;
 const picks=c.projects.map(n=>featured.find(f=>f.name===n)).filter(Boolean);
 return <>
  <section className="page-hero"><div className="section-label">for {c.name.toLowerCase()} · {c.role}</div><h1>Hi {c.name} 👋<br/><em>I built you something.</em></h1><p className="lede">Instead of a cover letter, here’s a working demo of what I’d bring to {c.name}. Built by me with sample data. It isn’t your product and isn’t affiliated with you.</p><div className="actions"><a className="primary" href={c.demo.live} target="_blank" rel="noreferrer">open the live demo <ArrowUpRight size={18}/></a><a className="secondary" href={c.demo.video} target="_blank" rel="noreferrer">watch the video <PlayIcon size={15}/></a><a className="secondary" href={`mailto:chhabraunnati234@gmail.com?subject=${encodeURIComponent(`Hi Unnati, from ${c.name}`)}`}>email me <Mail size={16}/></a></div></section>
  <section className="page-block"><a className="demo-shot" href={c.demo.live} target="_blank" rel="noreferrer"><img src={c.demo.img} alt={`${c.demo.title} screenshot`}/><span>{c.demo.title} ↗</span></a></section>
  <section className="page-block two-col"><div><div className="section-label">what I built</div><ul className="tick-list">{c.built.map(b=><li key={b}>{b}</li>)}</ul></div><div><div className="section-label">why I fit</div><ul className="tick-list">{c.fit.map(b=><li key={b}>{b}</li>)}</ul></div></section>
  <section className="page-block"><div className="section-label">3 things I’ve shipped that matter here</div><div className="mini-feature-grid">{picks.map(p=><a key={p.name} className="mini-feature" href={p.caseStudy?'/#career':p.url} {...ext(p.url||'')}><h3>{p.name} <ArrowUpRight size={16}/></h3><p>{p.desc}</p><div className="feature-result">{p.result}</div></a>)}</div></section>
  <section className="page-block page-cta"><h2>Can we talk?</h2><p>I’m open to {c.role} roles. Reply to this link, or reach me any of these ways.</p><div className="actions"><a className="primary" href={`mailto:chhabraunnati234@gmail.com?subject=${encodeURIComponent(`Hi Unnati, from ${c.name}`)}`}>email me <Mail size={16}/></a><a className="secondary" href="/resume.pdf" download>resume <ArrowUpRight size={16}/></a><a className="secondary" href="/">full portfolio <ArrowUpRight size={16}/></a></div></section>
 </>;
}

export function CaseStudyPage({slug}){
 const c=caseStudies[slug]; useMeta(c?`${c.name} case study · Unnati Chhabra`:'Not found');
 if(!c)return <Missing/>;
 return <>
  <section className="page-hero"><div className="section-label">case study · {c.kicker} · {c.years}</div><h1>{c.name}</h1><p className="lede big">{c.oneLiner}</p></section>
  <section className="page-block"><div className="reach">{c.stats.map(s=><div key={s.l} className="reach-card"><strong>{s.n}</strong><span>{s.l}</span></div>)}</div></section>
  <section className="page-block"><div className="section-label">the problem</div><p className="prose">{c.problem}</p></section>
  <section className="page-block"><div className="section-label">what I did</div><ol className="steps-list">{c.did.map((d,i)=><motion.li key={d.h} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}}><span className="step-n">0{i+1}</span><div><h3>{d.h}</h3><p>{d.p}</p>{d.url&&<a href={d.url} {...ext(d.url)}>see it ↗</a>}</div></motion.li>)}</ol></section>
  <section className="page-block"><div className="section-label">what I’d do differently</div><ul className="tick-list">{c.differently.map(d=><li key={d}>{d}</li>)}</ul></section>
  <section className="page-block page-cta"><h2>Want this for your team?</h2><p>I’m open to AI engineering, DevRel and GTM roles.</p><div className="actions"><a className="primary" href="mailto:chhabraunnati234@gmail.com">email me <Mail size={16}/></a><a className="secondary" href={slug==='hirvana'?'/case/codxcrypt':'/case/hirvana'}>next case study <ArrowUpRight size={16}/></a><a className="secondary" href="/#gtm">all GTM work <ArrowUpRight size={16}/></a></div></section>
 </>;
}

export function MediaKit(){
 const k=mediaKit; useMeta('Work with Unnati · media kit');
 const mail=`mailto:${k.email}?subject=${encodeURIComponent('Brand collaboration')}&body=${encodeURIComponent('Brand / product:\nWhat you want to promote:\nFormat (thread, demo, video, event):\nTimeline:\nBudget:\n')}`;
 return <>
  <section className="page-hero"><div className="section-label">media kit · brand collaborations</div><h1>Reach developers<br/><em>who actually build.</em></h1><p className="lede">{k.who}</p><div className="actions"><a className="primary" href={mail}>start a collab <Mail size={16}/></a><a className="secondary" href="https://x.com/Unnati_twts" target="_blank" rel="noreferrer">see my X <ArrowUpRight size={16}/></a></div></section>
  <section className="page-block"><div className="reach">{k.audience.map(a=>{const T=a.url?'a':'div'; return <T key={a.l} className="reach-card" {...(a.url?{href:a.url,target:'_blank',rel:'noreferrer'}:{})}><strong>{a.n}</strong><span>{a.l}</span></T>})}</div></section>
  <section className="page-block"><div className="section-label">brands I’ve worked with</div><div className="brand-row">{k.brands.map(b=><span key={b}>{b}</span>)}</div></section>
  <section className="page-block"><div className="section-label">what I make</div><div className="format-grid">{k.formats.map(f=><div key={f.h} className="format"><h3>{f.h}</h3><p>{f.p}</p></div>)}</div></section>
  <section className="page-block" id="rates"><div className="section-label">rates</div><div className="rate-grid">{k.rates.map(r=><div key={r.h} className="rate"><span>{r.h}</span><strong>{r.price}</strong><p>{r.p}</p></div>)}</div><p className="fine">Prices in USD. Paid posts are marked as a collaboration.</p></section>
  <section className="page-block"><div className="section-label">top brand posts</div><ul className="gtm-list">{k.top.map(t=><li key={t.name}><a href={t.url} target="_blank" rel="noreferrer"><div><h3>{t.name}</h3></div><span className="gtm-metric">{t.metric}</span><ArrowUpRight className="gtm-arrow" size={18}/></a></li>)}</ul><p className="fine">All campaign links are on the <a href="/#gtm">GTM & community</a> section.</p></section>
  <section className="page-block page-cta"><h2>Let’s make something people share.</h2><p>$200 for a post, $100 for a quote post, custom quotes for everything else. Send the brief and I’ll reply within 2 days.</p><div className="actions"><a className="primary" href={mail}>send a brief <Mail size={16}/></a></div></section>
 </>;
}
