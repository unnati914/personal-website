// Controls the Spotify embed in the garage through Spotify's iFrame API,
// so the mini game can start the soundtrack when a visitor arrives or starts riding.
let controller=null, pending=false, playing=false, autoStarted=false;

export function mountRideMusic(el,uri){
 const create=api=>api.createController(el,{uri,width:'100%',height:152},c=>{
  controller=c;
  c.addListener('playback_update',e=>{playing=!e.data.isPaused;});
  c.addListener('ready',()=>{if(pending){pending=false; c.play();}});
 });
 if(window.SpotifyIframeApi)return create(window.SpotifyIframeApi);
 window.onSpotifyIframeApiReady=api=>{window.SpotifyIframeApi=api; create(api);};
 if(!document.querySelector('script[data-spotify-iframe-api]')){
  const s=document.createElement('script'); s.src='https://open.spotify.com/embed/iframe-api/v1'; s.async=true; s.dataset.spotifyIframeApi='';
  document.body.appendChild(s);
 }
}

export function unmountRideMusic(){controller?.destroy(); controller=null; pending=false; playing=false; autoStarted=false;}

// Starts the soundtrack unless it's already playing. Browsers only allow this after the visitor has interacted with the page.
export function autoPlay(){
 if(playing)return;
 autoStarted=true;
 if(controller)controller.play(); else pending=true;
}

// Pauses only what autoPlay started, so music the visitor started themselves keeps going.
export function autoPause(){
 if(autoStarted&&playing)controller?.pause();
 autoStarted=false; pending=false;
}
