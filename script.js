(()=>{
"use strict";
const $=s=>document.querySelector(s),N=16,W=96,H=64;
const PAL=[["#00f0ff","#ff2bd6","#7b2cff"],["#ff2a3d","#ffe600","#ff2bd6"],["#ffe600","#00f0ff","#ff2a3d"],["#7b2cff","#00f0ff","#ffffff"]];
const MODES=["barras de sinal","ondas","anéis","ruído digital","grade","cidade"];
const BIG=[0,8],WIDE=[5],TALL=[6],EX=[2,4,9,11,13];
const wall=$("#wall"),lk=$("#links"),lx=lk.getContext("2d"),st=$("#status"),root=document.documentElement;
let calm=matchMedia("(prefers-reduced-motion: reduce)").matches,intf=true,soundOn=false,vol=.4,ac,mg,pt=[],last=0;

const say=t=>{st.textContent=t};
const setP=(v,p)=>{v.p=p;v.b.style.setProperty("--k",PAL[p][0])};
const tvs=[...Array(N)].map((_,i)=>{
  const b=document.createElement("button"),c=document.createElement("canvas");
  b.type="button";
  b.className="tv"+(BIG.includes(i)?" big":"")+(WIDE.includes(i)?" wide":"")+(TALL.includes(i)?" tall":"")+(EX.includes(i)?" x":"");
  b.setAttribute("aria-label","Tela "+(i+1)+": ativar para transformar");
  c.width=W;c.height=H;b.appendChild(c);wall.appendChild(b);
  const v={b,c,x:c.getContext("2d"),m:i%6,p:i%4,s:i*1.7,d:0};
  setP(v,v.p);
  b.addEventListener("click",()=>hit(v,i));
  return v;
});

function draw(v,t){
  const x=v.x,k=PAL[v.p],s=v.s,m=v.m;
  x.fillStyle="#06030c";x.fillRect(0,0,W,H);
  if(m===0)for(let i=0;i<12;i++){const a=(Math.sin(t*2+i*.8+s)*.5+.5)*H*.85;x.fillStyle=k[i%3];x.fillRect(i*8,H-a,6,a)}
  else if(m===1)for(let j=0;j<3;j++){x.strokeStyle=k[j];x.beginPath();for(let i=0;i<=W;i+=3){const y=H/2+Math.sin(i*.12+t*(2+j)+s+j)*(10+j*6);i?x.lineTo(i,y):x.moveTo(i,y)}x.stroke()}
  else if(m===2)for(let r=0;r<5;r++){x.strokeStyle=k[r%3];x.beginPath();x.arc(W/2,H/2,((t*14+r*10+s)%50)+2,0,6.3);x.stroke()}
  else if(m===3)for(let i=0;i<150;i++){x.fillStyle=k[(Math.random()*3)|0];x.fillRect((Math.random()*W)|0,(Math.random()*H)|0,3,2)}
  else if(m===4){x.lineWidth=1;for(let i=0;i<W;i+=12){x.strokeStyle=k[0];x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke()}
    for(let j=0;j<H;j+=12){x.strokeStyle=k[1];x.beginPath();x.moveTo(0,j);x.lineTo(W,j);x.stroke()}
    x.fillStyle=k[2];x.fillRect(0,(t*20+s)%H,W,3)}
  else{x.fillStyle=k[2]+"66";x.beginPath();x.arc(70,16,8,0,6.3);x.fill();
    for(let i=0;i<12;i++){const bh=14+((i*37+Math.floor(s)*3)%30);x.fillStyle=k[i%2];x.fillRect(i*8,H-bh,7,bh);
      x.fillStyle="#fff";for(let j=0;j<bh-6;j+=7)if(Math.sin(t*.8+i*j)>.2)x.fillRect(i*8+2,H-bh+j+3,2,3)}}
  if(v.d>0||(intf&&Math.random()<.08)){const a=v.d>0?v.d:.3;
    for(let i=0;i<5;i++){const y=(Math.random()*H)|0;x.drawImage(v.c,0,y,W,3,(Math.random()-.5)*20*a,y,W,3)}
    v.d=Math.max(0,v.d-.03)}
}
function links(t){
  lx.clearRect(0,0,innerWidth,innerHeight);
  for(let n=0;n<N*2;n++){
    const a=n>>1,b=(a+(n&1?5:1))%N,p=pt[a],q=pt[b];if(!p||!q)continue;
    const k=PAL[tvs[a].p][n%3],u=(t*.15+n*.17)%1;
    lx.strokeStyle=k;lx.globalAlpha=.25;lx.beginPath();lx.moveTo(p[0],p[1]);lx.lineTo(q[0],q[1]);lx.stroke();
    lx.globalAlpha=.9;lx.fillStyle=k;lx.fillRect(p[0]+(q[0]-p[0])*u-2,p[1]+(q[1]-p[1])*u-2,4,4);
  }
  lx.globalAlpha=1;
}
function pos(){
  const d=Math.min(devicePixelRatio||1,1.5);
  lk.width=innerWidth*d;lk.height=innerHeight*d;lx.setTransform(d,0,0,d,0,0);
  pt=tvs.map(v=>{const r=v.b.getBoundingClientRect();return r.width?[r.x+r.width/2,r.y+r.height/2]:null});
  render();
}
function render(t=performance.now()/1000){tvs.forEach(v=>{if(v.b.offsetParent)draw(v,t)});links(t)}
function loop(ts){if(!calm&&!document.hidden&&ts-last>41){last=ts;render(ts/1000)}requestAnimationFrame(loop)}

function hit(v,i){
  v.m=(v.m+1)%6;if(v.m%2===0)setP(v,(v.p+1)%4);
  v.d=calm?0:1;v.b.classList.remove("hit");void v.b.offsetWidth;v.b.classList.add("hit");
  say("Tela "+(i+1)+": "+MODES[v.m]);blip(220+v.m*90);if(calm)render();
}
function blip(f){
  if(!soundOn||!ac)return;
  const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime;
  o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(.4,n+.02);g.gain.exponentialRampToValueAtTime(.0001,n+.35);
  o.connect(g).connect(mg);o.start(n);o.stop(n+.4);
}
function setSound(on){
  const b=$("#snd");
  if(on){
    try{
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw new Error("sem áudio");
      if(!ac){ac=new AC();mg=ac.createGain();mg.connect(ac.destination);
        const f=ac.createBiquadFilter();f.type="lowpass";f.frequency.value=500;f.connect(mg);
        [55,82.4,110.5].forEach((fr,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=i?"sine":"sawtooth";o.frequency.value=fr;g.gain.value=i?.25:.12;o.connect(g).connect(f);o.start()});
        const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=.15;lg.gain.value=200;l.connect(lg).connect(f.frequency);l.start()}
      mg.gain.value=vol*.5;ac.resume();soundOn=true;say("Som ligado.");
    }catch(e){soundOn=false;say("Som indisponível neste navegador.")}
  }else{soundOn=false;if(ac)ac.suspend();say("Som desligado.")}
  b.setAttribute("aria-pressed",String(soundOn));
}

$("#intf").addEventListener("click",e=>{intf=!intf;document.body.classList.toggle("intf",intf);e.currentTarget.setAttribute("aria-pressed",String(intf));say(intf?"Interferência ligada.":"Interferência desligada.");if(calm)render()});
$("#shuf").addEventListener("click",()=>{
  const o=[...Array(N).keys()].sort(()=>Math.random()-.5);
  tvs.forEach((v,i)=>{v.b.style.order=o[i];setP(v,(v.p+1)%4);v.s=Math.random()*20;v.d=calm?0:1});
  pos();say("Composição transformada.");blip(330);
});
$("#calm").addEventListener("click",e=>{calm=!calm;document.body.classList.toggle("calm",calm);e.currentTarget.setAttribute("aria-pressed",String(calm));say(calm?"Movimento reduzido.":"Movimento normal.");render()});
$("#snd").addEventListener("click",()=>setSound(!soundOn));
$("#vol").addEventListener("input",e=>{vol=+e.target.value;if(mg)mg.gain.value=vol*.5});
const dlg=$("#dlg");
$("#about").addEventListener("click",()=>{dlg.showModal?dlg.showModal():dlg.setAttribute("open","")});
const closeDlg=()=>{dlg.close?dlg.close():dlg.removeAttribute("open")};
$("#close").addEventListener("click",closeDlg);
dlg.addEventListener("click",e=>{if(e.target===dlg)closeDlg()});
$("#app").addEventListener("pointermove",e=>{if(calm)return;root.style.setProperty("--px",e.clientX/innerWidth-.5);root.style.setProperty("--py",e.clientY/innerHeight-.5)});
addEventListener("resize",pos);addEventListener("orientationchange",()=>setTimeout(pos,250));
document.addEventListener("visibilitychange",()=>{if(document.hidden&&ac&&soundOn)ac.suspend();else if(ac&&soundOn)ac.resume()});

const intro=$("#intro");let gone=false;
function enter(){if(gone)return;gone=true;intro.classList.add("out");setTimeout(()=>intro.remove(),900);const f=document.querySelector(".tv");if(f)f.focus({preventScroll:true})}
$("#skip").addEventListener("click",enter);setTimeout(enter,5200);

document.body.classList.toggle("intf",intf);document.body.classList.toggle("calm",calm);
$("#calm").setAttribute("aria-pressed",String(calm));
pos();requestAnimationFrame(loop);
})();
