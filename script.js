(()=>{
"use strict";
const $=s=>document.querySelector(s),root=document.documentElement,wall=$("#wall"),st=$("#status");
const PALS=[
{sky:["#0a0420","#2b0a63","#7a1fa2","#e0218a","#ff7a45"],sun:"#ffd0f0",far:"#2a0d5e",mtn:"#150733",rim:"#00f0ff",bld:"#0c0420",win:"#ffe600",sea:["#2b0a63","#0b3d8a","#00b8d4"],neon:"#ff2bd6"},
{sky:["#150100","#5a0a10","#c4161c","#ff6a00","#ffe600"],sun:"#fff2a0",far:"#5a0a1a",mtn:"#2a0610",rim:"#ffe600",bld:"#160205",win:"#fff6a0",sea:["#3a0610","#8a1020","#ff6a00"],neon:"#ff2a3d"},
{sky:["#00040f","#001d3d","#003d80","#00a8c8","#b8ffff"],sun:"#ffffff",far:"#002a55",mtn:"#001126",rim:"#ff2bd6",bld:"#000a1a",win:"#00f0ff",sea:["#001d3d","#00508f","#00d0e8"],neon:"#00f0ff"}];
const NAMES=["Neon","Calor","Ciano"];
const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const RIDGE=[[0,.52],[.08,.44],[.16,.38],[.24,.3],[.3,.2],[.33,.19],[.36,.24],[.42,.34],[.5,.44],[.56,.52],[.6,.6],[.62,.72]];
const FAR=[[0,.5],[.12,.42],[.25,.46],[.4,.38],[.55,.47],[.75,.4],[.9,.45],[1,.42]];
const DOIS=[[.8,.72],[.84,.58],[.88,.5],[.91,.55],[.94,.46],[.98,.52],[1,.56]];
const PH=180,BY=[[0,2],[3,1]];
let PW,base,bx,fr,fx,hz,stars=[],wins=[],cable,cristo,pal=0,seed=7,tvs=[],G=0,gs=0,calm=matchMedia("(prefers-reduced-motion: reduce)").matches,intf=true,soundOn=false,vol=.4,ac,mg,last=0;

const say=t=>{st.textContent=t};
const at=(p,u)=>{if(u<p[0][0]||u>p[p.length-1][0])return null;for(let i=0;i<p.length-1;i++)if(u<=p[i+1][0]){const k=(u-p[i][0])/(p[i+1][0]-p[i][0]);return p[i][1]+(p[i+1][1]-p[i][1])*k}return null};

function buildBase(){
  const P=PALS[pal],R=rng(11);
  const mk=()=>{const c=document.createElement("canvas");c.width=PW;c.height=PH;return c};
  base=mk();fr=mk();bx=base.getContext("2d");fx=fr.getContext("2d");
  hz=Math.round(PH*.72);stars=[];wins=[];
  const f=(c,x,y,w=1,h=1)=>{bx.fillStyle=c;bx.fillRect(x|0,y|0,w,h)};
  const dith=(cols,y,x,t)=>{const n=cols.length-1,i=Math.min(n-1,Math.floor(t*n)),fr2=t*n-i;return cols[i+(fr2>(BY[y&1][x&1]+.5)/4?1:0)]};
  for(let y=0;y<hz;y++)for(let x=0;x<PW;x++)f(dith(P.sky,y,x,y/hz),x,y);
  const sx=PW*.8,sy=PH*.2,sr=PH*.09;
  for(let y=-sr;y<=sr;y++)for(let x=-sr;x<=sr;x++)if(x*x+y*y<=sr*sr)f(P.sun,sx+x,sy+y);
  for(let i=0;i<45;i++)stars.push([R()*PW|0,R()*hz*.45|0]);
  const ridge=(pts,col,rim)=>{for(let x=0;x<PW;x++){const v=at(pts,x/PW);if(v==null)continue;const y=Math.round(v*PH);if(y>=hz)continue;f(col,x,y,1,hz-y);if(rim)f(rim,x,y)}};
  ridge(FAR,P.far);ridge(RIDGE,P.mtn,P.rim);ridge(DOIS,P.mtn,P.rim);
  const dome=(cu,hw,h,col)=>{let top0=hz;for(let x=Math.floor((cu-hw)*PW);x<=(cu+hw)*PW;x++){const d=(x/PW-cu)/hw;if(Math.abs(d)>1)continue;const y=Math.round(hz-PH*h*Math.pow(1-d*d,.6));f(col,x,y,1,hz-y);f(P.rim,x,y);if(y<top0)top0=y}return top0};
  const sug=dome(.7,.085,.38,P.mtn),urca=dome(.575,.065,.2,P.mtn);
  cable={x1:.575*PW|0,y1:urca,x2:.69*PW|0,y2:sug+3};
  for(let i=0;i<=40;i++)f(P.neon,cable.x1+(cable.x2-cable.x1)*i/40,cable.y1+(cable.y2-cable.y1)*i/40);
  const cx=Math.round(.315*PW),top=Math.round(at(RIDGE,.315)*PH);cristo={x:cx,y:top-17};
  bx.globalAlpha=.3;bx.fillStyle=P.neon;bx.beginPath();bx.arc(cx,top-10,16,0,6.3);bx.fill();bx.globalAlpha=1;
  f(P.sun,cx-3,top-3,6,3);f(P.sun,cx-1,top-14,2,12);f(P.sun,cx-8,top-12,16,2);f(P.sun,cx-1,top-17,2,3);
  for(let y=hz;y<PH;y++)for(let x=0;x<PW;x++)f(dith([P.sea[2],P.sea[1],P.sea[0]],y,x,(y-hz)/(PH-hz)),x,y);
  for(let i=0;i<70;i++){bx.globalAlpha=.5;f(P.neon,R()*PW,hz+10+R()*(PH-hz-14),1,3);bx.globalAlpha=1}
  for(let x=0;x<PW;){const w=4+(R()*6|0),near=Math.abs(x/PW-.45),h=PH*(.05+R()*(.17-near*.2)),y=hz+3-h;f(P.bld,x,y,w,h);f(P.rim,x,y,w,1);
    for(let wy=y+3;wy<hz;wy+=3)for(let wx=x+1;wx<x+w-1;wx+=3)if(R()<.4)wins.push([wx,wy]);x+=w+(R()<.3?1:0)}
  for(const [wx,wy] of wins)f(P.win,wx,wy);
  for(let y=hz+3;y<hz+9;y++)for(let x=0;x<PW;x++)f(((x>>1)+(y>>1)+Math.round(Math.sin(x*.28)*1.5))&1?"#e8dcff":"#1a0b33",x,y);
  root.style.setProperty("--acc",P.neon);
}
function compose(t){
  const P=PALS[pal];fx.globalAlpha=1;fx.drawImage(base,0,0);
  stars.forEach((s,i)=>{fx.globalAlpha=.3+.7*Math.abs(Math.sin(t*1.2+i));fx.fillStyle="#fff";fx.fillRect(s[0],s[1],1,1)});
  fx.globalAlpha=1;
  wins.forEach((w,i)=>{if(Math.sin(t*.5+i*2.7)<-.5){fx.fillStyle=P.bld;fx.fillRect(w[0],w[1],1,1)}});
  fx.globalAlpha=.6;fx.fillStyle=P.sea[2];
  for(let k=0;k<30;k++)fx.fillRect((k*53+t*(6+k%5*3))%PW,hz+12+((k*29)%(PH-hz-14)),3+k%4,1);
  fx.globalAlpha=1;
  const u=Math.sin(t*.3)*.5+.5;fx.fillStyle="#fff";fx.fillRect(cable.x1+(cable.x2-cable.x1)*u-1,cable.y1+(cable.y2-cable.y1)*u,3,2);
  fx.globalAlpha=.5+.5*Math.sin(t*1.5);fx.fillStyle="#ff2a3d";fx.fillRect(cristo.x,cristo.y,1,1);fx.globalAlpha=1;
}

function buildTvs(){
  wall.textContent="";tvs=[];
  const SW=wall.clientWidth,SH=wall.clientHeight;if(!SW||!SH)return;
  PW=Math.max(100,Math.min(480,Math.round(PH*SW/SH)));buildBase();
  const cell=Math.max(64,Math.min(SW,SH)/5),cols=Math.max(3,Math.round(SW/cell)),rows=Math.max(3,Math.round(SH/cell)),cw=SW/cols,ch=SH/rows;
  const R=rng(seed),V=rng(seed+5),leaves=[];
  (function sp(x,y,w,h){
    if(w*h<=1||(w*h<=4&&R()<.5))return leaves.push([x,y,w,h]);
    if(w>h||(w===h&&R()<.5)){const k=1+(R()*(w-1)|0);sp(x,y,k,h);sp(x+k,y,w-k,h)}
    else{const k=1+(R()*(h-1)|0);sp(x,y,w,k);sp(x,y+k,w,h-k)}
  })(0,0,cols,rows);
  const frag=document.createDocumentFragment();
  leaves.forEach(([x,y,w,h],i)=>{
    const b=document.createElement("button"),s=document.createElement("span"),c=document.createElement("canvas");
    b.type="button";b.className="tv";b.setAttribute("aria-label","Televisor "+(i+1)+": provocar falha de sinal");
    Object.assign(b.style,{left:x*cw+1+"px",top:y*ch+1+"px",width:w*cw-2+"px",height:h*ch-2+"px"});
    b.style.setProperty("--bz",Math.max(4,Math.min(11,Math.min(w*cw,h*ch)*.07))+"px");
    s.className="scr";c.style.filter="hue-rotate("+((V()-.5)*16).toFixed(1)+"deg) saturate("+(1+V()*.25).toFixed(2)+") brightness("+(.9+V()*.15).toFixed(2)+")";
    s.appendChild(c);b.appendChild(s);frag.appendChild(b);
    const v={b,s,c,cx:c.getContext("2d"),i,g:0};tvs.push(v);
    b.addEventListener("click",()=>{jolt(v,1);say("Televisor "+(i+1)+": falha de sinal");blip(180+(i%7)*60)});
  });
  wall.appendChild(frag);
  const sr=wall.getBoundingClientRect();
  tvs.forEach(v=>{const r=v.s.getBoundingClientRect();v.c.width=Math.max(1,Math.round(r.width));v.c.height=Math.max(1,Math.round(r.height));
    v.sx=(r.left-sr.left)/SW*PW;v.sy=(r.top-sr.top)/SH*PH;v.sw=r.width/SW*PW;v.sh=r.height/SH*PH});
  frame(calm?0:performance.now()/1000);
}
function rt(v){
  const c=v.cx,w=v.c.width,h=v.c.height;c.imageSmoothingEnabled=false;c.globalAlpha=1;
  c.drawImage(fr,v.sx,v.sy,v.sw,v.sh,0,0,w,h);
  const a=Math.max(G,v.g);if(a<.02)return;
  for(let i=0,n=Math.ceil(a*9);i<n;i++){const y=Math.random()*h,sh=2+Math.random()*10;c.drawImage(v.c,0,y,w,sh,(Math.random()-.5)*a*w*.6,y,w,sh)}
  c.globalAlpha=.35*a;c.fillStyle=Math.random()<.5?"#ff2bd6":"#00f0ff";c.fillRect(0,Math.random()*h,w,3+Math.random()*h*.12);
  c.globalAlpha=.6;c.fillStyle="#fff";for(let i=0,n=a*50|0;i<n;i++)c.fillRect(Math.random()*w,Math.random()*h,2,1);
  if(a>.75&&(v.i+gs)%6===0)for(let i=0,n=w*h/50;i<n;i++){c.globalAlpha=Math.random()*.7;c.fillRect(Math.random()*w,Math.random()*h,2,2)}
  c.globalAlpha=1;
}
function frame(t){compose(t);tvs.forEach(rt)}
function loop(ts){
  if(!calm&&!document.hidden&&ts-last>41){last=ts;
    if(intf&&tvs.length&&Math.random()<.04)tvs[Math.random()*tvs.length|0].g=.4;
    G*=.965;if(G<.02)G=0;tvs.forEach(v=>v.g*=.93);frame(ts/1000)}
  requestAnimationFrame(loop);
}
function still(){setTimeout(()=>{G=0;tvs.forEach(v=>v.g=0);frame(0)},700)}
function jolt(v,a){v.g=a;if(calm){frame(0);still()}}
function glitchAll(a=1){G=a;gs=Math.random()*6|0;if(calm){frame(0);still()}}

function blip(f){
  if(!soundOn||!ac)return;
  const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime;
  o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(.4,n+.02);g.gain.exponentialRampToValueAtTime(.0001,n+.35);
  o.connect(g).connect(mg);o.start(n);o.stop(n+.4);
}
function setSound(on){
  if(on){
    try{
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw new Error("sem áudio");
      if(!ac){ac=new AC();mg=ac.createGain();mg.connect(ac.destination);
        const f=ac.createBiquadFilter();f.type="lowpass";f.frequency.value=500;f.connect(mg);
        [55,82.4,110.5].forEach((fr0,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=i?"sine":"sawtooth";o.frequency.value=fr0;g.gain.value=i?.25:.12;o.connect(g).connect(f);o.start()});
        const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=.15;lg.gain.value=200;l.connect(lg).connect(f.frequency);l.start()}
      mg.gain.value=vol*.5;ac.resume();soundOn=true;say("Som ligado.");
    }catch(e){soundOn=false;say("Som indisponível neste navegador.")}
  }else{soundOn=false;if(ac)ac.suspend();say("Som desligado.")}
  $("#snd").setAttribute("aria-pressed",String(soundOn));
}

$("#glitch").addEventListener("click",()=>{glitchAll(1);say("Falha de sinal em toda a instalação.");blip(120)});
$("#pal").addEventListener("click",e=>{pal=(pal+1)%3;e.currentTarget.textContent="Cores: "+NAMES[pal];buildBase();glitchAll(.7);frame(calm?0:performance.now()/1000);say("Paleta "+NAMES[pal]+".");blip(440)});
$("#shuf").addEventListener("click",()=>{seed=1+Math.floor(Math.random()*1e5);buildTvs();glitchAll(.6);say("Televisores reorganizados. O panorama continua o mesmo.");blip(330)});
$("#intf").addEventListener("click",e=>{intf=!intf;e.currentTarget.setAttribute("aria-pressed",String(intf));say(intf?"Interferência ligada.":"Interferência desligada.")});
$("#calm").addEventListener("click",e=>{calm=!calm;document.body.classList.toggle("calm",calm);e.currentTarget.setAttribute("aria-pressed",String(calm));say(calm?"Movimento reduzido.":"Movimento normal.");G=0;tvs.forEach(v=>v.g=0);frame(calm?0:performance.now()/1000)});
$("#snd").addEventListener("click",()=>setSound(!soundOn));
$("#vol").addEventListener("input",e=>{vol=+e.target.value;if(mg)mg.gain.value=vol*.5});
const dlg=$("#dlg"),closeDlg=()=>{dlg.close?dlg.close():dlg.removeAttribute("open")};
$("#about").addEventListener("click",()=>{dlg.showModal?dlg.showModal():dlg.setAttribute("open","")});
$("#close").addEventListener("click",closeDlg);
dlg.addEventListener("click",e=>{if(e.target===dlg)closeDlg()});
let rz;const onResize=()=>{clearTimeout(rz);rz=setTimeout(buildTvs,180)};
addEventListener("resize",onResize);addEventListener("orientationchange",onResize);
document.addEventListener("visibilitychange",()=>{if(!ac||!soundOn)return;document.hidden?ac.suspend():ac.resume()});

const intro=$("#intro");let gone=false;
function enter(){if(gone)return;gone=true;intro.classList.add("out");setTimeout(()=>intro.remove(),900);const f=document.querySelector(".tv");if(f)f.focus({preventScroll:true})}
$("#skip").addEventListener("click",enter);setTimeout(enter,5200);

document.body.classList.toggle("calm",calm);$("#calm").setAttribute("aria-pressed",String(calm));
buildTvs();requestAnimationFrame(loop);
})();
