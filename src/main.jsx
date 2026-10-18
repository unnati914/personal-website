import React,{useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {motion,AnimatePresence,MotionConfig,useScroll,useTransform,useReducedMotion,useMotionValueEvent} from 'framer-motion';
import {ArrowUpRight, Code2, BriefcaseBusiness, Mail} from 'lucide-react';
import {projects,career,openSource} from './siteData';
import Mascot from './Mascot';
import Garage from './Garage';
import {speak,canSpeak,chime} from './voice';
import AskGlo from './AskGlo';
import CaseStudy from './CaseStudy';
import CursorTrail from './CursorTrail';
import CommandPalette from './CommandPalette';
import TravelLog from './TravelLog';
import {useKonami,Confetti} from './Secret';
import Beliefs from './Beliefs';
import BeautyLab from './BeautyLab';
import './styles.css';

const failures=[
 {name:'X dating',idea:'Build for dating on X.',outcome:'It stayed an experiment instead of becoming a shipped product.',lesson:'Interesting questions are still useful, even when the product does not continue.'},
 {name:'built it in 24 hours',idea:'Move fast and test the idea immediately.',outcome:'The prototype worked, then the next problem was scaling it.',lesson:'A fast first version is only the beginning of the real problem.'},
 {name:'technically worked',idea:'Solve the problem well enough to ship.',outcome:'It worked, but nobody cared enough to use it.',lesson:'A working product still needs a reason for people to return.'},
 {name:'questionable idea',idea:'Follow the strange idea and see what happens.',outcome:'It was still shipped, even if it was not the right idea.',lesson:'Shipping creates better evidence than protecting an idea forever.'}
];
const excuseLines=[
 'The project is almost done. One tiny detail remains.',
 'The feature works perfectly, as long as nobody clicks anything unexpected.',
 'It is not delayed. It is collecting highly valuable feedback from reality.',
 'The project is 90% done. The remaining 10% has formed a committee.'
];
const vibeChecks=[
 'Vibe check: deployable. Confidence: suspiciously high.',
 'Diagnostics complete. One more tab has been opened for research.',
 'All systems nominal. The CSS has requested a meeting.',
 'Build passed. Product scope has quietly doubled.'
];
const offClock=['riding long highways','planning the next trip','testing beauty tech','building AI agents'];
const shades=[
 {name:'blush',color:'#ffb8d9'},
 {name:'lilac',color:'#d9c6ff'},
 {name:'peach',color:'#ffcfb0'},
 {name:'champagne',color:'#f6e2b3'},
 {name:'mint',color:'#bff0dc'}
];
const readSound=()=>{try{return localStorage.getItem('sound')!=='off'}catch{return true}};
const readStore=(key,fallback)=>{try{return localStorage.getItem(key)??fallback}catch{return fallback}};
const writeStore=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
const countVisit=()=>{let n=Number(readStore('visits',0))||0; try{if(!sessionStorage.getItem('counted')){n+=1; writeStore('visits',n); sessionStorage.setItem('counted','1');}}catch{} return n||1;};
const visitGreeting=n=>n>1?`welcome back! visit #${n} 💖`:'hi, I’m Glo ✨ Unnati’s build buddy';
const statusLabels=['probably asleep 😴','chai + inbox ☕','building with AI','maybe out on a ride 🏍️','planning the next trip 🗺️'];
const indiaStatus=()=>{const now=new Date(); const time=now.toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'numeric',minute:'2-digit'}); const h=Number(now.toLocaleString('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',hour12:false})); const slot=h<7?0:h<10?1:h<19?2:h<22?3:4; return {time,slot,awake:h>=7};};
const isNightHour=()=>{const h=new Date().getHours(); return h>=19||h<6;};
const readShade=()=>{try{return localStorage.getItem('shade')||'blush'}catch{return 'blush'}};
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
function App(){
 const [ask,setAsk]=useState(false); const [selectedCareer,setSelectedCareer]=useState(0); const [guestNote,setGuestNote]=useState(''); const [recruiterView,setRecruiterView]=useState(false); const [accessibilityMode,setAccessibilityMode]=useState(false); const [alternateReality,setAlternateReality]=useState(false); const [quizChoice,setQuizChoice]=useState(''); const [quizAnswered,setQuizAnswered]=useState(false); const [fortune,setFortune]=useState(''); const [excuse,setExcuse]=useState(''); const [excuseIndex,setExcuseIndex]=useState(0); const [vibeCheck,setVibeCheck]=useState(''); const [vibeIndex,setVibeIndex]=useState(0); const [shade,setShade]=useState(readShade); const systemReduced=useReducedMotion(); const [showBuddy,setShowBuddy]=useState(false); const [sound,setSound]=useState(readSound); const [menuOpen,setMenuOpen]=useState(false);
 useEffect(()=>{if(!menuOpen)return; const close=e=>{if(e.type==='keydown'?e.key==='Escape':!e.target.closest('header'))setMenuOpen(false);}; window.addEventListener('pointerdown',close); window.addEventListener('keydown',close); return ()=>{window.removeEventListener('pointerdown',close); window.removeEventListener('keydown',close);};},[menuOpen]);
 const [caseStudy,setCaseStudy]=useState(null); const [outfit,setOutfit]=useState('');
 const [palette,setPalette]=useState(false); const [themePref,setThemePref]=useState(()=>readStore('theme','auto')); const [nightHour,setNightHour]=useState(isNightHour); const [neon,setNeon]=useState(false); const [burst,setBurst]=useState(0); const [toast,setToast]=useState(''); const [visits]=useState(countVisit); const [status,setStatus]=useState(indiaStatus);
 const night=themePref==='night'||(themePref==='auto'&&nightHour);
 useEffect(()=>{const t=setInterval(()=>{setStatus(indiaStatus());setNightHour(isNightHour());},30000); return ()=>clearInterval(t);},[]);
 useEffect(()=>{document.documentElement.classList.toggle('night',night); writeStore('theme',themePref);},[night,themePref]);
 useEffect(()=>{document.documentElement.classList.toggle('neon',neon);},[neon]);
 useEffect(()=>{if(!toast)return; const t=setTimeout(()=>setToast(''),3500); return ()=>clearTimeout(t);},[toast]);
 useEffect(()=>{const k=e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setPalette(p=>!p);}}; window.addEventListener('keydown',k); return ()=>window.removeEventListener('keydown',k);},[]);
 const toggleSound=()=>{const on=!sound; setSound(on); if(on){chime(); speak('Sound on!');}};
 useEffect(()=>{const outfits={garage:'helmet',travel:'shades','beauty-lab':'labcoat'}; const seen=new Map(); const io=new IntersectionObserver(entries=>{entries.forEach(e=>seen.set(e.target.id,e.isIntersecting)); const id=Object.keys(outfits).find(k=>seen.get(k)); setOutfit(id?outfits[id]:'');},{rootMargin:'-35% 0px -35% 0px'}); Object.keys(outfits).forEach(id=>{const el=document.getElementById(id); if(el)io.observe(el);}); return ()=>io.disconnect();},[recruiterView]);
 const cycleTheme=()=>setThemePref(p=>({auto:'day',day:'night',night:'auto'})[p]);
 const toggleSecret=()=>{const on=!neon; setNeon(on); if(on){if(!accessibilityMode&&!systemReduced)setBurst(b=>b+1); setToast('secret neon mode unlocked ✨ enter the code again to exit'); if(sound)speak('Secret mode unlocked!');} else setToast('back to normal. our secret 🤫');};
 useKonami(toggleSecret);
 const go=id=>document.getElementById(id)?.scrollIntoView({behavior:accessibilityMode?'auto':'smooth',block:'start'});
 const commands=[
  ...[['top','home'],['work','selected work'],['career','career'],['open-source','open source'],['lab','failure archive'],['beliefs','things I believe'],['garage','the garage'],['travel','travel log'],['beauty-lab','beauty lab: lipstick try-on + shade matcher'],['contact','contact']].map(([id,label])=>({group:'go to',icon:'→',label,run:()=>go(id)})),
  ...projects.map(p=>({group:'project',icon:'◆',label:p.name,keywords:p.tag,run:()=>p.url?window.open(p.url,'_blank','noopener'):go('work')})),
  {group:'action',icon:'✦',label:'ask unnati a question',keywords:'ask glo chat',run:()=>setAsk(true)},
  ...career.map(c=>({group:'case study',icon:'▤',label:`${c.name} case study`,keywords:c.role,run:()=>setCaseStudy(c)})),
  {group:'action',icon:'🏍',label:'play glo’s highway dash',keywords:'game bike',run:()=>document.querySelector('.glo-ride')?.scrollIntoView({behavior:'smooth',block:'center'})},
  {group:'action',icon:'↓',label:'download resume',run:()=>window.open('/resume.pdf','_blank')},
  {group:'action',icon:'✉',label:'send an email',run:()=>{window.location.href='mailto:chhabraunnati234@gmail.com'}},
  {group:'action',icon:'↗',label:'open github',run:()=>window.open('https://github.com/unnati914','_blank','noopener')},
  {group:'action',icon:'↗',label:'open linkedin',run:()=>window.open('https://www.linkedin.com/in/unnati-chhabra-/','_blank','noopener')},
  {group:'setting',icon:night?'☀':'☾',label:`theme: ${themePref} (switch)`,keywords:'dark night day mode',run:cycleTheme},
  {group:'setting',icon:'♪',label:sound?'turn sound off':'turn sound on',run:()=>toggleSound()},
  {group:'setting',icon:'◎',label:recruiterView?'full site':'recruiter view',run:()=>setRecruiterView(!recruiterView)},
  {group:'setting',icon:'Aa',label:accessibilityMode?'normal text':'accessibility mode',run:()=>setAccessibilityMode(!accessibilityMode)},
  ...shades.map(sh=>({group:'shade',icon:'●',label:`try on ${sh.name}`,keywords:'color lipstick',run:()=>setShade(sh.name)}))
 ];
 useEffect(()=>{try{localStorage.setItem('sound',sound?'on':'off')}catch{} if(!sound&&canSpeak)speechSynthesis.cancel();},[sound]); const {scrollY}=useScroll(); useMotionValueEvent(scrollY,'change',v=>setShowBuddy(v>window.innerHeight*.7));
 useEffect(()=>{const c=(shades.find(s=>s.name===shade)||shades[0]).color; document.documentElement.style.setProperty('--accent',c); try{localStorage.setItem('shade',shade)}catch{}},[shade]);
 const addGuestNote=e=>{e.preventDefault(); const text=guestNote.trim(); if(!text)return; setGuestNote(''); window.location.href=`mailto:chhabraunnati234@gmail.com?subject=${encodeURIComponent('Guestbook note from your website')}&body=${encodeURIComponent(text)}`;};
 const showFortune=()=>setFortune(failures[Math.floor(Math.random()*failures.length)].lesson);
 const generateExcuse=()=>{setExcuse(excuseLines[excuseIndex%excuseLines.length]);setExcuseIndex(excuseIndex+1);};
 const runVibeCheck=()=>{setVibeCheck(vibeChecks[vibeIndex%vibeChecks.length]);setVibeIndex(vibeIndex+1);};
 const isNotFound=window.location.pathname!=='/'&&window.location.pathname!=='/index.html';
 if(isNotFound)return <main className="not-found"><span className="section-label">404 · experiment escaped</span><h1>This page has entered its unexplained experiment era.</h1><p>No route found. The good news: this one is definitely not a product decision.</p><a className="primary" href="/">back to the actual website <ArrowUpRight size={18}/></a></main>;
 return <MotionConfig reducedMotion={accessibilityMode?'always':'user'}><div className={`${recruiterView?'app recruiter-view':'app'}${accessibilityMode?' accessibility-mode':''}`}>
  <header><a className="logo" href="#top">UC<span>.</span></a><nav><a href="#work">work</a><a href="#career">career</a><a href="#lab">lab</a><button onClick={()=>setAsk(true)}>ask unnati ↗</button><div id="site-settings" className={menuOpen?'settings open':'settings'}><button className="recruiter-toggle" onClick={()=>setRecruiterView(!recruiterView)}>{recruiterView?'full site':'recruiter view'}</button><button className="setting-toggle" aria-pressed={accessibilityMode} onClick={()=>setAccessibilityMode(!accessibilityMode)}>{accessibilityMode?'normal text':'accessibility'}</button><button className="setting-toggle" aria-pressed={sound} onClick={toggleSound}>{sound?'sound on':'sound off'}</button><button className="setting-toggle" onClick={cycleTheme} aria-label={`Theme: ${themePref}. Click to switch.`}>{themePref==='auto'?(night?'☾ auto':'☀ auto'):themePref==='night'?'☾ night':'☀ day'}</button><button className="kbd-hint" onClick={()=>setPalette(true)} aria-label="Open command palette">⌘K</button></div><button className="menu-toggle" aria-expanded={menuOpen} aria-controls="site-settings" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'close ✕':'menu ☰'}</button></nav><ScrollRoad/></header>
  <main id="top">
  <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className={status.awake?'dot':'dot asleep'}/> {status.time} in India · {statusLabels[status.slot]}</div><h1>I build <em>AI systems</em>,<br/>agents & products<br/>that actually ship.</h1><OffClock paused={accessibilityMode||systemReduced}/><p className="lede">I’m Unnati Chhabra, an AI Engineer / Data Scientist working across GenAI, agentic systems, backend engineering and weird ideas worth building.</p><div className="actions"><a className="primary" href="#work">explore my work <ArrowUpRight size={18}/></a><a className="secondary" href="mailto:chhabraunnati234@gmail.com">say hi <Mail size={16}/></a><a className="secondary" href="/resume.pdf" download>resume <ArrowUpRight size={16}/></a></div><div className="shade-picker"><span className="section-label">try on a shade</span><div role="radiogroup" aria-label="Site accent color">{shades.map(s=><motion.button key={s.name} role="radio" aria-checked={shade===s.name} aria-label={s.name} title={s.name} className={shade===s.name?'swatch active':'swatch'} style={{background:s.color}} whileHover={{scale:1.15,rotate:-8}} whileTap={{scale:.9}} onClick={()=>setShade(s.name)}/>)}</div><span className="shade-name">{shade}</span></div></div><div className="hero-mascot"><Mascot voice={sound} greeting={visitGreeting(visits)} onSecret={toggleSecret}/></div><div className="scroll">↓ scroll to explore</div></section>
    <section className="now"><div className="section-label">01 / now</div><div className="now-grid"><div><h2>what’s cooking</h2><p>Not a static portfolio. This is a snapshot of what I’m actually thinking, building and shipping.</p></div><div className="status-card"><div><span className="pill live">● building</span><h3>Imlea</h3><p>A learning platform for kids to study their school curriculum.</p><div className="mini-quiz"><strong>tiny study break</strong><p>Which one is a primary color?</p><div>{['Blue','Green','Pink'].map(choice=><button className={quizChoice===choice?'chosen':''} key={choice} onClick={()=>{setQuizChoice(choice);setQuizAnswered(true)}}>{choice}</button>)}</div>{quizAnswered&&<p className="quiz-result">Gold star for playing, {quizChoice==='Blue'?'and you got it right':'even when the answer was Blue'}: ★</p>}</div></div><span className="arrow">↗</span></div><div className="status-card"><div><span className="pill">● experimenting</span><h3>AI product lab</h3><p>Small MVPs, agent workflows and ideas tested by shipping.</p></div><span className="arrow">↗</span></div></div></section>
   <section className="counter"><div className="big-number">27</div><div><div className="section-label">things shipped / experiments started</div><p>Some became products. Some became lessons. A few became very expensive tabs.</p></div></section>
   <section id="work" className="work"><div className="section-label">02 / selected work</div><h2>things I’ve built<br/><span>& worked on</span></h2><div className="projects">{projects.map((p,i)=>{const Card=p.url?motion.a:motion.article; return <Card key={p.name} className={p.url?'project project-link':'project'} {...(p.url?{href:p.url,target:'_blank',rel:'noreferrer'}:{})} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.04}}><div className="project-top"><span>0{i+1}</span><span className="tag">{p.tag}</span></div><h3>{p.name}{p.url&&<ArrowUpRight size={20}/>}</h3><p>{p.desc}</p><small>{p.tech}</small>{p.url&&<span className="project-cta">view on github ↗</span>}</Card>})}</div></section>
  <section id="career" className="career"><div className="section-label">03 / career graph</div><h2>different problems.<br/><span>same obsession.</span></h2><div className="timeline">{career.map((c,i)=><motion.div className={selectedCareer===i?'career-row selected':'career-row'} key={c.name} role="button" tabIndex="0" initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.5,delay:i*.14}} onClick={()=>setSelectedCareer(i)} onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&setSelectedCareer(i)}><div className="year">{c.year}</div><div className="node">{i===0?'✦':'·'}</div><div className="career-copy"><h3>{c.name}</h3><strong>{c.role}</strong><p>{alternateReality&&c.name==='Zomato'?'Alternate timeline: Unnati stayed at Zomato and became the unofficial Parchi whisperer. The orders still flow; the nickname is still under review.':c.detail}</p><div className="career-impact"><span>impact</span>{c.impact}</div><div className="career-stack">{c.stack.map(t=><span key={t}>{t}</span>)}</div><button className="case-link" onClick={e=>{e.stopPropagation();setCaseStudy(c);}}>read the case study →</button></div></motion.div>)}</div><button className="fun-button" onClick={()=>setAlternateReality(!alternateReality)}>{alternateReality?'back to real timeline':'what if alternate timeline?'} ↗</button><div className="recruiter-disclaimer recruiter-only">Optimized for scanning. May contain traces of personality.</div></section>
  <section className="skills recruiter-only"><div className="section-label">skills</div><h2>tools for turning<br/><span>ideas into systems.</span></h2><div className="skill-list">{['Python','Java','JavaScript','SQL','LLMs','RAG','Prompt Engineering','pgvector','Agentic Systems','REST APIs','Redis','PostgreSQL','Node.js','React','Next.js','Streamlit','Docker','Kubernetes','CI/CD'].map(skill=><span key={skill}>{skill}</span>)}</div></section>
  <section className="education"><div className="section-label">04 / education</div><div className="education-grid"><div><h2>where it<br/><span>started.</span></h2><p>The foundation behind the systems, products, and experiments.</p></div><div className="education-card"><span className="year">Aug 2019 to May 2023</span><h3>Indira Gandhi Delhi Technical University for Women</h3><strong>B.Tech · Information Technology</strong><p>Delhi, India · CGPA 8.01</p></div></div></section>
  <section id="open-source" className="open-source"><div className="section-label">05 / open source</div><div className="open-source-grid"><div><h2>share the<br/><span>work.</span></h2><p>Public projects, community work, and contributions collected from GitHub.</p><div className="opensource-note"><strong>Community</strong><span>GitHub Campus Expert · Former LFX Mentee · Founder of CodXCrypt</span><a href="https://github.com/unnati914" target="_blank" rel="noreferrer">view GitHub profile ↗</a></div></div><div className="projects open-source-projects">{openSource.map((project,index)=><a className="project open-source-project" href={project.url} target="_blank" rel="noreferrer" key={project.name}><div className="project-top"><span>0{index+1}</span><span className="tag">github</span></div><h3>{project.name}<ArrowUpRight size={20}/></h3><p>{project.desc}</p><small>{project.tech}</small></a>)}</div></div></section>
  <section id="lab" className="lab"><div className="section-label">06 / failure archive</div><div className="lab-grid"><div><h2>failed experiments<br/><span>are still work.</span></h2><p>I keep the messy stuff too. Every failed experiment gets a short record: the idea, what happened, and what changed afterward.</p><button className="fun-button" onClick={showFortune}>open a failure fortune cookie ↗</button>{fortune&&<blockquote className="fortune-cookie">{fortune}</blockquote>}<div className="oops-generator"><div className="section-label">oopsbot says</div><h3>the project is almost done...</h3><button className="fun-button" onClick={generateExcuse}>make it more dramatic ↗</button>{excuse&&<p className="generated-excuse">“{excuse}”</p>}</div></div>{failures.map((failure,index)=><article className="failure" key={failure.name}><span>0{index+1}</span><h3>{failure.name}</h3><div className="failure-story"><strong>idea</strong><p>{failure.idea}</p><strong>what happened</strong><p>{failure.outcome}</p><strong>learned</strong><p>{failure.lesson}</p></div></article>)}</div></section>
  <Beliefs/>
  <section className="terminal-card"><div className="terminal-head"><span>unnati@portfolio ~</span><span>● ● ●</span></div><div className="terminal-body"><p>$ whoami</p><p className="muted">AI engineer · builder · community person</p><p>$ ls current_work/</p><p>imlea/ &nbsp; ai-agents/ &nbsp; evals/ &nbsp; experiments/</p><p>$ echo “what matters?”</p><p className="accent">ship → learn → iterate → repeat</p><button className="vibe-button" onClick={runVibeCheck}>run vibe check ↗</button>{vibeCheck&&<p className="vibe-result">$ {vibeCheck}</p>}</div></section>
    <Garage sound={sound}/>
    <TravelLog reduced={accessibilityMode||systemReduced}/>
    <BeautyLab onTheme={setShade}/>
    <section id="contact" className="contact"><div className="section-label">11 / contact</div><h2>building something<br/><em>interesting?</em></h2><p>{'Send a hello. Tell me what you\'re building. Or just say hi as a person.'}</p><div className="contact-links"><a href="mailto:chhabraunnati234@gmail.com">email <Mail size={16}/></a><a href="https://github.com/unnati914" target="_blank" rel="noreferrer">github <Code2 size={16}/></a><a href="https://www.linkedin.com/in/unnati-chhabra-/" target="_blank" rel="noreferrer">linkedin <BriefcaseBusiness size={16}/></a><a href="https://www.instagram.com/unnatiisig/" target="_blank" rel="noreferrer">instagram <span className="instagram-icon" aria-hidden="true"><i/></span></a></div><div className="guestbook"><div><div className="section-label">leave a note</div><h3>what should I build next?</h3></div><form onSubmit={addGuestNote}><input value={guestNote} maxLength="180" onChange={e=>setGuestNote(e.target.value)} placeholder="a thought, idea, or hello..."/><button type="submit">email this note ↗</button></form></div></section>
  </main>
  <footer><span>© 2026 unnati chhabra</span><span>built with curiosity + too many tabs</span><div className="footer-links"><a href="https://www.linkedin.com/in/unnati-chhabra-/" target="_blank" rel="noreferrer">linkedin</a><a href="https://github.com/unnati914" target="_blank" rel="noreferrer">github</a><a href="mailto:chhabraunnati234@gmail.com">email</a><a href="https://www.instagram.com/unnatiisig/" target="_blank" rel="noreferrer">instagram <span className="instagram-icon" aria-hidden="true"><i/></span></a></div></footer>
  <AnimatePresence>{showBuddy&&!ask&&<motion.div className="buddy" initial={{opacity:0,y:40,scale:.6}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:40,scale:.6}}><Mascot mini voice={sound} outfit={outfit} onClick={()=>setAsk(true)} label="Ask Unnati a question"/></motion.div>}</AnimatePresence>
  <div className="aurora" aria-hidden="true"><i/><i/><i/></div>
  <AskGlo open={ask} onClose={()=>setAsk(false)} sound={sound}/>
  <CaseStudy role={caseStudy} onClose={()=>setCaseStudy(null)}/>
  <CursorTrail disabled={accessibilityMode||!!systemReduced}/>
  <CommandPalette open={palette} onClose={()=>setPalette(false)} commands={commands}/>
  <Confetti burst={burst}/>
  <AnimatePresence>{toast&&<motion.div className="toast" role="status" initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:30,opacity:0}}>{toast}</motion.div>}</AnimatePresence>
 </div></MotionConfig>
}
createRoot(document.getElementById('root')).render(<App/>);
