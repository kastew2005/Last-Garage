/* Процедурный звук без внешних файлов. iOS запускает аудио после нажатия Start. */
class FilmAudio{
  constructor(){this.ctx=null;this.master=null;this.enabled=false;this.ambient=null}
  unlock(){
    if(!this.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;this.ctx=new AC();this.master=this.ctx.createGain();this.master.gain.value=.48;this.master.connect(this.ctx.destination)}
    if(this.ctx.state==="suspended")this.ctx.resume();
  }
  toggle(){this.unlock();this.enabled=!this.enabled;if(this.master)this.master.gain.setTargetAtTime(this.enabled?.48:0,this.ctx.currentTime,.12);if(this.enabled)this.startAmbient();else this.stopAmbient();return this.enabled}
  tone(freq,dur,type="sine",vol=.08,slide=0){
    if(!this.enabled||!this.ctx)return;
    const o=this.ctx.createOscillator(),g=this.ctx.createGain(),t=this.ctx.currentTime;
    o.type=type;o.frequency.setValueAtTime(freq,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,freq+slide),t+dur);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.04);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(this.master);o.start(t);o.stop(t+dur+.03);
  }
  noise(dur=1,vol=.08,filter=500){
    if(!this.enabled||!this.ctx)return;
    const n=Math.floor(this.ctx.sampleRate*dur),b=this.ctx.createBuffer(1,n,this.ctx.sampleRate),d=b.getChannelData(0);
    for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(.7+Math.random()*.3);
    const s=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain(),t=this.ctx.currentTime;
    s.buffer=b;f.type="lowpass";f.frequency.value=filter;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    s.connect(f);f.connect(g);g.connect(this.master);s.start();
  }
  startAmbient(){if(!this.enabled||this.ambient)return;this.ambient=setInterval(()=>{this.tone(48+Math.random()*8,2.8,"sawtooth",.018,-10);if(Math.random()<.22)this.noise(.5,.035,900)},2600)}
  stopAmbient(){clearInterval(this.ambient);this.ambient=null}
  event(name){
    if(!this.enabled)return;
    if(name==="alarm"){this.tone(440,1.2,"sawtooth",.08,180);setTimeout(()=>this.tone(620,1.2,"sawtooth",.07,-180),600)}
    if(name==="bang"){this.noise(.45,.22,180);this.tone(55,.5,"triangle",.13,-25)}
    if(name==="radio"){this.noise(1.3,.12,1600);this.tone(880,.12,"square",.025)}
    if(name==="steps"){this.noise(.16,.07,240);setTimeout(()=>this.noise(.16,.06,240),330)}
    if(name==="growl"){this.tone(75,1.3,"sawtooth",.09,-38);this.noise(.8,.06,380)}
    if(name==="metal"){this.tone(190,.7,"triangle",.12,-100);this.noise(.4,.06,700)}
  }
}
window.filmAudio=new FilmAudio();