const canvas=document.getElementById("film"),gfx=new FilmGraphics(canvas);
const $=id=>document.getElementById(id);
const DURATION=90;
let current=0,playing=false,started=false,last=0,raf=0;
const state={hero:true,heroX:260,heroY:710,walk:0,phone:false,zombies:false,inside:false,bag:false,flashlight:false,rain:false,outside:false,shake:0,carShift:0};
const chapters=[
 {at:0,title:"ГЛАВА 01 · ПЕРВЫЕ СИГНАЛЫ"},
 {at:10,title:"ГЛАВА 02 · ЗА ВОРОТАМИ"},
 {at:20,title:"ГЛАВА 03 · ЧТО У ТЕБЯ ЕСТЬ"},
 {at:35,title:"ГЛАВА 04 · ПЛАН ВЫЖИВАНИЯ"},
 {at:55,title:"ГЛАВА 05 · ОНИ ВНУТРИ"},
 {at:70,title:"ГЛАВА 06 · ПОСЛЕДНИЙ ВЫХОД"}
];
const captions=[
 [0,"Герой чинит машину, пока за стенами гаснет город."],
 [5,"ЭКСТРЕННОЕ ОПОВЕЩЕНИЕ · МАССОВЫЕ НАПАДЕНИЯ"],
 [10,"Не открывай ворота. Сначала оцени обстановку."],
 [15,"Металл содрогается от ударов."],
 [20,"Проверь запасы. Вода важнее еды."],
 [26,"Аптечка, фонарь, телефон и радио."],
 [31,"Машина — только вариант отхода. Проверь топливо."],
 [35,"Укрепи вход, но не блокируй запасной выход."],
 [43,"Собери лёгкий рюкзак. Не бери лишнего."],
 [50,"Слушай эфир. Не шуми без необходимости."],
 [55,"В гараже кто-то есть."],
 [62,"Не вступай в схватку. Дистанция — твой шанс."],
 [70,"Возьми воду, аптечку, фонарь и документы."],
 [78,"Проверь путь и уходи только если маршрут безопасен."],
 [85,"Оставаться здесь больше нельзя."]
];
let fired=new Set();
function updateScene(t){
 let ch=chapters[0];for(const c of chapters)if(t>=c.at)ch=c;
 $("chapter").textContent=ch.title;
 let cap=captions[0];for(const c of captions)if(t>=c[0])cap=c;
 $("subtitle").innerHTML=`<span>${String(Math.floor(t/60)).padStart(2,"0")}:${String(Math.floor(t%60)).padStart(2,"0")}</span>${cap[1]}`;
 $("subtitle").style.opacity=(Math.floor(t*2)%2===0||t%1>.45)?".96":".72";
 state.phone=t>=5&&t<11;state.zombies=t>=10;state.outside=t>=10;state.rain=t>=70;
 state.inside=t>=55&&t<70;state.bag=t>=43;state.flashlight=t>=62;
 state.walk=(t>=10&&t<20)||(t>=35&&t<55)||(t>=70)?1:0;
 state.heroX=t<10?260:t<20?260+(t-10)*5:t<55?245+Math.sin(t)*10:t<70?250:250+(t-70)*1.8;
 state.heroY=t>=70?700:710;
 state.shake=(t>10&&t<18)?.8:(t>55&&t<65?1.8:(t>78&&t<81?1.2:0));
 state.carShift=t>30&&t<35?Math.sin(t*9)*2:0;
 const events=[[5,"alarm"],[10,"bang"],[15,"bang"],[25,"radio"],[35,"metal"],[55,"growl"],[62,"steps"],[79,"metal"]];
 for(const [at,name] of events){if(t>=at&&!fired.has(at)){fired.add(at);filmAudio.event(name)}}
}
function frame(now){
 if(!playing)return;
 if(!last)last=now;const dt=Math.min((now-last)/1000,.05);last=now;current=Math.min(DURATION,current+dt);
 updateScene(current);gfx.draw(state,current);
 $("progress").style.width=(current/DURATION*100)+"%";
 $("elapsed").textContent=String(Math.floor(current/60)).padStart(2,"0")+":"+String(Math.floor(current%60)).padStart(2,"0");
 if(current>=DURATION){finish();return}
 raf=requestAnimationFrame(frame);
}
function start(from=0){
 started=true;current=from;fired=new Set();playing=true;last=0;
 $("startScreen").classList.add("hidden");$("endScreen").classList.add("hidden");
 document.body.classList.add("playing");$("playBtn").textContent="Ⅱ";
 cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);
}
function pause(){playing=false;cancelAnimationFrame(raf);$("playBtn").textContent="▶";document.body.classList.remove("playing")}
function finish(){pause();$("endScreen").classList.remove("hidden")}
$("startBtn").onclick=()=>{filmAudio.unlock();start(0)};
$("playBtn").onclick=()=>{if(!started){filmAudio.unlock();start(0)}else if(playing)pause();else start(current)};
$("restartBtn").onclick=()=>start(0);
$("againBtn").onclick=()=>start(0);
$("skipBtn").onclick=()=>{if(!started){filmAudio.unlock();start(10)}else start(Math.min(90,current+10))};
$("soundBtn").onclick=()=>{const on=filmAudio.toggle();$("soundBtn").textContent=on?"ЗВУК ВКЛ":"ЗВУК ВЫКЛ"};
$("fullBtn").onclick=()=>{const el=$("player");if(!document.fullscreenElement){if(el.requestFullscreen)el.requestFullscreen().catch(()=>{})}else document.exitFullscreen?.()};
canvas.addEventListener("click",()=>{if(playing)pause();else if(started)start(current)});
window.addEventListener("keydown",e=>{if(e.code==="Space"){e.preventDefault();playing?pause():start(current)}});
gfx.draw(state,0);