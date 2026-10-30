/* Рисованная кинематографическая постановка: Canvas, слои, свет, дым и камера. */
class FilmGraphics{
 constructor(canvas){this.c=canvas;this.x=canvas.getContext("2d");this.w=540;this.h=960;this.t=0;this.resize();window.addEventListener("resize",()=>this.resize())}
 resize(){const d=Math.min(devicePixelRatio||1,2);this.c.width=Math.round(this.w*d);this.c.height=Math.round(this.h*d);this.x.setTransform(d,0,0,d,0,0)}
 draw(state,time){
  const x=this.x;this.t=time;x.clearRect(0,0,this.w,this.h);
  const cam=state.shake?Math.sin(time*47)*state.shake:0;
  x.save();x.translate(cam,0);this.background(state,time);this.room(state,time);this.hero(state,time);this.zombies(state,time);this.fx(state,time);x.restore();this.grade(time);
 }
 background(s,t){
  const x=this.x,g=x.createLinearGradient(0,0,0,960);g.addColorStop(0,"#101a20");g.addColorStop(.48,"#3a302b");g.addColorStop(1,"#090b0c");x.fillStyle=g;x.fillRect(0,0,540,960);
  x.save();x.globalAlpha=s.outside?.95:.16;x.fillStyle="#171c1d";x.fillRect(35,250,470,440);
  for(let i=0;i<9;i++){let bx=i*62-12,bh=150+(i*73%190);x.fillStyle=["#202728","#292b2a","#171e20"][i%3];x.fillRect(bx,500-bh,54,bh+190);
   for(let yy=510-bh;yy<660;yy+=26)for(let xx=bx+8;xx<bx+48;xx+=16){x.fillStyle=Math.sin(t*3+i+xx)*.5>.25?"#c17b4b":"#665443";x.fillRect(xx,yy,6,11)}}
  if(s.outside){for(let i=0;i<4;i++){x.fillStyle="#d15b2b";x.globalAlpha=.35+Math.sin(t*4+i)*.15;x.beginPath();x.ellipse(70+i*125,650,35,15,0,0,7);x.fill()}}
  x.restore();x.fillStyle="#343332";x.fillRect(0,0,540,245);x.fillStyle="#4a4540";x.fillRect(0,240,540,15);
  for(let y=25;y<235;y+=52){x.strokeStyle="#242728";x.lineWidth=2;x.beginPath();x.moveTo(0,y);x.lineTo(540,y);x.stroke()}
  for(let xx=35;xx<540;xx+=110){x.strokeStyle="#292b2a";x.beginPath();x.moveTo(xx,0);x.lineTo(xx,245);x.stroke()}
 }
 room(s,t){
  const x=this.x;x.fillStyle="#252525";x.beginPath();x.moveTo(0,570);x.lineTo(540,570);x.lineTo(540,960);x.lineTo(0,960);x.fill();
  x.strokeStyle="#49433d";x.lineWidth=2;for(let i=0;i<8;i++){x.beginPath();x.moveTo(270,570);x.lineTo(i*90-80,960);x.stroke()}
  x.fillStyle="#454746";x.fillRect(18,255,504,380);x.fillStyle="#303536";x.fillRect(26,263,488,364);
  for(let y=275;y<630;y+=38){x.fillStyle=y%76?"#555957":"#4b504f";x.fillRect(29,y,482,27);x.strokeStyle="#242a2a";x.strokeRect(29,y,482,27)}
  x.fillStyle="#7b7468";x.fillRect(40,260,7,370);x.fillRect(493,260,7,370);
  x.fillStyle="#4c382b";x.fillRect(28,610,205,24);x.fillStyle="#252525";x.fillRect(39,634,14,115);x.fillRect(208,634,14,115);
  x.fillStyle="#77746c";x.fillRect(53,592,42,16);x.fillRect(112,585,28,25);x.fillRect(160,590,54,18);
  x.fillStyle="#252a29";x.fillRect(340,390,160,13);x.fillRect(345,403,8,230);x.fillRect(488,403,8,230);
  for(let i=0;i<5;i++){x.fillStyle=["#8a6b45","#59645b","#77715f"][i%3];x.fillRect(357+i*25,350,18,37);x.fillStyle="#25221e";x.fillRect(359+i*25,354,14,27)}
  x.fillStyle="#b5a58b";x.fillRect(356,560,36,34);x.fillStyle="#9b493b";x.fillRect(362,567,24,18);x.fillStyle="#eee0c9";x.font="bold 14px Arial";x.fillText("+",369,581);
  x.fillStyle="#526b72";x.fillRect(410,557,20,37);x.fillStyle="#a9b7b3";x.fillRect(414,551,12,7);x.fillStyle="#a48a54";x.fillRect(443,562,35,28);
  x.save();x.translate(0,s.carShift||0);x.fillStyle="#111718";x.beginPath();x.moveTo(88,730);x.lineTo(110,665);x.quadraticCurveTo(130,628,210,628);x.lineTo(335,650);x.quadraticCurveTo(380,660,405,714);x.lineTo(426,760);x.lineTo(80,760);x.closePath();x.fill();
  const cg=x.createLinearGradient(90,650,410,760);cg.addColorStop(0,"#68706b");cg.addColorStop(.45,"#303a39");cg.addColorStop(1,"#151b1c");x.fillStyle=cg;x.fill();
  x.beginPath();x.moveTo(145,666);x.lineTo(180,635);x.lineTo(303,650);x.lineTo(350,681);x.closePath();x.fillStyle="#172329";x.fill();x.strokeStyle="#7e827a";x.lineWidth=3;x.stroke();
  x.fillStyle="#090c0d";for(const xx of [135,345]){x.beginPath();x.arc(xx,755,31,0,7);x.fill();x.fillStyle="#6c6d66";x.beginPath();x.arc(xx,755,13,0,7);x.fill();x.fillStyle="#090c0d"}x.fillStyle="#b37a4c";x.fillRect(87,714,14,9);x.fillRect(400,714,14,9);x.restore();
  x.strokeStyle="#181b1b";x.lineWidth=5;x.beginPath();x.moveTo(270,0);x.lineTo(270,85);x.stroke();x.fillStyle="#d9c7a1";x.fillRect(240,82,60,13);
  const glow=x.createRadialGradient(270,98,5,270,98,230);glow.addColorStop(0,`rgba(255,220,155,${.22+Math.sin(t*8)*.035})`);glow.addColorStop(1,"rgba(255,190,110,0)");x.fillStyle=glow;x.fillRect(30,0,480,520);
  if(s.phone){x.fillStyle="#10191b";x.fillRect(420,705,65,105);x.fillStyle="#b3d0c1";x.fillRect(426,716,53,80);x.fillStyle="#b84435";x.fillRect(430,722,45,14);x.fillStyle="#15201e";x.font="bold 7px Arial";x.fillText("ТРЕВОГА",433,732);x.fillStyle="#24312d";x.fillText("ОПАСНОСТЬ",431,750);x.fillText("ОСТАВАЙТЕСЬ",431,761);x.fillText("В УКРЫТИИ",431,772)}
  x.fillStyle="#59644a";x.fillRect(25,770,47,90);x.fillStyle="#222a20";x.fillRect(37,758,23,14);x.strokeStyle="#9da18b";x.strokeRect(25,770,47,90);
  x.strokeStyle="#a9a08b";x.lineWidth=5;x.beginPath();x.moveTo(45,884);x.lineTo(110,850);x.stroke();x.fillStyle="#aaa18d";x.fillRect(103,841,24,10);x.fillStyle="#7b7060";x.fillRect(460,865,42,15);x.fillRect(480,842,7,26);
 }
 hero(s,t){
  const x=this.x;if(!s.hero)return;let hx=s.heroX??260,hy=s.heroY??690;
  x.save();x.translate(hx,hy);let stride=Math.sin(t*7)*s.walk*.12;x.fillStyle="#0009";x.beginPath();x.ellipse(0,4,38,9,0,0,7);x.fill();
  x.strokeStyle="#202322";x.lineWidth=17;x.lineCap="round";x.beginPath();x.moveTo(-9,-70);x.lineTo(-13+stride*35,-5);x.moveTo(10,-70);x.lineTo(14-stride*35,-5);x.stroke();
  x.strokeStyle="#393b35";x.lineWidth=23;x.beginPath();x.moveTo(0,-145);x.lineTo(-3,-76);x.stroke();
  x.fillStyle="#394039";x.beginPath();x.moveTo(-25,-143);x.lineTo(22,-143);x.lineTo(29,-83);x.lineTo(-27,-83);x.closePath();x.fill();
  x.strokeStyle="#7a786b";x.lineWidth=2;x.beginPath();x.moveTo(0,-139);x.lineTo(0,-86);x.moveTo(-19,-122);x.lineTo(19,-122);x.stroke();
  x.strokeStyle="#343b35";x.lineWidth=12;x.beginPath();x.moveTo(-20,-133);x.lineTo(-33,-95);x.moveTo(20,-133);x.lineTo(32,-96);x.stroke();
  x.fillStyle="#b28e72";x.beginPath();x.ellipse(0,-160,17,21,0,0,7);x.fill();x.fillStyle="#24211e";x.beginPath();x.arc(0,-169,18,Math.PI,Math.PI*2);x.fill();x.fillRect(-17,-170,34,8);
  if(s.bag){x.fillStyle="#66513a";x.fillRect(18,-137,20,45);x.strokeStyle="#a58a61";x.strokeRect(18,-137,20,45)}
  if(s.flashlight){const beam=x.createLinearGradient(30,-100,150,100);beam.addColorStop(0,"#ffe8aa66");beam.addColorStop(1,"#ffe8aa00");x.fillStyle=beam;x.beginPath();x.moveTo(25,-105);x.lineTo(180,30);x.lineTo(110,120);x.closePath();x.fill()}
  x.restore();
 }
 zombies(s,t){
  const x=this.x;if(!s.zombies)return;const count=s.inside?1:5;
  for(let i=0;i<count;i++){let zx=s.inside?400:35+i*105,zy=s.inside?600:610+(i%3)*28,sc=s.inside?1.05:.42+(i%2)*.12;x.save();x.translate(zx+Math.sin(t*2+i)*7,zy);x.scale(sc,sc);
   x.fillStyle="#090b0b99";x.beginPath();x.ellipse(0,5,31,8,0,0,7);x.fill();x.fillStyle="#333b35";x.beginPath();x.moveTo(-22,-78);x.lineTo(-14,-117);x.lineTo(17,-115);x.lineTo(27,-69);x.lineTo(16,-30);x.lineTo(-20,-31);x.closePath();x.fill();
   x.strokeStyle="#566052";x.lineWidth=13;x.lineCap="round";x.beginPath();x.moveTo(-17,-105);x.lineTo(-37,-69);x.lineTo(-43,-49);x.moveTo(17,-105);x.lineTo(39,-73);x.lineTo(45,-50);x.stroke();x.strokeStyle="#4b5549";x.lineWidth=13;x.beginPath();x.moveTo(-10,-32);x.lineTo(-17,0);x.moveTo(12,-32);x.lineTo(21,0);x.stroke();
   x.fillStyle="#78806b";x.beginPath();x.ellipse(0,-132,19,23,.1,0,7);x.fill();x.fillStyle="#33342c";x.beginPath();x.arc(0,-143,20,Math.PI,Math.PI*2);x.fill();x.fillStyle="#a63e30";x.beginPath();x.arc(-7,-132,3,0,7);x.arc(7,-132,3,0,7);x.fill();x.fillStyle="#241b19";x.fillRect(-8,-119,16,4);x.restore()}
 }
 fx(s,t){
  const x=this.x;for(let i=0;i<45;i++){let px=(i*137+t*(8+i%5)*5)%560,py=(i*83+t*(15+i%4)*7)%980;x.fillStyle=`rgba(210,195,168,${.08+(i%4)*.035})`;x.beginPath();x.arc(px,py,1+(i%3),0,7);x.fill()}
  for(let i=0;i<8;i++){let px=30+i*72+Math.sin(t*.4+i)*20,py=360-((t*13+i*90)%300);x.fillStyle=`rgba(70,75,72,${.06+(i%3)*.025})`;x.beginPath();x.ellipse(px,py,32+i*2,48+i*2,.3,0,7);x.fill()}
  if(s.rain){x.strokeStyle="#a6b8bd38";x.lineWidth=1;for(let i=0;i<55;i++){let px=(i*71+t*120)%540,py=(i*97+t*330)%960;x.beginPath();x.moveTo(px,py);x.lineTo(px-5,py+18);x.stroke()}}
 }
 grade(t){
  const x=this.x;x.fillStyle="rgba(12,19,20,.17)";x.fillRect(0,0,540,960);const g=x.createRadialGradient(270,470,230,270,470,610);g.addColorStop(0,"transparent");g.addColorStop(1,"#000a");x.fillStyle=g;x.fillRect(0,0,540,960);
  for(let i=0;i<100;i++){let px=(i*173+t*11)%540,py=(i*97+t*17)%960;x.fillStyle=`rgba(255,255,255,${Math.random()*.035})`;x.fillRect(px,py,1,1)}
 }
}
window.FilmGraphics=FilmGraphics;