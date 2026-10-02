/* ZEN 操作指南主程式：導覽、搜尋、訪客紀錄（Google Sheet） */
(function(){
const S=window.ZEN_SECTIONS,GAS=(window.ZEN_CONFIG||{}).GAS_URL||"";
const GR={"快速上手":{c:"--c1",i:"🚀"},"欄位介紹":{c:"--c2",i:"🧭"},"轉檔步驟":{c:"--c3",i:"🔁"},"參數設定":{c:"--c4",i:"🛠️"}};
const $=s=>document.querySelector(s),m=$("#m"),nav=$("#nav");
const gc=s=>`style="--gc:var(${GR[s.g].c})"`;
const sub=a=>a?"<ul class=sub>"+a.map(y=>"<li>"+y+"</li>").join("")+"</ul>":"";
const steps=a=>"<ol>"+a.map(x=>{const t=x[0]+sub(x[1]);if(!x[2])return "<li>"+t+"</li>";const inl=x[2][0]=="~",f=inl?x[2].slice(1):x[2],wide=/^init/.test(f),im=`<img class="si${wide?" wide":inl?" sm":""}" loading=lazy src="${img(f)}" alt="">`;return wide||inl?"<li>"+t+im+"</li>":"<li class=row><div class=rw><div>"+t+"</div>"+im+"</div></li>"}).join("")+"</ol>";
const notes=a=>a.flat().map(n=>n[0]=="!"?"<div class='note must'>⚠️ "+n.slice(1)+"</div>":"<div class=note>💡 "+n+"</div>").join("");
const img=n=>typeof n=="number"?`images/slide-${String(n).padStart(2,"0")}.jpg`:"images/"+n;
function card(s){const sp=s.im.length&&typeof s.im[0]=="string";return `<article class=card ${gc(s)}><h2><i>${s.ic}</i>${s.t}</h2><div class=g><span class=tag>${s.g}</span>${s.d}</div>${sp?"<div class=split><div>":""}${steps(s.st)}${notes(s.nt)}${sp?"</div>":""}${s.im.length?`<div class=imgs>${s.im.map(n=>`<img loading=lazy src="${img(n)}" alt="${s.t} 圖示">`).join("")}${sp?"<div class=hint>🔍 點圖可放大</div>":""}</div>`:""}${sp?"</div>":""}</article>`}
function menu(cur){let h="",g="";S.forEach(s=>{if(s.g!=g){g=s.g;h+=`<h4 style="--gc:var(${GR[g].c})">${GR[g].i} ${g}</h4>`}h+=`<a href="#${s.id}" ${gc(s)} class="${s.id==cur?"on":""}"><i class=dot></i>${s.t}</a>`});nav.innerHTML=h}
function home(){menu("");const tk=["q3","q4","q2","q1","q5","c2"].map(id=>S.find(s=>s.id==id));
 m.innerHTML=`<section class=hero><h1>🔬 ZEN 3.4 影像處理與轉檔操作</h1><p>選擇你要做的事，或用上方搜尋框找關鍵字。點步驟可標記完成 ✓</p></section><div class=tasks>${tk.map(s=>`<button class=task ${gc(s)} data-go="${s.id}"><i>${s.ic}</i><b>${s.t}</b><span>${s.d}</span></button>`).join("")}</div>`}
function view(id){const i=S.findIndex(s=>s.id==id);if(i<0)return home();menu(id);
 const p=S[i-1],n=S[i+1];m.innerHTML=card(S[i])+`<div class=nv>${p?`<button class=btn data-go="${p.id}">← ${p.t}</button>`:"<span></span>"}${n?`<button class=btn data-go="${n.id}">${n.t} →</button>`:""}</div>`;scrollTo(0,0);log("view",id)}
function search(v){v=v.trim().toLowerCase();if(!v)return route();menu("");const r=S.filter(s=>(s.t+s.d+s.g+JSON.stringify(s.st)+JSON.stringify(s.nt)).toLowerCase().includes(v));m.innerHTML=r.length?r.map(card).join(""):"<div class=card>找不到符合的內容，請換個關鍵字。</div>"}
function route(){const h=location.hash.slice(1);$("#q").value="";h?view(h):home()}
addEventListener("hashchange",route);
$("#q").addEventListener("input",e=>search(e.target.value));
$("#logo").onclick=()=>{location.hash="";route()};
document.addEventListener("click",e=>{const g=e.target.closest("[data-go]");if(g)location.hash=g.dataset.go;
 const l=e.target.closest("ol>li");if(l&&!e.target.closest(".link")&&!e.target.matches("img"))l.classList.toggle("done");
 if(e.target.matches(".imgs img,.si")){$("#lbi").src=e.target.src;$("#lb").style.display="flex"}if(e.target.closest("#lb"))$("#lb").style.display="none"});

/* ---- 訪客紀錄 → Google Sheet（Apps Script） ---- */
let sid;try{sid=sessionStorage.getItem("sid")||Math.random().toString(36).slice(2)+Date.now().toString(36);sessionStorage.setItem("sid",sid)}catch(e){sid=Math.random().toString(36).slice(2)}
const seen={};
function log(ev,p){if(!GAS)return;const k=ev+p;if(seen[k])return;seen[k]=1;
 try{fetch(GAS,{method:"POST",mode:"no-cors",keepalive:true,headers:{"Content-Type":"text/plain"},body:JSON.stringify({sid,ev,p:p||"",dev:innerWidth<800?"mobile":"desktop",lang:navigator.language,scr:screen.width+"x"+screen.height,ref:document.referrer?new URL(document.referrer).hostname:"direct"})}).catch(()=>{})}catch(e){}}
async function showCount(){const el=$("#cnt");if(!GAS||!el)return;
 try{const r=await(await fetch(GAS+"?action=count")).json();if(r.ok)el.textContent="👥 累計訪客 "+r.total+" 人次"}catch(e){}}
route();log("open","");showCount();
})();
