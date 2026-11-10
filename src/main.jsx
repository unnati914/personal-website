import React,{useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {motion,AnimatePresence,MotionConfig,useScroll,useTransform,useReducedMotion,useMotionValueEvent} from 'framer-motion';
import {ArrowUpRight, Code2, BriefcaseBusiness, Mail} from 'lucide-react';
import {career,openSource} from './siteData';
import {featured} from './workData';
import Mascot from './Mascot';
import {speak,canSpeak,chime} from './voice';
import AskGlo from './AskGlo';
import CaseStudy from './CaseStudy';
import CommandPalette from './CommandPalette';
import {useKonami,Confetti} from './Secret';
import GtmCommunity from './GtmCommunity';
import {FeaturedWork,WritingTalks,Testimonials,RecruiterSummary} from './Sections';
import Play from './Play';
import {BuildLog,ForCompany,CaseStudyPage,MediaKit} from './Pages';
import './styles.css';

const offClock=['riding long highways','planning the next trip','hosting buildathons','building AI agents'];
const siteColors=[
 {name:'blush',color:'#ffb8d9'},
 {name:'lilac',color:'#d9c6ff'},
 {name:'peach',color:'#ffcfb0'},
 {name:'champagne',color:'#f6e2b3'},
 {name:'mint',color:'#bff0dc'}
];
const proof=[
 {n:'3+ yrs',label:'shipping AI & backend in production'},
 {n:'60K',label:'developers & builders following on X'},
 {n:'500',label:'registrations at my first dev conference'}
];
const readSound=()=>{try{return localStorage.getItem('sound')!=='off'}catch{return true}};
const readStore=(key,fallback)=>{try{return localStorage.getItem(key)??fallback}catch{return fallback}};
const writeStore=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
const countVisit=()=>{let n=Number(readStore('visits',0))||0; try{if(!sessionStorage.getItem('counted')){n+=1; writeStore('visits',n); sessionStorage.setItem('counted','1');}}catch{} return n||1;};
const visitGreeting=n=>n>1?`welcome back! visit #${n} 💖`:'hi, I’m Glo ✨ Unnati’s build buddy';
const statusLabels=['probably asleep 😴','chai + inbox ☕','building with AI','maybe out on a ride 🏍️','planning the next trip 🗺️'];
const indiaStatus=()=>{const now=new Date(); const time=now.toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'numeric',minute:'2-digit'}); const h=Number(now.toLocaleString('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',hour12:false})); const slot=h<7?0:h<10?1:h<19?2:h<22?3:4; return {time,slot,awake:h>=7};};
const path=window.location.pathname.replace(/\/+$/,'')||'/';
const isPlay=path==='/play';
const forMatch=path.match(/^\/for\/([a-z0-9-]+)$/);
const caseMatch=path.match(/^\/case\/([a-z0-9-]+)$/);
const isCollab=path==='/collab';
const isSub=isPlay||!!forMatch||!!caseMatch||isCollab;
const isHome=path==='/'||path==='/index.html';

function ScrollRoad(){
 const {scrollYProgress}=useScroll();
 const left=useTransform(scrollYProgress,v=>`calc(${v*100}% - ${v*34}px)`);
 const spin=useTransform(scrollYProgress,[0,1],[0,2880]);
 return <div className="road" aria-hidden="true"><motion.div className="road-done" style={{scaleX:scrollYProgress}}/><motion.svg className="bike" style={{left}} width="34" height="20" viewBox="0 0 34 20"><path d="M7 14 L13 7 H20 L24 3 M13 7 L18 14 H27 M20 7 L27 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 5 H16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><motion.g style={{rotate:spin}}><circle cx="7" cy="14" r="5" fill="var(--bg)" stroke="currentColor" strokeWidth="2"/><path d="M7 9 V19" stroke="currentColor" strokeWidth="1"/></motion.g><motion.g style={{rotate:spin}}><circle cx="27" cy="14" r="5" fill="var(--bg)" stroke="currentColor" strokeWidth="2"/><path d="M27 9 V19" stroke="currentColor" strokeWidth="1"/></motion.g></motion.svg></div>;
}
function OffClock({paused}){
 const [i,setI]=useState(0);
 useEffect(()=>{if(paused)return; const t=setInterval(()=>setI(n=>(n+1)%offClock.length),2400); return ()=>clearInterval(t);},[paused]);
 return <p className="off-clock">off the clock: <span className="off-clock-word"><AnimatePresence mode="wait"><motion.em key={offClock[i]} initial={{y:'100%',opacity:0}} animate={{y:0,opacity:1}} exit={{y:'-100%',opacity:0}} transition={{duration:.35}}>{offClock[i]}</motion.em></AnimatePresence></span></p>;
}
function ColorPicker({value,onChange}){
 return <div className="color-picker" role="radiogroup" aria-label="Site color">{siteColors.map(c=><button key={c.name} role="radio" aria-checked={value===c.name} aria-label={`site color: ${c.name}`} title={c.name} className={value===c.name?'swatch active':'swatch'} style={{background:c.color}} onClick={()=>onChange(c.name)}/>)}</div>;
}

function App(){
 const [ask,setAsk]=useState(false); const [selectedCareer,setSelectedCareer]=useState(0); const [guestNote,setGuestNote]=useState(''); const [recruiterView,setRecruiterView]=useState(false); const [accessibilityMode,setAccessibilityMode]=useState(false); const systemReduced=useReducedMotion(); const [showBuddy,setShowBuddy]=useState(false); const [sound,setSound]=useState(readSound); const [menuOpen,setMenuOpen]=useState(false);
 useEffect(()=>{if(!menuOpen)return; const close=e=>{if(e.type==='keydown'?e.key==='Escape':!e.target.closest('header'))setMenuOpen(false);}; window.addEventListener('pointerdown',close); window.addEventListener('keydown',close); return ()=>{window.removeEventListener('pointerdown',close); window.removeEventListener('keydown',close);};},[menuOpen]);
 const [caseStudy,setCaseStudy]=useState(null); const [outfit,setOutfit]=useState('');
 const [palette,setPalette]=useState(false); const [neon,setNeon]=useState(false); const [burst,setBurst]=useState(0); const [toast,setToast]=useState(''); const [visits]=useState(countVisit); const [status,setStatus]=useState(indiaStatus);
 const [siteColor,setSiteColor]=useState(()=>readStore('shade','blush'));
 const reduced=accessibilityMode||!!systemReduced;
 useEffect(()=>{const t=setInterval(()=>{setStatus(indiaStatus());},30000); return ()=>clearInterval(t);},[]);
 useEffect(()=>{document.documentElement.classList.remove('night'); try{localStorage.removeItem('theme')}catch{}},[]);
 useEffect(()=>{document.documentElement.classList.toggle('neon',neon);},[neon]);
 useEffect(()=>{const c=(siteColors.find(s=>s.name===siteColor)||siteColors[0]).color; document.documentElement.style.setProperty('--accent',c); writeStore('shade',siteColor);},[siteColor]);
 useEffect(()=>{if(!toast)return; const t=setTimeout(()=>setToast(''),3500); return ()=>clearTimeout(t);},[toast]);
 useEffect(()=>{const k=e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setPalette(p=>!p);}}; window.addEventListener('keydown',k); return ()=>window.removeEventListener('keydown',k);},[]);
 const toggleSound=()=>{const on=!sound; setSound(on); if(on){chime(); speak('Sound on!');}};
 useEffect(()=>{const outfits={garage:'helmet',travel:'shades'}; const seen=new Map(); const io=new IntersectionObserver(entries=>{entries.forEach(e=>seen.set(e.target.id,e.isIntersecting)); const id=Object.keys(outfits).find(k=>seen.get(k)); setOutfit(id?outfits[id]:'');},{rootMargin:'-35% 0px -35% 0px'}); Object.keys(outfits).forEach(id=>{const el=document.getElementById(id); if(el)io.observe(el);}); return ()=>io.disconnect();},[recruiterView]);
 const toggleSecret=()=>{const on=!neon; setNeon(on); if(on){if(!reduced)setBurst(b=>b+1); setToast('secret neon mode unlocked ✨ enter the code again to exit'); if(sound)speak('Secret mode unlocked!');} else setToast('back to normal. our secret 🤫');};
 useKonami(toggleSecret);
 const openCase=name=>setCaseStudy(career.find(c=>c.name===name)||null);
 const go=id=>{const el=document.getElementById(id); if(el)el.scrollIntoView({behavior:accessibilityMode?'auto':'smooth',block:'start'}); else window.location.href=`/#${id}`;};
 const commands=[
  ...[['top','home'],['work','selected work'],['career','career'],['gtm','gtm & community'],['writing','writing & talks'],['open-source','open source'],['contact','contact']].map(([id,label])=>({group:'go to',icon:'→',label,run:()=>go(id)})),
  {group:'go to',icon:'▤',label:'Hirvana case study',keywords:'founder gtm',run:()=>{window.location.href='/case/hirvana'}},
  {group:'go to',icon:'▤',label:'CodXCrypt case study',keywords:'community devrel',run:()=>{window.location.href='/case/codxcrypt'}},
  {group:'go to',icon:'✉',label:'media kit for brands',keywords:'collab brand sponsor rates',run:()=>{window.location.href='/collab'}},
  {group:'go to',icon:'✦',label:'play: garage, travel, failure archive',keywords:'fun bike travel beliefs',run:()=>{window.location.href='/play'}},
  ...featured.map(p=>({group:'project',icon:'◆',label:p.name,keywords:p.tag,run:()=>p.caseStudy?openCase(p.caseStudy):window.open(p.url,'_blank','noopener')})),
  {group:'action',icon:'✦',label:'ask unnati a question',keywords:'ask glo chat',run:()=>setAsk(true)},
  ...career.map(c=>({group:'case study',icon:'▤',label:`${c.name} case study`,keywords:c.role,run:()=>setCaseStudy(c)})),
  {group:'action',icon:'↓',label:'download resume',run:()=>window.open('/resume.pdf','_blank')},
  {group:'action',icon:'✉',label:'send an email',run:()=>{window.location.href='mailto:chhabraunnati234@gmail.com'}},
  {group:'action',icon:'↗',label:'open github',run:()=>window.open('https://github.com/unnati914','_blank','noopener')},
  {group:'action',icon:'↗',label:'open x (twitter)',run:()=>window.open('https://x.com/Unnati_twts','_blank','noopener')},
  {group:'action',icon:'↗',label:'open linkedin',run:()=>window.open('https://www.linkedin.com/in/unnati-chhabra-/','_blank','noopener')},
  {group:'setting',icon:'♪',label:sound?'turn sound off':'turn sound on',run:()=>toggleSound()},
  {group:'setting',icon:'◎',label:recruiterView?'full site':'recruiter view',run:()=>setRecruiterView(!recruiterView)},
  {group:'setting',icon:'Aa',label:accessibilityMode?'normal text':'accessibility mode',run:()=>setAccessibilityMode(!accessibilityMode)},
  ...siteColors.map(c=>({group:'site color',icon:'●',label:`site color: ${c.name}`,keywords:'color accent theme shade',run:()=>setSiteColor(c.name)}))
 ];
 useEffect(()=>{try{localStorage.setItem('sound',sound?'on':'off')}catch{} if(!sound&&canSpeak)speechSynthesis.cancel();},[sound]); const {scrollY}=useScroll(); useMotionValueEvent(scrollY,'change',v=>setShowBuddy(v>window.innerHeight*.7));
 const addGuestNote=e=>{e.preventDefault(); const text=guestNote.trim(); if(!text)return; setGuestNote(''); window.location.href=`mailto:chhabraunnati234@gmail.com?subject=${encodeURIComponent('Guestbook note from your website')}&body=${encodeURIComponent(text)}`;};
 if(!isHome&&!isSub)return <main className="not-found"><span className="section-label">404 · experiment escaped</span><h1>This page has entered its unexplained experiment era.</h1><p>No route found. The good news: this one is definitely not a product decision.</p><a className="primary" href="/">back to the actual website <ArrowUpRight size={18}/></a></main>;
 const h=id=>isHome?`#${id}`:`/#${id}`;
 return <MotionConfig reducedMotion={accessibilityMode?'always':'user'}><div className={`${recruiterView&&isHome?'app recruiter-view':'app'}${accessibilityMode?' accessibility-mode':''}`}>
  <header><a className="logo" href={isHome?'#top':'/'}>UC<span>.</span></a><nav><a href={h('work')}>work</a><a href={h('career')}>career</a><a href={h('gtm')}>gtm</a><a href={h('writing')}>writing</a><a href="/collab" className={isCollab?'nav-on':''}>collab</a><a href="/play" className={isPlay?'nav-on':''}>play</a><button onClick={()=>setAsk(true)}>ask unnati ↗</button><div id="site-settings" className={menuOpen?'settings open':'settings'}><div className="menu-links"><a href={h('work')}>work</a><a href={h('career')}>career</a><a href={h('gtm')}>gtm</a><a href={h('writing')}>writing</a><a href="/collab">collab · media kit</a><a href="/play">play</a></div>{isHome&&<button className="recruiter-toggle" onClick={()=>setRecruiterView(!recruiterView)}>{recruiterView?'full site':'recruiter view'}</button>}<button className="setting-toggle" aria-pressed={accessibilityMode} onClick={()=>setAccessibilityMode(!accessibilityMode)}>{accessibilityMode?'normal text':'accessibility'}</button><button className="setting-toggle" aria-pressed={sound} onClick={toggleSound}>{sound?'sound on':'sound off'}</button><ColorPicker value={siteColor} onChange={setSiteColor}/><button className="kbd-hint" onClick={()=>setPalette(true)} aria-label="Open command palette">⌘K</button></div><button className="menu-toggle" aria-expanded={menuOpen} aria-controls="site-settings" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'close ✕':'menu ☰'}</button></nav><ScrollRoad/></header>
  <main id="top">
  {isSub?(isPlay?<Play sound={sound} reduced={reduced}/>:forMatch?<ForCompany slug={forMatch[1]}/>:caseMatch?<CaseStudyPage slug={caseMatch[1]}/>:<MediaKit/>):<>
  <RecruiterSummary/>
  <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className={status.awake?'dot':'dot asleep'}/> {status.time} in India · {statusLabels[status.slot]}</div><a className="open-to-work" href="mailto:chhabraunnati234@gmail.com?subject=Hi%20Unnati">● open to AI engineering, DevRel & GTM roles ↗</a><h1>I build <em>AI systems</em>,<br/>agents & products<br/>that actually ship.</h1><OffClock paused={reduced}/><p className="lede">I’m Unnati Chhabra, an AI engineer working across GenAI, agentic systems and backend. I also do the other half: DevRel, launches and developer communities.</p><div className="actions"><a className="primary" href="#work">explore my work <ArrowUpRight size={18}/></a><a className="secondary" href="mailto:chhabraunnati234@gmail.com">say hi <Mail size={16}/></a><a className="secondary" href="/resume.pdf" download>resume <ArrowUpRight size={16}/></a></div><div className="proof">{proof.map(p=><div key={p.label}><strong>{p.n}</strong><span>{p.label}</span></div>)}</div></div><div className="hero-mascot"><Mascot voice={sound} greeting={visitGreeting(visits)} onSecret={toggleSecret}/></div><div className="scroll">↓ scroll to explore</div></section>
  <section className="now"><div className="section-label">01 / now</div><div className="now-grid"><div><h2>what’s cooking</h2><p>A snapshot of what I’m actually building and shipping right now.</p><BuildLog/></div><a className="status-card" href="https://x.com/Unnati_twts/status/2118330495675380202" target="_blank" rel="noreferrer"><div><span className="pill live">● building</span><h3>Imlea</h3><p>A learning app for school kids, with memory, adaptive paths and answers grounded in the curriculum. Open for testing.</p></div><span className="arrow">↗</span></a><a className="status-card" href="https://x.com/Unnati_twts/status/2113642488779198956" target="_blank" rel="noreferrer"><div><span className="pill">● shipping weekly</span><h3>demo-first pitches</h3><p>Instead of a cover letter, I build a working demo for teams I’d love to join. So far: Wavelength, Emergent, Agnost and Prodigal.</p></div><span className="arrow">↗</span></a></div></section>
  <FeaturedWork onCaseStudy={openCase}/>
  <section id="career" className="career"><div className="section-label">03 / career graph</div><h2>different problems.<br/><span>same obsession.</span></h2><div className="timeline">{career.map((c,i)=><motion.div className={selectedCareer===i?'career-row selected':'career-row'} key={c.name} role="button" tabIndex="0" initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.5,delay:i*.14}} onClick={()=>setSelectedCareer(i)} onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&setSelectedCareer(i)}><div className="year">{c.year}</div><div className="node">{i===0?'✦':'·'}</div><div className="career-copy"><h3>{c.name}</h3><strong>{c.role}</strong><p>{c.detail}</p><div className="career-impact"><span>impact</span>{c.impact}</div><div className="career-stack">{c.stack.map(t=><span key={t}>{t}</span>)}</div><button className="case-link" onClick={e=>{e.stopPropagation();setCaseStudy(c);}}>read the case study →</button></div></motion.div>)}</div><p className="edu-line"><strong>education</strong> B.Tech in Information Technology, IGDTUW, Delhi · 2019 to 2023 · CGPA 8.01</p></section>
  <GtmCommunity/>
  <section className="collab-strip"><a href="/collab" className="collab-card"><div><span className="pill live">● for brands</span><h3>Want to reach 60K developers and builders?</h3><p>See my media kit: audience, past brands, formats and rates. Posts from $200, quote posts from $100.</p></div><span className="collab-cta">see the media kit ↗</span></a></section>
  <section className="skills recruiter-only"><div className="section-label">skills</div><h2>tools for turning<br/><span>ideas into systems.</span></h2><div className="skill-list">{['Python','Java','JavaScript','SQL','LLMs','RAG','Prompt Engineering','pgvector','Agentic Systems','REST APIs','Redis','PostgreSQL','Node.js','React','Next.js','Streamlit','Docker','Kubernetes','CI/CD','DevRel','Technical writing','Public speaking','Community building','Launch campaigns'].map(skill=><span key={skill}>{skill}</span>)}</div></section>
  <WritingTalks/>
  <Testimonials/>
  <section id="open-source" className="open-source"><div className="section-label">06 / open source</div><div className="open-source-grid"><div><h2>share the<br/><span>work.</span></h2><p>Public projects, community work, and contributions collected from GitHub.</p><div className="opensource-note"><strong>Community</strong><span>Ex-DevRel at AssetMantle, Keploy, Zenduty and Tezos India · Founder of CodXCrypt · GitHub Campus Expert · Former LFX Mentee</span><a href="#gtm">see gtm & community work ↑</a><a href="https://github.com/unnati914" target="_blank" rel="noreferrer">view GitHub profile ↗</a></div></div><div className="projects open-source-projects">{openSource.map((project,index)=><a className="project open-source-project" href={project.url} target="_blank" rel="noreferrer" key={project.name}><div className="project-top"><span>0{index+1}</span><span className="tag">github</span></div><h3>{project.name}<ArrowUpRight size={20}/></h3><p>{project.desc}</p><small>{project.tech}</small></a>)}</div></div></section>
  <section className="off-strip"><div className="section-label">off the clock</div><a href="/play" className="off-card"><div><h3>the fun stuff lives on <em>/play</em></h3><p>My bike garage and a mini game, the travel log, things I believe, a failure archive and a few toys.</p></div><span className="arrow">↗</span></a></section>
  </>}
  <section id="contact" className="contact"><div className="section-label">{isSub?'say hi':'07 / contact'}</div><h2>building something<br/><em>interesting?</em></h2><p>{'Send a hello. Tell me what you\'re building. Or just say hi as a person.'}</p><div className="contact-links"><a href="mailto:chhabraunnati234@gmail.com">email <Mail size={16}/></a><a href="https://x.com/Unnati_twts" target="_blank" rel="noreferrer">x · 60K <ArrowUpRight size={16}/></a><a href="https://www.linkedin.com/in/unnati-chhabra-/" target="_blank" rel="noreferrer">linkedin <BriefcaseBusiness size={16}/></a><a href="https://github.com/unnati914" target="_blank" rel="noreferrer">github <Code2 size={16}/></a><a href="https://www.instagram.com/unnatiisig/" target="_blank" rel="noreferrer">instagram <span className="instagram-icon" aria-hidden="true"><i/></span></a><a href="/collab">brands: media kit ↗</a></div><div className="guestbook"><div><div className="section-label">leave a note</div><h3>what should I build next?</h3></div><form onSubmit={addGuestNote}><input value={guestNote} maxLength="180" onChange={e=>setGuestNote(e.target.value)} placeholder="a thought, idea, or hello..."/><button type="submit">email this note ↗</button></form></div></section>
  </main>
  <footer><span>© 2026 unnati chhabra</span><span>built with curiosity + too many tabs · <a href="/play">play</a> · <a href="/collab">collab</a></span><div className="footer-links"><a href="https://x.com/Unnati_twts" target="_blank" rel="noreferrer">x</a><a href="https://www.linkedin.com/in/unnati-chhabra-/" target="_blank" rel="noreferrer">linkedin</a><a href="https://github.com/unnati914" target="_blank" rel="noreferrer">github</a><a href="mailto:chhabraunnati234@gmail.com">email</a><a href="https://www.instagram.com/unnatiisig/" target="_blank" rel="noreferrer">instagram <span className="instagram-icon" aria-hidden="true"><i/></span></a></div></footer>
  <AnimatePresence>{showBuddy&&!ask&&<motion.div className="buddy" initial={{opacity:0,y:40,scale:.6}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:40,scale:.6}}><Mascot mini voice={sound} outfit={outfit} onClick={()=>setAsk(true)} label="Ask Unnati a question"/></motion.div>}</AnimatePresence>
  <div className="aurora" aria-hidden="true"><i/><i/><i/></div>
  <AskGlo open={ask} onClose={()=>setAsk(false)} sound={sound}/>
  <CaseStudy role={caseStudy} onClose={()=>setCaseStudy(null)}/>
  <CommandPalette open={palette} onClose={()=>setPalette(false)} commands={commands}/>
  <Confetti burst={burst}/>
  <AnimatePresence>{toast&&<motion.div className="toast" role="status" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:30,opacity:0}}>{toast}</motion.div>}</AnimatePresence>
 </div></MotionConfig>
}
createRoot(document.getElementById('root')).render(<App/>);
