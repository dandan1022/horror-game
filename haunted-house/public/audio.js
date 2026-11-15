// Original score, spatial sound effects and a continuous proximity heartbeat.
export const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export function heartbeatTarget(distance){
 const x=clamp((12-distance)/10.5,0,1), danger=x*x*(3-2*x);
 return {danger,bpm:58+98*danger,gain:.34*danger};
}
export function smoothHeartbeat(current,target,dt){
 const tau=target.danger>current.danger?.28:1.25;
 const a=1-Math.exp(-Math.max(0,dt)/tau);
 return {danger:current.danger+(target.danger-current.danger)*a,bpm:current.bpm+(target.bpm-current.bpm)*a,gain:current.gain+(target.gain-current.gain)*a};
}
export class HorrorAudio{
 constructor(){this.ctx=null;this.lastStep=0;this.nextAmbient=0;this.volume=.65;this.musicVolume=.7;this.started=false;this.musicSource=null;this.heart=heartbeatTarget(Infinity);this.heartPhase=1;this.lastUpdate=null;}
 init(volume,musicVolume=this.musicVolume){
  this.volume=volume;this.musicVolume=musicVolume;
  if(!this.ctx){let C=window.AudioContext||window.webkitAudioContext;if(!C)return;this.ctx=new C();let c=this.ctx;this.master=c.createGain();this.master.gain.value=volume;this.master.connect(c.destination);this.musicBus=c.createGain();this.musicBus.gain.value=0;this.musicBus.connect(this.master);this.heartBus=c.createGain();this.heartBus.gain.value=0;this.heartBus.connect(this.master);this.noise=c.createBuffer(1,c.sampleRate*3,c.sampleRate);let a=this.noise.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;
   // Decode once, on first user interaction. A completed load never starts music in the menu.
   this.musicLoad=fetch('/assets/horror-score.wav').then(r=>{if(!r.ok)throw Error('Score unavailable');return r.arrayBuffer();}).then(b=>c.decodeAudioData(b)).then(b=>{this.musicBuffer=b;if(this.started)this.startMusic();}).catch(e=>console.warn('Horror score:',e));
  }
  if(this.ctx.state==='suspended'||this.ctx.state==='interrupted')this.ctx.resume().catch(()=>{});
  this.setVolume(volume);this.setMusicVolume(musicVolume);
  if(this.started)this.startMusic();
 }
 setVolume(v){this.volume=v;if(this.master)this.master.gain.setTargetAtTime(v,this.ctx.currentTime,.06);}
 setMusicVolume(v){this.musicVolume=v;if(this.musicBus)this.musicBus.gain.setTargetAtTime(this.started?.32*v:0,this.ctx.currentTime,.24);}
 startMusic(){if(!this.ctx||!this.musicBuffer||this.musicSource||!this.started)return;let c=this.ctx,s=c.createBufferSource();s.buffer=this.musicBuffer;s.loop=true;let fade=c.createGain();fade.gain.value=1;s.connect(fade).connect(this.musicBus);s.start();this.musicSource=s;this.musicFade=fade;this.musicBus.gain.setTargetAtTime(.32*this.musicVolume,c.currentTime,.35);}
 scene(on){if(this.started===on){if(on)this.startMusic();return;}this.started=on;if(!this.ctx)return;let c=this.ctx,t=c.currentTime;if(on){this.lastUpdate=null;this.heart=heartbeatTarget(Infinity);this.heartPhase=1;this.nextAmbient=t+3;this.startMusic();}else{this.heartBus.gain.setTargetAtTime(0,t,.10);this.musicBus.gain.setTargetAtTime(0,t,.13);let s=this.musicSource,fade=this.musicFade;this.musicSource=null;this.musicFade=null;if(s){fade.gain.setTargetAtTime(0,t,.10);s.onended=()=>{s.disconnect();fade.disconnect();};s.stop(t+.65);}this.lastUpdate=null;}}
 // Two short, low thumps (lub-dub) per beat; the shared gain fades continuously.
 pulse(t){let c=this.ctx;for(let [offset,freq,level,dur] of [[0,66,1,.16],[.115,50,.64,.14]]){let s=c.createOscillator(),a=c.createGain(),filter=c.createBiquadFilter();s.type='sine';let at=t+offset;s.frequency.setValueAtTime(freq,at);s.frequency.exponentialRampToValueAtTime(freq*.58,at+dur);a.gain.setValueAtTime(.001,at);a.gain.linearRampToValueAtTime(level,at+.025);a.gain.exponentialRampToValueAtTime(.001,at+dur);filter.type='lowpass';filter.frequency.value=180;s.connect(filter).connect(a).connect(this.heartBus);s.onended=()=>{s.disconnect();filter.disconnect();a.disconnect();};s.start(at);s.stop(at+dur+.01);}}
 sound(kind,pos=null){if(!this.ctx)return;let c=this.ctx,t=c.currentTime,amp=c.createGain(),filter=c.createBiquadFilter(),osc=kind==='key'||kind==='sting';let src=osc?c.createOscillator():c.createBufferSource();let cfg={step:[.19,180,.12],creak:[.95,470,.15],whisper:[1.5,900,.055],key:[.35,880,.11],sting:[1.1,100,.24]}[kind]||[.3,330,.1];let [dur,freq,vol]=cfg;filter.type=kind==='whisper'?'bandpass':'lowpass';filter.frequency.value=kind==='key'?3000:freq*2.2;filter.Q.value=kind==='creak'?8:kind==='whisper'?6:1;if(osc){src.type=kind==='sting'?'sawtooth':'sine';src.frequency.setValueAtTime(freq,t);src.frequency.exponentialRampToValueAtTime(kind==='key'?freq*1.5:freq*.48,t+dur);}else{src.buffer=this.noise;filter.frequency.exponentialRampToValueAtTime(freq*(kind==='creak'?2.5:.45),t+dur);}
 amp.gain.setValueAtTime(.001,t);amp.gain.linearRampToValueAtTime(vol,t+.025);amp.gain.exponentialRampToValueAtTime(.001,t+dur);src.connect(filter).connect(amp);let p=null;if(pos){p=c.createPanner();p.panningModel='HRTF';p.distanceModel='inverse';p.refDistance=1.5;p.maxDistance=25;p.rolloffFactor=1;p.positionX.value=pos.x;p.positionY.value=pos.y;p.positionZ.value=pos.z;amp.connect(p).connect(this.master);}else amp.connect(this.master);src.onended=()=>{src.disconnect();filter.disconnect();amp.disconnect();if(p)p.disconnect();};src.start(t);src.stop(t+dur+.02);}
 update(me,state,yaw,pitch,moving){if(!this.ctx||!me||!this.started||this.ctx.state!=='running')return;let c=this.ctx,t=c.currentTime,l=c.listener;let x=me.x,y=me.y+1.6,z=me.z;if(l.positionX){l.positionX.value=x;l.positionY.value=y;l.positionZ.value=z;l.forwardX.value=Math.cos(yaw)*Math.cos(pitch);l.forwardY.value=Math.sin(pitch);l.forwardZ.value=Math.sin(yaw)*Math.cos(pitch);l.upX.value=0;l.upY.value=1;l.upZ.value=0;}else{l.setPosition(x,y,z);l.setOrientation(Math.cos(yaw),0,Math.sin(yaw),0,1,0);}if(moving&&t-this.lastStep>(me.run?.30:me.crouch?.67:.47)){this.lastStep=t;this.sound('step',{x,y:y-1.5,z});if(Math.random()<.16)this.sound('creak',{x,y:y-1.5,z});}
  let g=state.ghost,dt=this.lastUpdate===null?0:clamp(t-this.lastUpdate,0,.25);this.lastUpdate=t;
  let d=g&&!me.caught&&!me.escaped&&state.phase==='playing'?Math.hypot(g.x-x,g.z-z,g.y-me.y):Infinity;
  this.heart=smoothHeartbeat(this.heart,heartbeatTarget(d),dt);this.heartBus.gain.setTargetAtTime(this.heart.gain,t,.06);
  if(this.heart.gain>.001){this.heartPhase+=dt*this.heart.bpm/60;if(this.heartPhase>=1){this.heartPhase%=1;this.pulse(t);}}else this.heartPhase=1;
  if(g&&state.phase==='playing'&&t>this.nextAmbient){this.nextAmbient=t+4+Math.random()*7;this.sound(Math.random()<.5?'creak':'whisper',{x:g.x,y:g.y+1.2,z:g.z});}
 }
}
