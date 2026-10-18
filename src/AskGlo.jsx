import React,{useEffect,useRef,useState} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import {X,Mic,Volume2,Sparkles} from 'lucide-react';
import {answerFromResume as resumeAnswer} from './resumeData';
import {speak,listen,canSpeak,canListen} from './voice';

const modes=[
 {id:'recruiter',label:'recruiter'},
 {id:'collaborator',label:'collaborator'},
 {id:'curious',label:'curious human'},
 {id:'technical',label:'technical deep dive'}
];
const suggestions=['what does she build?','tell me about Imlea','what’s her stack?','what did she do at Zomato?'];

// Answers come from the local resume knowledge base in resumeData.js.
function answerFromResume(question,mode){
 const framing={recruiter:'Quick context: ',collaborator:'If you are thinking about working with Unnati: ',curious:'The short version: ',technical:'Technical lens: '};
 const reply=resumeAnswer(question);
 return reply.startsWith('I can answer questions')?'I don’t know that from the information I have. I would rather say that than make something up.':framing[mode]+reply;
}

export default function AskGlo({open,onClose,sound}){
 const [thread,setThread]=useState([]);
 const [input,setInput]=useState('');
 const [mode,setMode]=useState('curious');
 const [thinking,setThinking]=useState(false);
 const [listening,setListening]=useState(false);
 const end=useRef(null), field=useRef(null);
 useEffect(()=>{end.current?.scrollIntoView({block:'end',behavior:'smooth'});},[thread,thinking]);
 useEffect(()=>{if(open)setTimeout(()=>field.current?.focus(),50);},[open]);
 useEffect(()=>{if(!open)return; const esc=e=>e.key==='Escape'&&onClose(); window.addEventListener('keydown',esc); return ()=>window.removeEventListener('keydown',esc);},[open,onClose]);

 const send=async(text,aloud=false)=>{
  const question=text.trim(); if(!question||thinking)return;
  const next=[...thread,{role:'user',content:question}].slice(-12);
  setThread(next); setInput(''); setThinking(true);
  await new Promise(r=>setTimeout(r,450+Math.random()*350)); // a short "typing" beat
  const reply=answerFromResume(question,mode);
  setThread(t=>[...t,{role:'assistant',content:reply}]); setThinking(false);
  if(aloud&&sound)speak(reply,{pitch:1.2,rate:1});
 };
 const startListening=()=>{if(listening)return; setListening(true); listen({onResult:t=>send(t,true),onEnd:()=>setListening(false)});};

 return <AnimatePresence>{open&&<motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
  <motion.div className="ask-modal" role="dialog" aria-label="Ask Glo about Unnati" initial={{y:30,scale:.98}} animate={{y:0,scale:1}} exit={{y:30,scale:.98}} onClick={e=>e.stopPropagation()}>
   <button className="close" onClick={onClose} aria-label="Close"><X/></button>
   <div className="section-label">ask unnati · resume brain</div>
   <h2>what do you want<br/>to know?</h2>
   <div className="personality-modes"><span>answer as</span>{modes.map(m=><button className={mode===m.id?'active':''} key={m.id} onClick={()=>setMode(m.id)}>{m.label}</button>)}</div>
   {!!thread.length&&<div className="chat-thread" aria-live="polite">
    {thread.map((m,i)=><motion.div key={i} className={`bubble ${m.role}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
     {m.role==='assistant'&&<Sparkles size={14}/>}<span>{m.content}</span>
     {m.role==='assistant'&&canSpeak&&sound&&<button className="read-aloud" aria-label="Read answer aloud" onClick={()=>speak(m.content,{pitch:1.2,rate:1})}><Volume2 size={15}/></button>}
    </motion.div>)}
    {thinking&&<div className="bubble assistant typing" aria-label="Glo is typing"><i/><i/><i/></div>}
    <div ref={end}/>
   </div>}
   <div className="ask-input">
    <input ref={field} value={input} maxLength={500} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(input)} placeholder={listening?'listening…':'e.g. what does she build?'} aria-label="Your question"/>
    {canListen&&<button className={listening?'mic listening':'mic'} aria-label="Ask with your voice" onClick={startListening}><Mic size={18}/></button>}
    <button onClick={()=>send(input)} aria-label="Send" disabled={thinking}>↗</button>
   </div>
   <div className="suggestions">{(thread.length?suggestions.slice(2):suggestions).map(x=><button key={x} onClick={()=>send(x)}>{x}</button>)}{!!thread.length&&<button onClick={()=>setThread([])}>clear chat</button>}</div>
  </motion.div>
 </motion.div>}</AnimatePresence>;
}
