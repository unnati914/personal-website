import React,{useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import Garage from './Garage';
import TravelLog from './TravelLog';
import Beliefs from './Beliefs';
import CursorTrail from './CursorTrail';

const failures=[
 {name:'X dating',idea:'Build for dating on X.',outcome:'It stayed an experiment instead of becoming a shipped product.',lesson:'Interesting questions are still useful, even when the product does not continue.'},
 {name:'built it in 24 hours',idea:'Move fast and test the idea immediately.',outcome:'The prototype worked, then the next problem was scaling it.',lesson:'A fast first version is only the beginning of the real problem.'},
 {name:'technically worked',idea:'Solve the problem well enough to ship.',outcome:'It worked, but nobody cared enough to use it.',lesson:'A working product still needs a reason for people to return.'},
 {name:'questionable idea',idea:'Follow the strange idea and see what happens.',outcome:'It was still shipped, even if it was not the right idea.',lesson:'Shipping creates better evidence than protecting an idea forever.'}
];
const excuseLines=['The project is almost done. One tiny detail remains.','The feature works perfectly, as long as nobody clicks anything unexpected.','It is not delayed. It is collecting highly valuable feedback from reality.','The project is 90% done. The remaining 10% has formed a committee.'];
const vibeChecks=['Vibe check: deployable. Confidence: suspiciously high.','Diagnostics complete. One more tab has been opened for research.','All systems nominal. The CSS has requested a meeting.','Build passed. Product scope has quietly doubled.'];

export default function Play({sound,reduced}){
 const [fortune,setFortune]=useState(''); const [excuse,setExcuse]=useState(''); const [ei,setEi]=useState(0); const [vibe,setVibe]=useState(''); const [vi,setVi]=useState(0); const [quiz,setQuiz]=useState('');
 return <>
  <section className="play-hero"><div className="section-label">/play · off the clock</div><h1>the fun stuff,<br/><em>kept on purpose.</em></h1><p className="lede">Everything that’s not on the main page: failed experiments, beliefs, my bike, my travels and a few toys. <a href="/">Back to the work ↗</a></p></section>
  <section id="lab" className="lab"><div className="section-label">01 / failure archive</div><div className="lab-grid"><div><h2>failed experiments<br/><span>are still work.</span></h2><p>I keep the messy stuff too. Every failed experiment gets a short record: the idea, what happened, and what changed afterward.</p><button className="fun-button" onClick={()=>setFortune(failures[Math.floor(Math.random()*failures.length)].lesson)}>open a failure fortune cookie ↗</button>{fortune&&<blockquote className="fortune-cookie">{fortune}</blockquote>}<div className="oops-generator"><div className="section-label">oopsbot says</div><h3>the project is almost done...</h3><button className="fun-button" onClick={()=>{setExcuse(excuseLines[ei%excuseLines.length]);setEi(ei+1);}}>make it more dramatic ↗</button>{excuse&&<p className="generated-excuse">“{excuse}”</p>}</div></div>{failures.map((f,i)=><article className="failure" key={f.name}><span>0{i+1}</span><h3>{f.name}</h3><div className="failure-story"><strong>idea</strong><p>{f.idea}</p><strong>what happened</strong><p>{f.outcome}</p><strong>learned</strong><p>{f.lesson}</p></div></article>)}</div></section>
  <Beliefs/>
  <section className="terminal-card"><div className="terminal-head"><span>unnati@portfolio ~</span><span>● ● ●</span></div><div className="terminal-body"><p>$ whoami</p><p className="muted">AI engineer · builder · community person</p><p>$ ls current_work/</p><p>imlea/ &nbsp; ai-agents/ &nbsp; demos/ &nbsp; experiments/</p><p>$ echo “what matters?”</p><p className="accent">ship → learn → iterate → repeat</p><button className="vibe-button" onClick={()=>{setVibe(vibeChecks[vi%vibeChecks.length]);setVi(vi+1);}}>run vibe check ↗</button>{vibe&&<p className="vibe-result">$ {vibe}</p>}</div></section>
  <Garage sound={sound}/>
  <TravelLog reduced={reduced}/>
  <section className="play-quiz"><div className="mini-quiz"><strong>tiny study break, from Imlea</strong><p>Which one is a primary color?</p><div>{['Blue','Green','Pink'].map(c=><button className={quiz===c?'chosen':''} key={c} onClick={()=>setQuiz(c)}>{c}</button>)}</div>{quiz&&<p className="quiz-result">Gold star for playing, {quiz==='Blue'?'and you got it right':'even when the answer was Blue'}: ★</p>}</div><a className="primary" href="/">back to the work <ArrowUpRight size={18}/></a></section>
  <CursorTrail disabled={reduced}/>
 </>;
}
