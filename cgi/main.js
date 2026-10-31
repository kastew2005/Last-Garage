import * as THREE from 'three';

const mount=document.querySelector('#stage'), loading=document.querySelector('#loading');
const scene=new THREE.Scene(); scene.background=new THREE.Color(0x090d12); scene.fog=new THREE.FogExp2(0x101820,.035);
const camera=new THREE.PerspectiveCamera(42,9/16,.1,160); camera.position.set(0,3,12);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6)); renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.15; mount.appendChild(renderer.domElement);
const clock=new THREE.Clock(); let playing=false, soundOn=true, filmTime=0, audioCtx=null, lastCaption='';
const mat=(color,rough=.8,metal=0)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});
const concrete=mat(0x34383a), dark=mat(0x171b1d), rust=mat(0x68452e,.8,.65), steel=mat(0x535b5e,.35,.8), rubber=mat(0x090b0c), skin=mat(0x9a7662), jacket=mat(0x20282b), shirt=mat(0x77736c), denim=mat(0x242c35), zombieSkin=mat(0x777f70), zombieCloth=mat(0x37352f), glass=new THREE.MeshPhysicalMaterial({color:0x24333a,roughness:.16,metalness:.45,transparent:true,opacity:.58});
scene.add(new THREE.HemisphereLight(0x9baebe,0x17100c,1.1));
const moon=new THREE.DirectionalLight(0x7894b4,2.2); moon.position.set(-8,12,7); moon.castShadow=true; moon.shadow.mapSize.set(1024,1024); scene.add(moon);
const warm=new THREE.PointLight(0xffa45b,38,18,2); warm.position.set(0,4,0); scene.add(warm);
const red=new THREE.PointLight(0xb51c12,0,13,2); red.position.set(-3,2,4); scene.add(red);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(70,70),concrete); floor.rotation.x=-Math.PI/2; floor.position.y=-.08; floor.receiveShadow=true; scene.add(floor);
function box(parent,w,h,d,material,x,y,z,rx=0,ry=0,rz=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function cyl(parent,r1,r2,h,material,x,y,z,segments=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
const garage=new THREE.Group(); scene.add(garage);
box(garage,12,.35,15,concrete,0,0,-3); box(garage,.35,5,15,concrete,-6,2.5,-3); box(garage,.35,5,15,concrete,6,2.5,-3); box(garage,12,.35,15,dark,0,5,-3);
for(let x=-5.6;x<=5.6;x+=1.4){box(garage,.09,4.8,.12,rust,x,2.5,-10.35);box(garage,.12,.1,15,rust,x,4.9,-3)}
const shutter=new THREE.Group();garage.add(shutter);box(shutter,11.7,4.4,.22,steel,0,2.2,-10.1);
for(let y=.18;y<4.4;y+=.32)box(shutter,11.65,.035,.27,rust,0,y,-9.96);
box(shutter,11.8,.16,.3,dark,0,4.48,-10);
box(garage,1.1,2.5,.16,rust,-5.75,1.25,2.7); box(garage,.9,.08,.2,steel,-5.7,1.2,2.6);
box(garage,3.8,.18,1.0,mat(0x49382b),-4.1,1.3,-4.7);box(garage,3.7,.12,.12,rust,-4.1,.7,-4.25);box(garage,3.7,.12,.12,rust,-4.1,.7,-5.1);
for(let x=-5.7;x<-2.2;x+=1.1){cyl(garage,.045,.045,.65,steel,x,.35,-4.7,8)}
for(let y=1.8;y<4.2;y+=1.1){box(garage,1.8,.1,.65,steel,4.9,y,-5.3);for(let x=4.2;x<5.8;x+=.5){const c=box(garage,.28,.42,.28,mat(x>5?0x77705c:0x39484a),x,y+.25,-5.3);c.rotation.z=.04}}
for(let i=0;i<5;i++){const t=new THREE.Mesh(new THREE.TorusGeometry(.53,.18,10,24),rubber);t.rotation.y=Math.PI/2;t.position.set(4.9,.58+i*.03,-2.6-i*.55);t.castShadow=true;garage.add(t)}
for(let i=0;i<18;i++){const g=new THREE.Group();box(g,.18+Math.random()*.25,.08,.12, i%3?steel:rust,(Math.random()-.5)*10,.08,-8+Math.random()*10);g.position.set((Math.random()-.5)*10,0,-8+Math.random()*10);garage.add(g)}
cyl(garage,.04,.04,.65,dark,0,4.72,-1,8);const bulb=new THREE.Mesh(new THREE.SphereGeometry(.16,12,8),new THREE.MeshBasicMaterial({color:0xffc17a}));bulb.position.set(0,4.35,-1);garage.add(bulb);
for(let i=0;i<5;i++){const cable=new THREE.Mesh(new THREE.TorusGeometry(1.2,.025,6,30,Math.PI),dark);cable.rotation.x=Math.PI/2;cable.position.set(-4+i*2,4.82,-7);garage.add(cable)}
const car=new THREE.Group();scene.add(car);car.position.set(0,0,-3.5);
const carPaint=new THREE.MeshStandardMaterial({color:0x343d3e,metalness:.72,roughness:.28});
box(car,3.8,.72,6.2,carPaint,0,.95,0);box(car,3.15,.85,2.8,carPaint,0,1.68,-.45);box(car,2.95,.08,2.55,glass,0,2.1,-.45);
box(car,3.35,.22,1.2,carPaint,0,1.35,2.35);box(car,3.35,.22,1.2,carPaint,0,1.35,-2.45);
for(const x of [-1.85,1.85])for(const z of [-1.9,1.9]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.57,.57,.3,24),rubber);w.rotation.z=Math.PI/2;w.position.set(x,.62,z);w.castShadow=true;car.add(w);const hub=new THREE.Mesh(new THREE.CylinderGeometry(.23,.23,.32,16),steel);hub.rotation.z=Math.PI/2;hub.position.copy(w.position);car.add(hub)}
const headMat=new THREE.MeshBasicMaterial({color:0xffdca0});for(const x of [-1.25,1.25]){const lamp=new THREE.Mesh(new THREE.BoxGeometry(.55,.24,.08),headMat);lamp.position.set(x,1.12,3.08);car.add(lamp)}
const tailMat=new THREE.MeshBasicMaterial({color:0x8d1710});for(const x of [-1.3,1.3]){const l=new THREE.Mesh(new THREE.BoxGeometry(.4,.2,.08),tailMat);l.position.set(x,1.1,-3.08);car.add(l)}
function human(zombie=false){const g=new THREE.Group();const sm=zombie?zombieSkin:skin, top=zombie?zombieCloth:jacket, pants=zombie?mat(0x302f2b):denim;
const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.38,.78,5,10),top);torso.position.y=1.55;torso.castShadow=true;g.add(torso);
const head=new THREE.Mesh(new THREE.SphereGeometry(.29,16,12),sm);head.scale.set(.85,1.12,.9);head.position.set(0,2.35,0);head.castShadow=true;g.add(head);
const hair=new THREE.Mesh(new THREE.SphereGeometry(.3,12,8,0,Math.PI*2,0,Math.PI*.55),mat(0x171719));hair.position.set(0,2.48,-.02);g.add(hair);
cyl(g,.12,.13,.2,sm,0,2.05,0,10);
const limbs=[];for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.48,1.83,0);const upper=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.55,4,8),top);upper.position.y=-.35;arm.add(upper);const fore=new THREE.Mesh(new THREE.CapsuleGeometry(.105,.48,4,8),sm);fore.position.y=-.82;arm.add(fore);g.add(arm);limbs.push(arm);
const leg=new THREE.Group();leg.position.set(side*.2,1.05,0);const thigh=new THREE.Mesh(new THREE.CapsuleGeometry(.17,.55,4,8),pants);thigh.position.y=-.32;leg.add(thigh);box(leg,.28,.18,.48,mat(0x151515),0,-.8,.1);g.add(leg);limbs.push(leg)}
return {group:g,head,limbs,torso};}
const hero=human(false);scene.add(hero.group);hero.group.position.set(-1.6,0,1.2);
const zombies=[];for(let i=0;i<3;i++){const z=human(true);scene.add(z.group);z.group.position.set(-3+i*2.6,0,-9.4);zombies.push(z)}
box(garage,1.2,.8,.8,dark,-4.7,.48,-1.8);for(let i=0;i<4;i++)box(garage,.04,.5,.04,rust,-5.15+i*.3,.9,-1.8);
for(let i=0;i<4;i++){box(garage,.42,.7,.38,mat(0x6b3826,.6,.35),-5+i*.52,.4,1.5);box(garage,.16,.08,.16,steel,-5+i*.52,.79,1.5)}
const outside=new THREE.Group();scene.add(outside);
for(let i=0;i<7;i++){const x=(i-3)*5.2;const h=5+Math.random()*7;box(outside,3.8,h,3.5,mat(i%2?0x252b30:0x303337),x,h/2,-15-Math.random()*8);for(let y=1;y<h-1;y+=1.5)for(let xx=-1.2;xx<=1.2;xx+=1.2)box(outside,.55,.65,.04,mat(Math.random()>.5?0x151d22:0x343d43),x+xx,y,-13.22)}
const wreck=new THREE.Group();outside.add(wreck);wreck.position.set(-5,0,-7);box(wreck,2.8,.6,4,mat(0x292e30),0,.65,0,0,0,.12);for(const x of [-1.35,1.35])for(const z of [-1.2,1.2]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.22,16),rubber);w.rotation.z=Math.PI/2;w.position.set(x,.45,z);wreck.add(w)}
const rainCount=900, rainGeo=new THREE.BufferGeometry(), rainPos=new Float32Array(rainCount*3);for(let i=0;i<rainCount;i++){rainPos[i*3]=(Math.random()-.5)*36;rainPos[i*3+1]=Math.random()*18;rainPos[i*3+2]=(Math.random()-.5)*35-5}rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPos,3));const rain=new THREE.Points(rainGeo,new THREE.PointsMaterial({color:0x9ab6c9,size:.045,transparent:true,opacity:.5}));scene.add(rain);
const particleN=180, pGeo=new THREE.BufferGeometry(), pPos=new Float32Array(particleN*3), pVel=[];for(let i=0;i<particleN;i++){pPos[i*3]=(Math.random()-.5)*8;pPos[i*3+1]=Math.random()*4;pPos[i*3+2]=-7+Math.random()*12;pVel.push([Math.random()-.5,Math.random()*.8,Math.random()-.5])}pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));const dust=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0xb8a48b,size:.035,transparent:true,opacity:.45}));scene.add(dust);
const smoke=[];for(let i=0;i<12;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.55+Math.random()*.6,10,8),new THREE.MeshBasicMaterial({color:0x343a3c,transparent:true,opacity:.13,depthWrite:false}));s.position.set(-8+Math.random()*16,1+Math.random()*5,-13-Math.random()*8);s.scale.y=1.8;outside.add(s);smoke.push(s)}
const shots=[
[0,[0,3.5,16],[0,2,-5]],[5,[0,2.8,11],[0,2,-7]],[10,[0,2.4,7],[0,1.8,-2]],[15,[-4,2.4,3],[-1,1.5,-3]],[20,[-1,2.1,5],[0,1.8,-9]],[25,[1.8,2.2,4],[0,2,-9]],[32,[-3,2.5,2],[-1,1.7,-9]],[39,[-3,2.4,1],[-2,1.5,-5]],[45,[2.7,2.5,3],[0,1.6,-9]],[52,[1.8,2.0,2],[0,1.5,-9]],[60,[2.2,2.1,2],[0,1.5,-3]],[66,[.6,1.7,1],[0,1.5,-3]],[72,[-2,1.8,2],[0,1.5,-3]],[75,[0,3,8],[0,1,-8]],[82,[0,2.6,13],[0,1,-7]],[90,[0,3,10],[0,1,-7]]
];
function smooth(a){return a*a*(3-2*a)}function cameraAt(t){let i=0;while(i<shots.length-2&&t>shots[i+1][0])i++;const A=shots[i],B=shots[i+1],f=smooth(THREE.MathUtils.clamp((t-A[0])/(B[0]-A[0]),0,1));const v=(k)=>A[k].map((x,j)=>THREE.MathUtils.lerp(x,B[k][j],f));const p=v(1),q=v(2);camera.position.set(...p);camera.lookAt(...q);camera.rotation.z+=Math.sin(t*1.4)*.002;}
function setCaption(txt){if(txt!==lastCaption){lastCaption=txt;const el=document.querySelector('#caption');el.textContent=txt;el.style.opacity=txt?1:0}}
const events=[[0,10,''],[10,20,''],[20,32,'ОНИ СНАРУЖИ'],[32,45,'НУЖНО ВЫБИРАТЬСЯ'],[45,60,''],[60,75,'ЗАВОДИСЬ…'],[75,90,'БЕГИ!']];
function animateWorld(t,dt){
garage.visible=t<75;car.visible=t<90;outside.visible=t>0;
const h=hero.group;let hx=-1.6,hy=0,hz=1.2,rot=0;
if(t<20){hx=-1.6;hz=1.2;rot=.12}else if(t<32){hx=-1.4;hz=1.2;rot=.55}else if(t<45){const f=(t-32)/13;hx=-1.5+f*.7;hz=1.2-f*.5;rot=-.25}else if(t<60){hx=-.7;hz=.7;rot=.3}else if(t<75){hx=.3;hz=-1.8;rot=0}else{hx=0;hz=5;rot=0}
h.position.set(hx,hy,hz);h.rotation.y=rot;
const panic=t>20&&t<60, run=t>=32&&t<45;
hero.limbs.forEach((limb,i)=>{const phase=t*(run?13:panic?5:1.5)+i*Math.PI;limb.rotation.x=Math.sin(phase)*(run?.75:panic?.22:.04);limb.rotation.z=(i%2===0?-.12:.12)+Math.sin(phase*.5)*.04});hero.head.rotation.y=Math.sin(t*1.8)*.08+(panic?.22:0);hero.torso.rotation.z=Math.sin(t*2)*.025;
zombies.forEach((z,i)=>{let x=-3+i*2.6,zz=-9.4;if(t>20){const f=THREE.MathUtils.clamp((t-20)/45,0,1);zz=-9.4+f*(i===0?7:4.5);x+=Math.sin(t*2+i)*.18}if(t>60){zz=-2+i*1.5;x+=Math.sin(t*3+i)*.3}if(t>75){zz=-4+i*2;x+=Math.sin(t*4+i)*.5}z.group.position.set(x,0,zz);z.group.rotation.y=Math.PI+Math.sin(t*2+i)*.25;z.limbs.forEach((l,j)=>{l.rotation.x=Math.sin(t*5+i+j)*.42+(j%2?-.15:.15)});z.head.rotation.x=Math.sin(t*3+i)*.13});
const hit=(t>20&&t<32)||(t>45&&t<60);shutter.position.z=hit?Math.sin(t*8)*.08:0;shutter.rotation.x=hit?Math.sin(t*7)*.012:0;
if(t>45&&t<60){shutter.scale.x=1-.025*smooth((t-45)/15);red.intensity=4+Math.sin(t*15)*3}else{shutter.scale.x=1;red.intensity=t>60?1:0}
if(t>60&&t<75){car.position.x=0;car.position.z=-3.5;car.rotation.y=Math.sin(t*3)*.01}
if(t>=75){const f=THREE.MathUtils.clamp((t-75)/15,0,1);car.position.z=-3.5+f*23;car.position.x=-f*.5;car.rotation.y=-f*.025}
warm.intensity=(t>45&&t<60)?10:(Math.sin(t*8)>0.75?18:38);bulb.material.color.setHex(Math.sin(t*9)>0.88?0x33251a:0xffc17a);
smoke.forEach((s,i)=>{s.position.y=1.5+((t*.28+i*.7)%7);s.material.opacity=.08+.05*Math.sin(t+i)});
const arr=rainGeo.attributes.position.array;for(let i=0;i<rainCount;i++){arr[i*3+1]-=dt*13;if(arr[i*3+1]<0){arr[i*3+1]=16;arr[i*3]=(Math.random()-.5)*36}}rainGeo.attributes.position.needsUpdate=true;rain.visible=t<90;
const da=pGeo.attributes.position.array;for(let i=0;i<particleN;i++){da[i*3]+=pVel[i][0]*dt*.15;da[i*3+1]+=pVel[i][1]*dt*.1;if(da[i*3+1]>5)da[i*3+1]=.1}pGeo.attributes.position.needsUpdate=true;dust.visible=t>20&&t<75;
car.children.forEach(c=>{if(c.material===headMat)c.material.color.setHex(t>74?0xffedc4:0x6d6655)});
}
function update(t,dt){filmTime=THREE.MathUtils.clamp(t,0,90);animateWorld(filmTime,dt);cameraAt(filmTime);let cap='';for(const e of events)if(filmTime>=e[0]&&filmTime<e[1])cap=e[2];setCaption(cap);document.querySelector('#timecode').textContent=`00:${String(Math.floor(filmTime)).padStart(2,'0')} / 01:30`;document.querySelector('#seek').value=filmTime;scene.fog.density=filmTime<10?.026:filmTime<20?.035:filmTime<60?.047:.035}
function audioStart(){if(!soundOn)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();audioCtx.resume()}catch(e){}}
function tone(freq,duration,gain=.04,type='sine'){if(!audioCtx||!soundOn)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration)}
let cueIndex=0;const cues=[[20,70,.25],[32,95,.2],[45,48,.3],[60,58,.25],[75,110,.32],[88,45,.2]];
function checkCues(t){while(cueIndex<cues.length&&t>=cues[cueIndex][0]){tone(cues[cueIndex][1],.7,cues[cueIndex][2],'triangle');cueIndex++}}
function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.05);if(playing){filmTime=Math.min(90,filmTime+dt);checkCues(filmTime);update(filmTime,dt);if(filmTime>=90)finish()}else update(filmTime,dt);renderer.render(scene,camera)}
function finish(){playing=false;document.querySelector('#hud').classList.add('hidden');document.querySelector('#end').classList.remove('hidden')}
function play(){audioStart();document.querySelector('#intro').classList.add('hidden');document.querySelector('#end').classList.add('hidden');document.querySelector('#hud').classList.remove('hidden');playing=true}
document.querySelector('#start').onclick=()=>{filmTime=0;cueIndex=0;play()};document.querySelector('#again').onclick=()=>{filmTime=0;cueIndex=0;play()};
document.querySelector('#pause').onclick=()=>{playing=!playing;document.querySelector('#pause').textContent=playing?'Ⅱ':'▶'};
document.querySelector('#restart').onclick=()=>{filmTime=0;cueIndex=0;playing=true;document.querySelector('#end').classList.add('hidden')};
document.querySelector('#seek').oninput=e=>{filmTime=+e.target.value;cueIndex=cues.findIndex(c=>c[0]>filmTime);if(cueIndex<0)cueIndex=cues.length;update(filmTime,0)};
document.querySelector('#sound').onclick=e=>{soundOn=!soundOn;e.currentTarget.style.opacity=soundOn?1:.4;if(soundOn)audioStart()};
document.querySelector('#fullscreen').onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()};
addEventListener('resize',()=>{camera.aspect=9/16;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6))});
loading.remove();update(0,0);frame();
