import React,{useState} from 'react';
import {motion,AnimatePresence} from 'framer-motion';

// Sample stops: replace with your real trips. x/y are positions on the stylised map (0-1000, 0-420).
const trips=[
 {place:'Delhi',when:'home base',note:'Where the code, chai and late-night drives start.',x:110,y:300},
 {place:'Rishikesh',when:'weekend ride',note:'River, mountains and zero Wi-Fi guilt.',x:300,y:150},
 {place:'Manali',when:'road trip',note:'Hairpin bends that made every bug feel small.',x:520,y:250},
 {place:'Leh',when:'bucket list',note:'The highest roads and the slowest, best sunsets.',x:720,y:110},
 {place:'Goa',when:'beach break',note:'Sunsets, scooters and one very ambitious side project.',x:900,y:300}
];

const curve=pts=>pts.map((p,i)=>{if(!i)return `M${p.x} ${p.y}`; const a=pts[i-1], dx=(p.x-a.x)/2; return `C${a.x+dx} ${a.y} ${p.x-dx} ${p.y} ${p.x} ${p.y}`;}).join(' ');

export default function TravelLog({reduced}){
 const [active,setActive]=useState(0);
 const d=curve(trips);
 const trip=trips[active];
 return <section id="travel" className="travel">
  <div className="section-label">09 / travel log</div>
  <div className="travel-head"><h2>passport stamps<br/><span>& long detours.</span></h2><p>Every trip gets a pin. Tap one to flip its postcard.</p></div>
  <div className="travel-grid">
   <div className="travel-map">
    <svg viewBox="0 0 1000 420" role="group" aria-label="Travel route map">
     <defs><linearGradient id="route" x1="0" x2="1"><stop offset="0" stopColor="#d6337f"/><stop offset=".5" stopColor="#9b5de5"/><stop offset="1" stopColor="#4cc9f0"/></linearGradient></defs>
     <path d={d} className="route-ghost"/>
     <motion.path d={d} className="route-line" initial={{pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true,margin:'-80px'}} transition={{duration:2.4,ease:'easeInOut'}}/>
     {!reduced&&<g className="traveler"><circle r="9"/><circle r="16" className="traveler-ring"/><animateMotion dur="10s" repeatCount="indefinite" path={d} keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear"/></g>}
     {trips.map((t,i)=><motion.g key={t.place} className={i===active?'pin active':'pin'} role="button" tabIndex="0" aria-label={`${t.place}, ${t.when}`} aria-pressed={i===active} onClick={()=>setActive(i)} onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&(e.preventDefault(),setActive(i))} initial={{scale:0,opacity:0}} whileInView={{scale:1,opacity:1}} viewport={{once:true}} transition={{delay:.4+i*.35,type:'spring',stiffness:260,damping:16}} whileHover={{scale:1.15}}>
      <path d={`M${t.x} ${t.y} c-20 -25 -30 -38 -30 -56 a30 30 0 0 1 60 0 c0 18 -10 31 -30 56z`}/>
      <circle cx={t.x} cy={t.y-56} r="11" fill="#fff"/>
      <text x={t.x} y={t.y+36} textAnchor="middle">{t.place}</text>
     </motion.g>)}
    </svg>
   </div>
   <div className="postcard-wrap">
    <AnimatePresence mode="wait">
     <motion.article key={trip.place} className="postcard" initial={{rotateY:-90,opacity:0}} animate={{rotateY:0,opacity:1,rotate:active%2?2:-2}} exit={{rotateY:90,opacity:0}} transition={{duration:.35}}>
      <div className="stamp"><span>{String(active+1).padStart(2,'0')}</span>✈</div>
      <small>{trip.when}</small>
      <h3>{trip.place}</h3>
      <p>{trip.note}</p>
      <div className="postmark">greetings from {trip.place.toLowerCase()}</div>
     </motion.article>
    </AnimatePresence>
   </div>
  </div>
 </section>;
}
