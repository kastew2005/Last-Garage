const $=id=>document.getElementById(id),canvas=$("screen"),visual=new FilmVisual(canvas),audio=new FilmAudio();
const D=165;let t=0,run=false,raf=0,last=0,events=new Set(),sound=false;
const scenes=[
[0,"МАГАЗИН · 21:47","Обычный вечер. Последний обычный вечер."],
[12,"ТРЕВОГА","ВНИМАНИЕ. ЗАРЕГИСТРИРОВАНЫ СЛУЧАИ МАССОВОЙ АГРЕССИИ."],
[25,"ПЕРВЫЙ ЗАРАЖЁННЫЙ","Он просил о помощи. А через секунду бросился на продавца."],
[42,"ПОБЕГ","Не оглядывайся. Просто беги."],
[55,"ГОРОД МЁРТВЫХ","Сообщение на телефоне: БАЗА «СЕВЕР-7». ЭВАКУАЦИЯ ВЫЖИВШИХ."],
[72,"ЧУЖИЕ ПРАВИЛА","— Отдай рюкзак. И телефон. Сейчас."],
[91,"АПТЕКА","Тишина здесь страшнее криков."],
[108,"ПОСЛЕДНИЙ ТРАНСПОРТ","ВОСТОЧНЫЙ ПЕРИМЕТР ЗАКРОЕТСЯ ЧЕРЕЗ ДВАДЦАТЬ МИНУТ."],
[126,"ЛОВУШКА","— Нам нужны припасы. А ты никуда не уйдёшь."],
[143,"ПОСЛЕДНИЙ КИЛОМЕТР","База впереди. Но они уже близко."],
[157,"СЕВЕР-7","— Ты добрался. Но ты не представляешь, что снаружи."]
];
const soundEvents=[[12,"alert"],[25,"scream"],[42,"slam"],[55,"wind"],[72,"threat"],[91,"creak"],[100,"attack"],[108,"engine"],[126,"slam"],[143,"rain"],[151,"heartbeat"],[157,"gate"]];
function update(){
 let s=scenes[0];for(const v of scenes)if(t>=v[0])s=v;
 $("chapter").textContent=s[1];$("line").textContent=s[2];$("caption").style.opacity=(t%7<6.5)?".98":"0";
 const mins=Math.floor((21*60+47+t)/60)%24,secs=Math.floor((47+t)%60);
 $("clock").textContent=String(mins).padStart(2,"0")+":"+String(secs).padStart(2,"0");
 $("bar").style.width=(t/D*100)+"%";$("timer").innerHTML=String(Math.floor(t/60)).padStart(2,"0")+":"+String(Math.floor(t%60)).padStart(2,"0")+" <span>02:45</span>";
 for(const [at,name] of soundEvents)if(t>=at&&!events.has(at)){events.add(at);audio.event(name)}
}
function frame(now){if(!run)return;if(!last)last=now;t=Math.min(D,t+Math.min(.05,(now-last)/1000));last=now;update();visual.draw(t);if(t>=D){stop();$("ending").classList.remove("hide");return}raf=requestAnimationFrame(frame)}
function start(from=0){t=from;events=new Set();run=true;last=0;$("intro").classList.add("hidden");$("ending").classList.add("hide");$("play").textContent="Ⅱ";cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}
function stop(){run=false;cancelAnimationFrame(raf);$("play").textContent="▶"}
$("start").onclick=()=>{audio.unlock();start()};$("play").onclick=()=>{if(run)stop();else{audio.unlock();start(t)}};$("restart").onclick=()=>start(0);$("again").onclick=()=>start(0);
$("sound").onclick=()=>{sound=!sound;audio.setEnabled(sound);$("sound").textContent="ЗВУК: "+(sound?"ВКЛ":"ВЫКЛ");if(sound)audio.unlock()};
$("full").onclick=()=>{const e=$("film");if(!document.fullscreenElement)e.requestFullscreen?.().catch(()=>{});else document.exitFullscreen?.()};
document.addEventListener("keydown",e=>{if(e.code==="Space"){e.preventDefault();run?stop():start(t)}});
visual.draw(0);