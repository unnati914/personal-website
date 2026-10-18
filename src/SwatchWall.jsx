import React,{useState} from 'react';
import {motion} from 'framer-motion';

// Add your real favourites here; the wall stays hidden from visitors until this list has entries.
// Add shade names, swatch colours and an optional one-line review, e.g.
// {product:'Lakmé · Shade name',type:'lipstick',color:'#b4485f',review:'My everyday shade.'}
const favourites=[
 {product:'Lakmé liner',type:'eyeliner',color:'#1c1420'},
 {product:'Lakmé lipstick',type:'lipstick',color:'#b4485f'}
];

export default function SwatchWall(){
 const [open,setOpen]=useState(null);
 if(!favourites.length)return import.meta.env.DEV?<div className="swatch-wall dev-note">dev note: add your favourite products to <code>favourites</code> in src/SwatchWall.jsx to show the swatch wall. Visitors won’t see this box until then.</div>:null;
 return <div className="swatch-wall">
  <div className="section-label">swatch wall · my current favourites</div>
  <div className="swatch-grid">{favourites.map((f,i)=><motion.button key={f.product} className={open===i?'swatch-card open':'swatch-card'} aria-expanded={f.review?open===i:undefined} onClick={()=>f.review&&setOpen(open===i?null:i)} initial={{opacity:0,scale:.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*.05}} whileHover={{y:-4}}>
   <i style={{'--swatch':f.color}}/>
   <strong>{f.product}</strong><small>{f.type}</small>
   {open===i&&f.review&&<motion.p initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}>{f.review}</motion.p>}
  </motion.button>)}</div>
 </div>;
}
