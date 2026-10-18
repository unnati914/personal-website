export const canSpeak=typeof window!=='undefined'&&'speechSynthesis' in window;
const Recognition=typeof window!=='undefined'?(window.SpeechRecognition||window.webkitSpeechRecognition):null;
export const canListen=!!Recognition;

const pickVoice=()=>{const voices=speechSynthesis.getVoices(); return voices.find(v=>/samantha|zira|google uk english female|veena|female/i.test(v.name))||voices.find(v=>v.lang?.startsWith('en'))||null;};

let current=null; // keep a reference so Chrome doesn't garbage-collect the utterance mid-speech

export function speak(text,{pitch=1.5,rate=1.05}={}){
 if(!canSpeak||!text)return;
 const clean=text.replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\uFE0F]/gu,'').trim();
 const u=new SpeechSynthesisUtterance(clean); u.pitch=pitch; u.rate=rate; u.volume=1;
 const v=pickVoice(); if(v){u.voice=v; u.lang=v.lang;}
 current=u;
 speechSynthesis.resume();
 if(speechSynthesis.speaking||speechSynthesis.pending){
  speechSynthesis.cancel();
  // Chrome drops an utterance queued in the same tick as cancel(), so give it a moment
  setTimeout(()=>speechSynthesis.speak(current),120);
 }else speechSynthesis.speak(u); // iOS/Safari need this synchronously inside the tap
}

if(canSpeak){speechSynthesis.getVoices(); speechSynthesis.addEventListener?.('voiceschanged',()=>speechSynthesis.getVoices());}

// One shared AudioContext, unlocked on the visitor's first interaction.
let ctx=null;
export function getAudio(){
 const Ctx=window.AudioContext||window.webkitAudioContext; if(!Ctx)return null;
 if(!ctx)ctx=new Ctx();
 if(ctx.state!=='running')ctx.resume();
 return ctx;
}
let unlocked=false;
const unlock=()=>{
 const c=getAudio(); if(!c)return;
 if(navigator.audioSession)try{navigator.audioSession.type='playback'}catch{} // lets iPhone play sound with the silent switch on
 const src=c.createBufferSource(); src.buffer=c.createBuffer(1,1,22050); src.connect(c.destination); src.start(0);
 if(!unlocked&&canSpeak&&!speechSynthesis.speaking){const w=new SpeechSynthesisUtterance(' '); w.volume=0; speechSynthesis.speak(w);}
 unlocked=true;
 if(c.state==='running')['pointerup','touchend','click','keydown'].forEach(e=>window.removeEventListener(e,unlock,true));
};
if(typeof window!=='undefined')['pointerup','touchend','click','keydown'].forEach(e=>window.addEventListener(e,unlock,true));

export function chime(){
 const c=getAudio(); if(!c)return;
 const t=c.currentTime;
 [660,880,1320].forEach((f,i)=>{const o=c.createOscillator(); const g=c.createGain(); o.type='sine'; o.frequency.value=f; g.gain.setValueAtTime(0,t+i*.08); g.gain.linearRampToValueAtTime(.18,t+i*.08+.02); g.gain.exponentialRampToValueAtTime(.001,t+i*.08+.35); o.connect(g).connect(c.destination); o.start(t+i*.08); o.stop(t+i*.08+.4);});
}

export function listen({onResult,onEnd}){
 if(!Recognition)return null;
 const r=new Recognition(); r.lang='en-IN'; r.interimResults=false; r.maxAlternatives=1;
 r.onresult=e=>onResult(e.results[0][0].transcript);
 r.onend=onEnd; r.onerror=onEnd;
 r.start();
 return r;
}
