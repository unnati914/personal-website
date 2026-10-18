import React,{useEffect,useRef,useState} from 'react';
import {motion} from 'framer-motion';
import {getLandmarker,LIPS_OUTER,LIPS_INNER,CHEEKS,LIDS,FACE_EDGES} from './faceTracking';

const lipsticks=[
 {name:'rose',color:'#c2185b'},
 {name:'berry',color:'#8e2453'},
 {name:'coral',color:'#ff5a4e'},
 {name:'nude',color:'#b97a6a'},
 {name:'classic red',color:'#c8102e'},
 {name:'plum',color:'#5e1a45'}
];

const effectsList=[{id:'lips',label:'lipstick'},{id:'blush',label:'blush'},{id:'liner',label:'winged liner'},{id:'glitter',label:'glitter'}];

function star(ctx,x,y,r){ctx.beginPath(); ctx.moveTo(x,y-r); ctx.lineTo(x+r*.3,y-r*.3); ctx.lineTo(x+r,y); ctx.lineTo(x+r*.3,y+r*.3); ctx.lineTo(x,y+r); ctx.lineTo(x-r*.3,y+r*.3); ctx.lineTo(x-r,y); ctx.lineTo(x-r*.3,y-r*.3); ctx.closePath(); ctx.fill();}

function drawLook(ctx,face,w,h,fx,color){
 const P=k=>({x:face[k].x*w,y:face[k].y*h});
 const fw=Math.hypot(P(FACE_EDGES[0]).x-P(FACE_EDGES[1]).x,P(FACE_EDGES[0]).y-P(FACE_EDGES[1]).y);
 if(fx.blush)[CHEEKS[0],CHEEKS[1]].forEach(k=>{const c=P(k), r=fw*.12; const g=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,r); g.addColorStop(0,'rgba(255,92,138,.42)'); g.addColorStop(1,'rgba(255,92,138,0)'); ctx.save(); ctx.globalCompositeOperation='multiply'; ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,r,0,Math.PI*2); ctx.fill(); ctx.restore();});
 if(fx.lips){
  ctx.save(); ctx.beginPath(); tracePath(ctx,face,LIPS_OUTER,w,h); tracePath(ctx,face,LIPS_INNER,w,h);
  ctx.filter='blur(1.5px)'; ctx.fillStyle=color;
  ctx.globalCompositeOperation='multiply'; ctx.globalAlpha=.6; ctx.fill('evenodd');
  ctx.globalCompositeOperation='soft-light'; ctx.globalAlpha=.35; ctx.fill('evenodd');
  ctx.restore();
 }
 if(fx.liner)LIDS.forEach(lid=>{
  const o=P(lid.outer), i=P(lid.inner), len=Math.hypot(o.x-i.x,o.y-i.y)||1, v={x:(o.x-i.x)/len,y:(o.y-i.y)/len};
  ctx.save(); ctx.strokeStyle='rgba(20,10,24,.9)'; ctx.lineWidth=Math.max(1.5,fw*.009); ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.beginPath(); lid.line.forEach((k,n)=>{const p=P(k); n?ctx.lineTo(p.x,p.y-ctx.lineWidth*.4):ctx.moveTo(p.x,p.y);});
  ctx.moveTo(o.x,o.y); ctx.lineTo(o.x+v.x*fw*.06,o.y+v.y*fw*.06-fw*.03); ctx.stroke(); ctx.restore();
 });
 if(fx.glitter){
  ctx.save(); ctx.fillStyle='#fff';
  for(let n=0;n<18;n++){
   const a=n%2?LIPS_OUTER:LIDS[n%4<2?0:1].line, k=a[Math.floor(Math.random()*a.length)], p=P(k);
   ctx.globalAlpha=.4+Math.random()*.6; star(ctx,p.x+(Math.random()-.5)*fw*.03,p.y+(Math.random()-.5)*fw*.02,fw*(.006+Math.random()*.01));
  }
  ctx.restore();
 }
}

function tracePath(ctx,pts,idx,w,h){idx.forEach((k,i)=>{const p=pts[k]; i?ctx.lineTo(p.x*w,p.y*h):ctx.moveTo(p.x*w,p.y*h);}); ctx.closePath();}

function TryOn({shade,setShade}){
 const [fx,setFx]=useState({lips:true,blush:false,liner:false,glitter:false}); const fxRef=useRef(fx); fxRef.current=fx;
 const video=useRef(null), canvas=useRef(null), stream=useRef(null), raf=useRef(0), shadeRef=useRef(shade);
 shadeRef.current=shade;
 const [status,setStatus]=useState('idle'); const [error,setError]=useState('');
 const stop=()=>{cancelAnimationFrame(raf.current); stream.current?.getTracks().forEach(t=>t.stop()); stream.current=null; setStatus('idle');};
 useEffect(()=>stop,[]);
 const start=async()=>{
  setError(''); setStatus('loading');
  try{
   stream.current=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:640,height:480},audio:false});
   const v=video.current; v.srcObject=stream.current; await v.play();
   const lm=await getLandmarker('VIDEO');
   setStatus('live');
   const loop=()=>{
    const c=canvas.current; if(!c||!stream.current)return;
    if(v.readyState>=2){
     const w=v.videoWidth,h=v.videoHeight; if(c.width!==w){c.width=w;c.height=h;}
     const ctx=c.getContext('2d');
     ctx.setTransform(-1,0,0,1,w,0); // mirror like a selfie camera
     ctx.drawImage(v,0,0,w,h);
     const face=lm.detectForVideo(v,performance.now()).faceLandmarks?.[0];
     if(face)drawLook(ctx,face,w,h,fxRef.current,lipsticks[shadeRef.current].color);
    }
    raf.current=requestAnimationFrame(loop);
   };
   loop();
  }catch(e){
   stop();
   setError(e?.name==='NotAllowedError'?'Camera permission was blocked. Allow it in your browser to try this.':'Could not start the camera or face tracking on this device.');
  }
 };
 const snap=()=>{const a=document.createElement('a'); a.download='glo-try-on.png'; a.href=canvas.current.toDataURL('image/png'); a.click();};
 return <div className="lab-card">
  <div className="section-label">live try-on</div>
  <h3>try a look, live.</h3>
  <div className={`camera ${status}`}>
   <video ref={video} playsInline muted/>
   <canvas ref={canvas} aria-label="Your camera with the lipstick applied"/>
   {status!=='live'&&<div className="camera-idle">{status==='loading'?<span className="loader">loading face tracking…</span>:<button className="primary" onClick={start}>turn on camera ↗</button>}</div>}
  </div>
  <div className="lip-shades" role="radiogroup" aria-label="Lipstick shade">{lipsticks.map((l,i)=><motion.button key={l.name} role="radio" aria-checked={shade===i} title={l.name} aria-label={l.name} className={shade===i?'lip active':'lip'} style={{background:l.color}} whileHover={{y:-3}} onClick={()=>setShade(i)}/>)}<span>{lipsticks[shade].name}</span></div>
  <div className="fx-chips" role="group" aria-label="Makeup effects">{effectsList.map(e=><button key={e.id} aria-pressed={fx[e.id]} className={fx[e.id]?'active':''} onClick={()=>setFx(f=>({...f,[e.id]:!f[e.id]}))}>{e.label}</button>)}</div>
  {status==='live'&&<div className="lab-actions"><button className="fun-button" onClick={snap}>save selfie ↓</button><button className="fun-button" onClick={stop}>stop camera</button></div>}
  {error&&<p className="lab-error">{error}</p>}
  <small className="privacy">Runs entirely in your browser. Your camera feed never leaves your device.</small>
 </div>;
}

const lin=c=>{c/=255; return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;};
function toLab([r,g,b]){
 const R=lin(r),G=lin(g),B=lin(b);
 const f=t=>t>.008856?Math.cbrt(t):7.787*t+16/116;
 const fx=f((R*.4124+G*.3576+B*.1805)/.95047), fy=f(R*.2126+G*.7152+B*.0722), fz=f((R*.0193+G*.1192+B*.9505)/1.08883);
 return [116*fy-16,500*(fx-fy),200*(fy-fz)];
}
const picks={
 warm:{lips:['coral','classic red','nude'],theme:'peach'},
 cool:{lips:['berry','rose','plum'],theme:'lilac'},
 neutral:{lips:['rose','nude','berry'],theme:'blush'}
};

function ShadeMatcher({onTheme,onTry}){
 const [state,setState]=useState({status:'idle'});
 const analyse=async file=>{
  if(!file)return;
  const url=URL.createObjectURL(file);
  setState({status:'loading',url});
  try{
   const img=new Image(); img.src=url; await img.decode();
   const lm=await getLandmarker('IMAGE');
   const face=lm.detect(img).faceLandmarks?.[0];
   if(!face)return setState({status:'noface',url});
   const c=document.createElement('canvas'); c.width=img.naturalWidth; c.height=img.naturalHeight;
   const ctx=c.getContext('2d',{willReadFrequently:true}); ctx.drawImage(img,0,0);
   const size=Math.max(4,Math.round(c.width/80)); let sum=[0,0,0],n=0;
   CHEEKS.forEach(k=>{const x=Math.round(face[k].x*c.width-size/2), y=Math.round(face[k].y*c.height-size/2); const d=ctx.getImageData(x,y,size,size).data; for(let i=0;i<d.length;i+=4){sum[0]+=d[i];sum[1]+=d[i+1];sum[2]+=d[i+2];n++;}});
   const rgb=sum.map(v=>Math.round(v/n));
   const [L,a,b]=toLab(rgb); const hue=Math.atan2(b,a)*180/Math.PI;
   const tone=hue>=58?'warm':hue<=48?'cool':'neutral';
   const depth=L>65?'light':L>45?'medium':'deep';
   onTheme(picks[tone].theme);
   setState({status:'done',url,rgb,tone,depth});
  }catch{setState({status:'error',url});}
 };
 const r=state.status==='done'?picks[state.tone]:null;
 const toneLabel={warm:'warm',cool:'cool',neutral:'neutral'};
 return <div className="lab-card">
  <div className="section-label">shade matcher</div>
  <h3>find your shade from a photo.</h3>
  <label className="upload">
   <input type="file" accept="image/*" onChange={e=>analyse(e.target.files?.[0])}/>
   {state.url?<img src={state.url} alt="Your uploaded photo"/>:<span>upload a clear, front-facing selfie in daylight ↑</span>}
  </label>
  {state.status==='loading'&&<p className="loader">reading your undertone…</p>}
  {state.status==='noface'&&<p className="lab-error">Couldn’t find a face. Try a clearer, front-facing photo.</p>}
  {state.status==='error'&&<p className="lab-error">Couldn’t analyse that photo on this device.</p>}
  {r&&<motion.div className="match" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
   <div className="match-skin"><i style={{background:`rgb(${state.rgb.join(',')})`}}/><span>undertone: <strong>{toneLabel[state.tone]}</strong> · depth: <strong>{state.depth}</strong></span></div>
   <div className="match-lips">{r.lips.map(name=>{const i=lipsticks.findIndex(l=>l.name===name); return <button key={name} onClick={()=>onTry(i)} title="try it live"><i style={{background:lipsticks[i].color}}/>{name}</button>;})}</div>
   <small>{`Site theme switched to ${r.theme}. Tap a shade to load it into the live try-on.`}</small>
  </motion.div>}
  <small className="privacy">A fun colour heuristic, not professional advice. The photo is analysed in your browser and never uploaded.</small>
 </div>;
}

export default function BeautyLab({onTheme}){
 const [shade,setShade]=useState(0);
 const tryShade=i=>{setShade(i); document.querySelector('.camera')?.scrollIntoView({behavior:'smooth',block:'center'});};
 return <section id="beauty-lab" className="beauty-lab">
  <div className="section-label">10 / beauty lab</div>
  <h2>where makeup<br/><span>meets machine learning.</span></h2>
  <p className="lab-intro">Real-time face tracking with MediaPipe, running on your device. Try a lipstick live, or let a photo pick your shade.</p>
  <div className="lab-cards"><TryOn shade={shade} setShade={setShade}/><ShadeMatcher onTheme={onTheme} onTry={tryShade}/></div>
 </section>;
}
