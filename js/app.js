/* ZEN 操作指南主程式：導覽、搜尋、訪客紀錄（Google Sheet） */
(function(){
const S=window.ZEN_SECTIONS,GAS=(window.ZEN_CONFIG||{}).GAS_URL||"";
const GR={"快速上手":{c:"--c1",i:"🚀"},"欄位介紹":{c:"--c2",i:"🧭"},"轉檔步驟":{c:"--c3",i:"🔁"},"參數設定":{c:"--c4",i:"🛠️"},"問題與回饋":{c:"--c5",i:"❓"}};
const $=s=>document.querySelector(s),m=$("#m"),nav=$("#nav");
const gc=s=>`style="--gc:var(${GR[s.g].c})"`;
const sub=a=>a?"<ul class=sub>"+a.map(y=>"<li>"+y+"</li>").join("")+"</ul>":"";
const pic=f=>{const w=f.startsWith("~~")||/^init/.test(f),s=!w&&f[0]=="~";return `<img class="si${w?" wide":s?" sm":""}" loading=lazy src="${img(f.replace(/^~+/,""))}" alt="">`};
const il=f=>f[0]=="~"||/^init/.test(f);
const steps=a=>{let n=0;return "<ol>"+a.map(x=>{
 if(x[3]){const sts=x[3].map(g=>"<div class=st data-n="+(++n)+">"+g[0]+sub(g[1])+"</div>").join("");
  return il(x[2])?"<li class=grp>"+sts+pic(x[2])+"</li>":"<li class='row grp'><div class=rw><div>"+sts+"</div>"+pic(x[2])+"</div></li>"}
 const t=x[0]+sub(x[1]);
 if(!x[2])return "<li data-n="+(++n)+">"+t+"</li>";
 const L=[].concat(x[2]);
 if(L.every(il))return "<li data-n="+(++n)+">"+t+L.map(pic).join("")+"</li>";
 return "<li class=row data-n="+(++n)+"><div class=rw><div>"+t+"</div>"+pic(L[0])+"</div></li>"}).join("")+"</ol>"};
let lastView="";
const fbForm=()=>`<div class=fbf><h3>💬 留下您的問題或建議</h3><label>類型<select id=fbType><option>內容有誤</option><option>看不懂/不清楚</option><option>軟體操作問題</option><option>功能建議</option><option>其他</option></select></label><label>相關章節（選填）<select id=fbPage><option value="整體/其他">整體/其他</option>${S.filter(s=>s.id!="faq"&&s.id!="feedback").map(s=>`<option value="${s.t}"${s.id==lastView?" selected":""}>${s.t}</option>`).join("")}</select></label><label>內容<textarea id=fbMsg maxlength=500 rows=5 placeholder="請描述遇到的問題或建議（請勿填寫個人或實驗機密資料）"></textarea></label><label>聯絡方式（選填）<input id=fbC maxlength=80 placeholder="Email 或分機，希望回覆時再填"></label><input id=fbHp tabindex=-1 autocomplete=off aria-hidden=true style="position:absolute;left:-9999px"><div class=fbar><span id=fbStat></span><button class="btn pri" id=fbSend>送出</button></div></div>`;
const faq=(a,o)=>a.map(x=>{const t=(S.find(s=>s.id==x[3])||{}).t||"";return `<details class=fq${o?" open":""}><summary>${x[0]}</summary><div class=fb><p><b>可能原因：</b>${x[1]}</p><p><b>解決方式：</b>${x[2]}</p>${t?`<span class=link data-go="${x[3]}">前往：${t} →</span>`:""}</div></details>`}).join("");
const notes=a=>a.flat().map(n=>n[0]=="!"?"<div class='note must'>⚠️ "+n.slice(1)+"</div>":"<div class=note>💡 "+n+"</div>").join("");
const img=n=>typeof n=="number"?`images/slide-${String(n).padStart(2,"0")}.jpg`:"images/"+n;
function card(s,open){const sp=s.im.length&&typeof s.im[0]=="string";return `<article class=card ${gc(s)}><h2><i>${s.ic}</i>${s.t}</h2><div class=g><span class=tag>${s.g}</span>${s.d}</div>${sp?"<div class=split><div>":""}${s.pre?notes(s.pre):""}${steps(s.st)}${notes(s.nt)}${s.faq?faq(s.faq,open):""}${s.post?notes(s.post):""}${s.fb?fbForm():""}${sp?"</div>":""}${s.im.length?`<div class=imgs>${s.im.map(n=>`<img loading=lazy src="${img(n)}" alt="${s.t} 圖示">`).join("")}${sp?"<div class=hint>🔍 點圖可放大</div>":""}</div>`:""}${sp?"</div>":""}</article>`}
function menu(cur){let h="",g="";S.forEach(s=>{if(s.g!=g){g=s.g;h+=`<h4 style="--gc:var(${GR[g].c})">${GR[g].i} ${g}</h4>`}h+=`<a href="#${s.id}" ${gc(s)} class="${s.id==cur?"on":""}"><i class=dot></i>${s.t}</a>`});nav.innerHTML=h}
function home(){menu("");const tk=["q3","q4","q2","q1","q5","c2","faq"].map(id=>S.find(s=>s.id==id));
 m.innerHTML=`<section class=hero><h1>🔬 ZEN 3.4 影像處理與轉檔操作</h1><p>選擇你要做的事，或用上方搜尋框找關鍵字。點步驟可標記完成 ✓</p></section><div class=tasks>${tk.map(s=>`<button class=task ${gc(s)} data-go="${s.id}"><i>${s.ic}</i><b>${s.t}</b><span>${s.d}</span></button>`).join("")}</div>`}
function view(id){const i=S.findIndex(s=>s.id==id);if(i<0)return home();menu(id);if(id!="faq"&&id!="feedback")lastView=id;
 m.innerHTML=card(S[i]);scrollTo(0,0);log("view",id)}
function search(v){v=v.trim().toLowerCase();if(!v)return route();menu("");const r=S.filter(s=>(s.t+s.d+s.g+JSON.stringify(s.st)+JSON.stringify(s.nt)+JSON.stringify(s.faq||[])).toLowerCase().includes(v));logSearch(v,r.length);m.innerHTML=r.length?r.map(s=>card(s,true)).join(""):"<div class=card>找不到符合的內容，請換個關鍵字。</div>"}
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
function post(o){if(!GAS)return;try{fetch(GAS,{method:"POST",mode:"no-cors",keepalive:true,headers:{"Content-Type":"text/plain"},body:JSON.stringify(Object.assign({sid,dev:innerWidth<800?"mobile":"desktop"},o))}).catch(()=>{})}catch(e){}}
function log(ev,p){if(!GAS)return;const k=ev+p;if(seen[k])return;seen[k]=1;
 let ref="direct";try{if(document.referrer)ref=new URL(document.referrer).hostname}catch(e){}
 post({ev,p:p||"",lang:navigator.language,scr:screen.width+"x"+screen.height,ref})}
/* 搜尋紀錄：停止輸入 1.2 秒後才記錄，同一關鍵字每次造訪只記一次 */
let tm;const seenS={};
function logSearch(q,n){clearTimeout(tm);tm=setTimeout(()=>{if(!GAS||seenS[q])return;seenS[q]=1;post({ev:"search",q:q.slice(0,60),n})},1200)}
/* 意見回饋（位於常見問題頁下方） */
let lastFb=0;
document.addEventListener("click",e=>{if(e.target.id!="fbSend")return;
 const msg=$("#fbMsg").value.trim(),sx=$("#fbStat");
 if($("#fbHp").value)return;
 if(msg.length<2){sx.textContent="請先輸入內容";return}
 if(!GAS){sx.textContent="回饋功能尚未啟用";return}
 if(Date.now()-lastFb<30000){sx.textContent="請稍候再送出";return}
 lastFb=Date.now();
 post({ev:"feedback",t:$("#fbType").value,p:$("#fbPage").value,msg:msg.slice(0,500),c:$("#fbC").value.trim().slice(0,80)});
 $("#fbMsg").value="";$("#fbC").value="";sx.textContent="✅ 已送出，謝謝您的回饋！"});
async function showCount(){const el=$("#cnt");if(!GAS||!el)return;
 try{const r=await(await fetch(GAS+"?action=count")).json();if(r.ok)el.textContent="👥 累計訪客 "+r.total+" 人次"}catch(e){}}
route();log("open","");showCount();
})();
