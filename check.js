
const KEY='etude360_v11';
const START_DATE=new Date(Date.UTC(2027,0,2));
const MONTH_NAMES=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const NAV=[['dashboard','◫ Tableau de bord'],['agenda','☷ Bureau du jour'],['dossiers','▤ Dossiers'],['amiable','☎ Pôle amiable'],['team','♙ Équipe'],['finance','€ Finances'],['clients','◇ Mandants'],['journal','◷ Journal']];
const SECTORS=[
  {sector:'Banque',name:'Banque du Nord',volume:85,color:'blue'},
  {sector:'Énergie',name:'Énergie Métropole',volume:120,color:'gold'},
  {sector:'Immobilier',name:'Agence Lilloise Immo',volume:12,color:'green'},
  {sector:'Télécom',name:'Connect Télécom',volume:32,color:'red'}
];
const DEBTOR_PROFILES=[
  {key:'solvable',label:'Salarié solvable',icon:'👔',style:'green',amiable:[.72,.9],judicial:[.55,.78]},
  {key:'fragile',label:'Foyer fragile',icon:'🏠',style:'gold',amiable:[.5,.68],judicial:[.42,.62]},
  {key:'artisan',label:'Artisan sous tension',icon:'🛠',style:'blue',amiable:[.55,.74],judicial:[.46,.67]},
  {key:'mauvais_payeur',label:'Mauvais payeur',icon:'🕶',style:'red',amiable:[.35,.52],judicial:[.38,.6]},
  {key:'societe_difficile',label:'Société en difficulté',icon:'🏭',style:'gold',amiable:[.4,.58],judicial:[.35,.55]},
  {key:'introuvable',label:'Débiteur introuvable',icon:'🚚',style:'red',amiable:[.2,.35],judicial:[.25,.44]},
  {key:'cooperatif',label:'Débiteur coopératif',icon:'🤝',style:'green',amiable:[.8,.95],judicial:[.62,.84]}
];
const ACTIONS={
  relance:{label:'Relance écrite',cost:3,delay:2,msg:'Relance écrite envoyée.',kind:'amiable'},
  appel:{label:'Appeler le débiteur',cost:4,delay:1,msg:'Appel du débiteur programmé.',kind:'amiable'},
  mise:{label:'Mise en demeure',cost:7,delay:4,msg:'Mise en demeure adressée.',kind:'prereq'},
  enquete:{label:'Enquête de solvabilité',cost:24,delay:3,msg:'Recherche de solvabilité lancée.',kind:'prep'},
  titre:{label:'Demande de titre',cost:35,delay:10,msg:'Demande de titre simulée.',kind:'title'},
  commandement:{label:'Commandement',cost:20.42,delay:2,msg:'Commandement délivré.',kind:'act'},
  saisiebanque:{label:'Saisie bancaire',cost:77.36,delay:6,msg:'Saisie-attribution engagée.',kind:'act'},
  saisiemob:{label:'Saisie-vente',cost:66,delay:9,msg:'Saisie-vente préparée.',kind:'act'},
  plan:{label:'Échéancier',cost:6,delay:2,msg:'Proposition d’échéancier transmise.',kind:'amiable'},
  cloture:{label:'Classement sans suite',cost:0,delay:0,msg:'Le dossier est classé.',kind:'close'}
};
const STAFF_LIBRARY={
  clerc:{role:'Clerc gestionnaire',salary:2200,skill:62,avatar:'📁',hire:1500},
  clerc_senior:{role:'Clerc principal',salary:3100,skill:78,avatar:'⚖️',hire:1800},
  compta:{role:'Comptable étude',salary:2450,skill:70,avatar:'🧾',hire:1600},
  amiable:{role:'Chargé amiable',salary:2100,skill:64,avatar:'☎',hire:1500}
};
const FIRST=['Claire','Julien','Maya','Lina','Antoine','Sophie','Hugo','Nora','Sarah','Mathis','Louis','Camille','Noah','Léa'];
const LAST=['Morel','Bernard','Petit','Dubois','Lefebvre','Garcia','Lambert','Robert','Dumont','Chevalier','Marchand','Colas'];

let state=loadState();
let currentTab='dashboard';

function initialState(){
  return {
    day:0,
    cash:36000,
    trust:0,
    reputation:58,
    xp:0,
    nextCaseId:1100,
    nextStaffId:10,
    marketing:1,
    studyName:'Étude 360',
    objective:{profit:65000,months:12},
    staff:[
      {id:1,name:'Claire Morel',type:'clerc_senior',role:'Clerc principal',salary:3100,skill:78,avatar:'⚖️'},
      {id:2,name:'Julien Bernard',type:'clerc',role:'Clerc gestionnaire',salary:2200,skill:63,avatar:'📁'},
      {id:3,name:'Maya Petit',type:'compta',role:'Comptable étude',salary:2450,skill:70,avatar:'🧾'},
      {id:4,name:'Nora Dubois',type:'amiable',role:'Chargé amiable',salary:2100,skill:64,avatar:'☎'}
    ],
    clients:[
      {id:1,name:'Banque du Nord',sector:'Banque',monthlyVolume:85,satisfaction:71},
      {id:2,name:'Énergie Métropole',sector:'Énergie',monthlyVolume:120,satisfaction:66},
      {id:3,name:'Agence Lilloise Immo',sector:'Immobilier',monthlyVolume:12,satisfaction:74}
    ],
    dossiers:seedStartingCases(),
    events:[{day:0,msg:'Bienvenue. Votre étude démarre avec une petite équipe et une trésorerie limitée. Rentabilité et discipline seront essentielles.'}],
    ledger:[],
    months:[],
    lastMonthProcessed:-1,
    marketMood:52,
    generatedThisMonth:-1,
    lost:false,
    won:false
  };
}

function seedStartingCases(){
  const ds=[];
  const seeds=[
    ['Thomas Renard','Banque du Nord','judicial',3250,true],
    ['SCI des Flandres','Agence Lilloise Immo','judicial',8400,true],
    ['SAS Bâtiment Réuni','Banque du Nord','amiable',12900,false],
    ['M. André Colas','Énergie Métropole','amiable',780,false],
    ['Mme Sophie Dubois','Agence Lilloise Immo','judicial',1850,false],
    ['SARL Horizon 26','Banque du Nord','amiable',5400,false],
    ['Ateliers Lambert','Énergie Métropole','judicial',2100,true]
  ];
  let cid=1001;
  for(const [name,client,pole,amount,title] of seeds){
    ds.push(createCase({id:cid++,name,client,pole,amount,title,age:rand(2,24),assigned:true}));
  }
  return ds;
}

function createCase({id,name,client,pole='judicial',amount,title=false,age=0,assigned=false}){
  const profile=pick(DEBTOR_PROFILES);
  const colorMap={green:'green',gold:'gold',red:'red',blue:'blue'};
  const caseObj={
    id:id ?? state.nextCaseId++,
    name,
    client,
    sector:findClient(client)?.sector || pick(SECTORS).sector,
    pole,
    amount:money(amount),
    principalLeft:money(amount),
    principalRecovered:0,
    feesLeft:0,
    rightsLeft:0,
    title,
    age,
    state:'En cours',
    statusLabel:pole==='amiable'?'Traitement amiable':'À arbitrer',
    profile:profile.key,
    profileLabel:profile.label,
    profileIcon:profile.icon,
    badgeStyle:colorMap[profile.style],
    amiableRate:between(profile.amiable[0],profile.amiable[1]),
    judicialRate:between(profile.judicial[0],profile.judicial[1]),
    assignedTo:assigned ? randomJudicialStaffId() : null,
    priority:rand(1,3),
    history:[{day:state?state.day:0,msg:`Dossier ouvert pour ${client}.`}],
    nextActionDay:(state?state.day:0)+rand(0,3),
    pending:null,
    miseSent:null,
    commandementSent:null,
    solvencyHint:null,
    paymentPlan:null,
    lastPayment:0,
    monthlyTarget:0,
    amicableReviewDay:pole==='amiable' ? (state?state.day:0)+rand(6,28) : null,
    progress:rand(4,18),
    visualMood:pick(['stable','tense','hot'])
  };
  return caseObj;
}

function loadState(){
  try{const raw=localStorage.getItem(KEY); if(raw){const parsed=JSON.parse(raw); migrate(parsed); return parsed;}}catch(e){}
  const init=initialState();
  bootstrapLedger(init);
  return init;
}
function migrate(g){
  if(!g.ledger)g.ledger=[]; if(!g.months)g.months=[]; if(g.generatedThisMonth===undefined)g.generatedThisMonth=-1; if(g.objective===undefined)g.objective={profit:65000,months:12}; if(g.marketMood===undefined)g.marketMood=52; if(g.nextStaffId===undefined)g.nextStaffId=100; if(g.won===undefined)g.won=false; if(g.lost===undefined)g.lost=false;
  for(const c of g.clients||[]){ if(c.monthlyVolume===undefined)c.monthlyVolume=12; if(c.satisfaction===undefined)c.satisfaction=68; }
  for(const d of g.dossiers||[]){
    if(d.principalLeft===undefined)d.principalLeft=d.amount;
    if(d.principalRecovered===undefined)d.principalRecovered=0;
    if(d.history===undefined)d.history=[];
    if(d.nextActionDay===undefined)d.nextActionDay=g.day;
    if(d.statusLabel===undefined)d.statusLabel='À arbitrer';
    if(d.amiableRate===undefined)d.amiableRate=between(.5,.85);
    if(d.judicialRate===undefined)d.judicialRate=between(.4,.72);
    if(d.profileLabel===undefined){ const p=DEBTOR_PROFILES.find(x=>x.key===d.profile)||pick(DEBTOR_PROFILES); d.profile=p.key; d.profileLabel=p.label; d.profileIcon=p.icon; d.badgeStyle=p.style; }
    if(d.progress===undefined)d.progress=10;
  }
}
function save(){ localStorage.setItem(KEY,JSON.stringify(state)); }
function bootstrapLedger(g){
  logEntry(g,'fixed',0,'Initialisation');
  rollMonthIfNeeded(g,true);
}
function toast(msg){const t=document.getElementById('toast'); t.textContent=msg; t.classList.remove('hide'); clearTimeout(window.tt); window.tt=setTimeout(()=>t.classList.add('hide'),3200);}
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function between(a,b){return Math.round((a+Math.random()*(b-a))*100)/100}
function money(n){return Math.round((Number(n)||0)*100)/100}
function euro(n){return money(n).toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}
function dayDate(day){const d=new Date(START_DATE); d.setUTCDate(d.getUTCDate()+day); return d}
function monthKey(day=state.day){const d=dayDate(day); return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`}
function datefmt(day){const d=dayDate(day); return `${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`}
function log(msg){state.events.unshift({day:state.day,msg}); if(state.events.length>300)state.events.length=300}
function logCase(d,msg){d.history.unshift({day:state.day,msg}); if(d.history.length>80)d.history.length=80}
function findClient(name){return state && state.clients ? state.clients.find(c=>c.name===name) : null}
function level(){return Math.max(1,1+Math.floor(state.xp/180))}
function nextLevelXp(){return level()*180}
function studyRank(){const l=level(); return l<=2?'Étude naissante':l<=4?'Étude installée':l<=6?'Étude reconnue':l<=8?'Étude de référence':'Étude de premier plan'}
function judicialStaff(){return state.staff.filter(s=>/clerc/i.test(s.role))}
function amiableStaff(){return state.staff.filter(s=>/amiable/i.test(s.role))}
function accountingStaff(){return state.staff.filter(s=>/comptable/i.test(s.role))}
function clercCapacity(){return judicialStaff().length*25}
function amiableCapacity(){return amiableStaff().length*100}
function judicialLoad(){return activeCases().filter(d=>d.pole==='judicial').length}
function amiableLoad(){return activeCases().filter(d=>d.pole==='amiable').length}
function activeCases(){return state.dossiers.filter(d=>d.state==='En cours')}
function completedCases(){return state.dossiers.filter(d=>d.state==='Terminé')}
function overdueTasks(){return tasks().filter(t=>t.due<state.day)}
function marketingMonthly(){return state.marketing*850}
function fixedMonthlyCosts(){return 2900+480+marketingMonthly()}
function salaryMonthly(){return state.staff.reduce((sum,s)=>sum+s.salary,0)}
function score(){
  let v=state.reputation*0.35 + Math.min(100,Math.max(0,state.cash)/700)*0.2 + (100-Math.min(100,overdueTasks().length*8))*0.2 + Math.max(0,100-(judicialLoad()/Math.max(1,clercCapacity())*100))*0.15 + Math.max(0,100-(amiableLoad()/Math.max(1,amiableCapacity())*100))*0.1;
  return Math.max(1,Math.min(99,Math.round(v)));
}
function goalProgress(){return Math.min(100,Math.max(0,cumulativeProfit()/state.objective.profit*100))}
function monthsPlayed(){const d=dayDate(state.day); return (d.getUTCFullYear()-START_DATE.getUTCFullYear())*12 + (d.getUTCMonth()-START_DATE.getUTCMonth()) + 1}
function cumulativeProfit(){return money(reportMonths().reduce((s,m)=>s+m.result,0))}
function currentMonthStats(){const key=monthKey(); return reportMonths().find(m=>m.key===key) || {revenue:0,charges:0,result:0,growth:null,amiableFees:0,judicialFees:0,collected:0};}
function reportMonths(){
  const map={};
  for(const e of state.ledger){
    map[e.month]=map[e.month]||{key:e.month,revenue:0,charges:0,amiableFees:0,judicialFees:0,collected:0};
    const m=map[e.month];
    if(['amiableFee','judicialFee'].includes(e.kind)){m.revenue+=e.amount; if(e.kind==='amiableFee')m.amiableFees+=e.amount; else m.judicialFees+=e.amount}
    if(['salary','fixed','hire','training','actCost'].includes(e.kind)){m.charges+=e.amount}
    if(e.kind==='collected')m.collected+=e.amount;
  }
  const rows=Object.values(map).sort((a,b)=>a.key.localeCompare(b.key)).map((m,i,arr)=>{
    m.revenue=money(m.revenue); m.charges=money(m.charges); m.amiableFees=money(m.amiableFees); m.judicialFees=money(m.judicialFees); m.collected=money(m.collected); m.result=money(m.revenue-m.charges); m.growth=i===0?null:(arr[i-1].revenue?money(((m.revenue-arr[i-1].revenue)/arr[i-1].revenue)*100):null); return m;
  });
  return rows;
}
function logEntry(g,kind,amount,label){ const obj=g||state; obj.ledger.push({day:obj.day,month:monthKey(obj.day),kind,amount:money(amount),label}); }
function nav(){
  const el=document.getElementById('nav');
  el.innerHTML=NAV.map(([id,label])=>`<button data-tab="${id}" class="${currentTab===id?'active':''}">${label}</button>`).join('');
  el.querySelectorAll('button').forEach(b=>b.onclick=()=>{currentTab=b.dataset.tab; render()});
}

function randomName(){return `${pick(FIRST)} ${pick(LAST)}`}
function randomJudicialStaffId(){if(!state||!state.staff)return null; const team=judicialStaff(); return team.length?pick(team).id:null}
function progressPct(v,max){return Math.max(0,Math.min(100,Math.round(v/max*100)))}
function statusPill(text,style=''){return `<span class="pill ${style}">${text}</span>`}
function objectiveCards(){
  const profitOk=cumulativeProfit()>=state.objective.profit;
  const repOk=state.reputation>=75;
  const solvencyOk=state.cash>0;
  return `<div class="objectives">
    <div class="obj ${profitOk?'done':''}"><strong>💰 Objectif de rentabilité</strong><small>Atteindre ${euro(state.objective.profit)} de résultat cumulé en ${state.objective.months} mois.</small></div>
    <div class="obj ${repOk?'done':''}"><strong>⭐ Objectif d’image</strong><small>Atteindre 75/100 de réputation pour sécuriser les mandants importants.</small></div>
    <div class="obj ${solvencyOk?'done':''}"><strong>🏦 Objectif de trésorerie</strong><small>Rester solvable et éviter toute trésorerie durablement négative.</small></div>
  </div>`;
}
function sparkline(){const rows=reportMonths().slice(-6); if(!rows.length)return '<div class="muted">Pas encore assez d’historique.</div>'; const max=Math.max(1,...rows.map(r=>r.revenue)); return `<div class="spark">${rows.map(r=>`<span style="height:${Math.max(8,Math.round(r.revenue/max*100))}%" title="${r.key} · ${euro(r.revenue)}"></span>`).join('')}</div><div class="legend">${rows.map(r=>`<span>${r.key.slice(5)}</span>`).join('')}</div>`;}

function tasks(){
  return activeCases().filter(d=>d.pole==='judicial').map(d=>({case:d,due:caseDue(d),label:caseTaskLabel(d)})).sort((a,b)=>a.due-b.due);
}
function caseTaskLabel(d){
  if(d.pending)return 'Résultat attendu : '+ACTIONS[d.pending.action].label;
  if(!d.miseSent)return 'Décider de l’amorce du recouvrement';
  if(!d.title)return 'Choisir la suite avant titre';
  if(d.title && !d.commandementSent)return 'Décider de la première mesure d’exécution';
  return 'Arbitrer la suite du dossier';
}
function caseDue(d){
  if(d.pending)return d.pending.due;
  if(d.paymentPlan)return d.paymentPlan.next;
  return d.nextActionDay ?? state.day;
}
function missionOfDay(){
  if(overdueTasks().length)return {icon:'⏰',title:'Rattraper les retards',text:`${overdueTasks().length} arbitrage(s) sont en retard. Traitez-les pour protéger votre réputation.`};
  if(judicialLoad()>clercCapacity())return {icon:'📚',title:'Désengorger le pôle judiciaire',text:'Votre capacité judiciaire est dépassée. Recrutez ou orientez davantage de flux vers l’amiable.'};
  if(state.cash<15000)return {icon:'💸',title:'Sécuriser la trésorerie',text:'La marge financière est faible. Différez les recrutements et privilégiez les encaissements.'};
  return {icon:'🚀',title:'Faire grandir l’étude',text:'La situation est maîtrisée. Vous pouvez accélérer le développement commercial.'};
}
function achievements(){
  const items=[];
  if(completedCases().length>=15)items.push({icon:'📁',title:'15 dossiers bouclés',text:'Votre étude gagne en cadence.'});
  if(cumulativeProfit()>=15000)items.push({icon:'💶',title:'Premiers vrais bénéfices',text:'Le cap des 15 000 € cumulés est franchi.'});
  if(state.staff.length>=6)items.push({icon:'👥',title:'Équipe structurée',text:'L’étude a atteint 6 collaborateurs.'});
  if(state.reputation>=72)items.push({icon:'🌟',title:'Étude recommandée',text:'La confiance des mandants se consolide.'});
  while(items.length<3)items.push({icon:'🔒',title:'Jalon à débloquer',text:'Continuez à développer l’étude pour révéler ce badge.'});
  return items.slice(0,3);
}

function dashboardView(){
  const month=currentMonthStats(), mission=missionOfDay();
  return `${heroBlock()}${headerBlock('Tableau de bord','Une vue direction plus visuelle : croissance, charge, cash et qualité de service.')}
  <div class="cards">
    ${metric('Trésorerie',euro(state.cash),'Votre matelas de sécurité',progressPct(Math.max(0,state.cash),60000))}
    ${metric('Résultat cumulé',euro(cumulativeProfit()),`Objectif ${euro(state.objective.profit)}`,goalProgress())}
    ${metric('Charge judiciaire',`${judicialLoad()} / ${clercCapacity()}`,'25 dossiers par clerc',progressPct(judicialLoad(),Math.max(1,clercCapacity())))}
    ${metric('Pôle amiable',`${amiableLoad()} / ${amiableCapacity()}`,'100 dossiers par chargé',progressPct(amiableLoad(),Math.max(1,amiableCapacity())))}
  </div>
  ${objectiveCards()}
  <div class="columns">
    <div>
      <section class="panel">
        <div class="section-head"><h2>🎯 Mission du moment</h2><button class="btn" data-go="agenda">Ouvrir le bureau du jour</button></div>
        <div class="notice"><b>${mission.icon} ${mission.title}</b><br>${mission.text}</div>
        <div class="grid3" style="margin-top:14px">
          <div class="avatar-card"><div class="row"><div class="debtor-avatar">📈</div><div><strong>CA HT du mois</strong><small>${euro(month.revenue)}</small></div></div></div>
          <div class="avatar-card"><div class="row"><div class="debtor-avatar">🧠</div><div><strong>Score de pilotage</strong><small>${score()} / 99</small></div></div></div>
          <div class="avatar-card"><div class="row"><div class="debtor-avatar">⭐</div><div><strong>Niveau d’étude</strong><small>${level()} · ${studyRank()}</small></div></div></div>
        </div>
      </section>
      <section class="panel" style="margin-top:18px">
        <div class="section-head"><h2>🗂 Dossiers chauds</h2><button class="btn" data-go="dossiers">Tout le portefeuille</button></div>
        ${hotCasesList()}
      </section>
    </div>
    <div>
      <section class="panel"><h2>📊 Tendance du chiffre d’affaires</h2>${sparkline()}<div class="muted" style="margin-top:10px">Visualisation des 6 derniers mois suivis par la comptabilité de gestion.</div></section>
      <section class="panel" style="margin-top:18px"><h2>🏅 Badges et jalons</h2><div class="grid3">${achievements().map(a=>`<div class="avatar-card"><strong>${a.icon} ${a.title}</strong><small style="display:block;margin-top:6px">${a.text}</small></div>`).join('')}</div></section>
      <section class="panel" style="margin-top:18px"><h2>📰 Journal rapide</h2><div class="timeline">${state.events.slice(0,5).map(e=>`<div class="event">${esc(e.msg)}<span>${datefmt(e.day)}</span></div>`).join('')}</div></section>
    </div>
  </div>`;
}
function heroBlock(){
  const progress=(state.xp%180)/180*100;
  return `<div class="hero">
    <section class="hero-main">
      <div class="eyebrow" style="color:#ead19b">Direction de l’étude · ${datefmt(state.day)}</div>
      <h2>${studyRank()}</h2>
      <p>Développez une étude rentable et crédible. Le jeu récompense la bonne organisation, les choix procéduraux cohérents et la maîtrise des capacités humaines.</p>
      <div class="hero-badges">
        <span class="hero-badge">🎖 Niveau ${level()}</span>
        <span class="hero-badge">💼 ${activeCases().length} dossiers actifs</span>
        <span class="hero-badge">🔔 ${overdueTasks().length} retard(s)</span>
        <span class="hero-badge">📉 Difficulté : maîtrisée mais exigeante</span>
      </div>
    </section>
    <aside class="hero-side">
      <div class="muted" style="margin-bottom:6px">Progression de l’étude</div>
      <div class="big">${euro(cumulativeProfit())}</div>
      <div class="muted">résultat cumulé · objectif ${euro(state.objective.profit)}</div>
      <div class="meter" style="margin-top:12px"><span style="width:${goalProgress()}%"></span></div>
      <div class="stat-list" style="margin-top:14px">
        <div class="stat-row"><span>Prochain niveau</span><strong>${state.xp} / ${nextLevelXp()} XP</strong></div>
        <div class="stat-row"><span>Réputation</span><strong>${state.reputation} / 100</strong></div>
        <div class="stat-row"><span>Temps écoulé</span><strong>${monthsPlayed()} mois</strong></div>
      </div>
    </aside>
  </div>`;
}
function hotCasesList(){
  const arr=activeCases().sort((a,b)=>caseDue(a)-caseDue(b)).slice(0,5);
  if(!arr.length)return '<div class="muted">Aucun dossier actif.</div>';
  return arr.map(d=>caseCard(d,true)).join('');
}
function caseCard(d,compact=false){
  const due=caseDue(d), late=due<state.day && d.pole==='judicial';
  const balance=money(d.principalLeft+d.feesLeft+d.rightsLeft);
  return `<div class="case-card">
    <div class="case-top"><div><div class="case-title">#${d.id} · ${esc(d.name)}</div><div class="case-sub">${esc(d.client)} · ${d.pole==='amiable'?'Pôle amiable':'Pôle judiciaire'}</div></div>${statusPill(d.profileIcon+' '+esc(d.profileLabel),d.badgeStyle)}</div>
    <div class="case-strip">
      ${statusPill(d.title?'Titre présent':'Sans titre',d.title?'green':'gold')}
      ${statusPill(d.pole==='amiable'?'File automatisée':'À arbitrer',d.pole==='amiable'?'blue':late?'red':'gold')}
      ${d.pole==='judicial'?statusPill(late?`Retard J+${state.day-due}`:`Échéance ${datefmt(due)}`,late?'red':''):''}
    </div>
    <div class="case-grid">
      <div class="tiny-kpi"><small>Solde</small><strong>${euro(balance)}</strong></div>
      <div class="tiny-kpi"><small>Recouvré</small><strong>${euro(d.principalRecovered)}</strong></div>
      <div class="tiny-kpi"><small>Ancienneté</small><strong>${d.age} jours</strong></div>
    </div>
    ${compact?'':`<div class="case-actions"><button class="action-btn" data-case="${d.id}">Ouvrir</button>${d.pole==='judicial'?`<button class="action-btn" data-quick="${d.id}:relance">Relance</button><button class="action-btn" data-quick="${d.id}:appel">Appeler</button>`:''}</div>`}
  </div>`;
}
function agendaView(){
  const all=tasks(), late=all.filter(x=>x.due<state.day), today=all.filter(x=>x.due===state.day), soon=all.filter(x=>x.due>state.day).slice(0,12);
  const block=(title,list)=>`<section class="kanban-col"><h3>${title}</h3><div class="count">${list.length} élément(s)</div><div style="margin-top:10px">${list.length?list.map(x=>agendaItem(x)).join(''):'<div class="muted">Aucun élément.</div>'}</div></section>`;
  return `${headerBlock('Bureau du jour','Toutes les décisions du pôle judiciaire sont regroupées ici. Les dossiers amiables suivent leur propre file automatisée.')}
  <div class="cards">
    ${metric('En retard',late.length,'À traiter en priorité',progressPct(late.length,10))}
    ${metric('Aujourd’hui',today.length,'Décisions du jour',progressPct(today.length,10))}
    ${metric('À venir',soon.length,'Suivi futur',progressPct(soon.length,16))}
    ${metric('Réputation',state.reputation+'/100','Impactée par les retards',state.reputation)}
  </div>
  <div class="notice" style="margin-top:18px">Ici, vous jouez le rôle du commissaire de justice : c’est vous qui arbitrez la suite du dossier, surtout après l’échec de l’amiable ou avant les mesures d’exécution.</div>
  <div class="kanban" style="margin-top:18px">${block('🔴 Retards',late)}${block('🟠 Aujourd’hui',today)}${block('🟢 Sous surveillance',soon)}</div>`;
}
function agendaItem(x){const d=x.case; return `<div class="case-card"><div class="case-top"><div><div class="case-title">#${d.id} · ${esc(d.name)}</div><div class="case-sub">${esc(x.label)}</div></div>${statusPill(datefmt(x.due),x.due<state.day?'red':x.due===state.day?'gold':'')}</div><div class="case-actions"><button class="action-btn" data-case="${d.id}">Arbitrer</button></div></div>`;}

function dossiersView(){
  return `${headerBlock('Portefeuille de dossiers','Vue plus visuelle du portefeuille : filtrez, ouvrez un dossier et prenez vos décisions.')}
    <section class="panel">
      <div class="section-head"><h2>${state.dossiers.length} dossiers enregistrés</h2><button class="btn primary" data-act="newCase">＋ Recevoir un dossier</button></div>
      <div class="filter-row"><select id="fPole"><option value="all">Tous les pôles</option><option value="judicial">Pôle judiciaire</option><option value="amiable">Pôle amiable</option></select><select id="fStatus"><option value="all">Tous les statuts</option><option value="En cours">En cours</option><option value="Terminé">Terminés</option></select><input id="fQuery" placeholder="Rechercher un dossier…"></div>
      <div id="dossierGrid">${dossierGrid(state.dossiers)}</div>
    </section>`;
}
function dossierGrid(list){
  if(!list.length)return '<div class="muted">Aucun dossier.</div>';
  return `<div class="grid2">${list.map(d=>caseCard(d,false)).join('')}</div>`;
}

function amiableView(){
  const completed=state.dossiers.filter(d=>d.state==='Terminé' && d.lastResolvedBy==='amiable');
  const transferred=state.dossiers.filter(d=>d.transferredFromAmicable);
  const month=currentMonthStats();
  return `${headerBlock('Pôle amiable automatisé','Un vrai mini-jeu de volume : capacité, productivité, flux mensuels et rentabilité.')}
  <div class="cards">
    ${metric('Capacité amiable',`${amiableLoad()} / ${amiableCapacity()}`,'100 dossiers par chargé',progressPct(amiableLoad(),Math.max(1,amiableCapacity())))}
    ${metric('Honoraires amiables du mois',euro(month.amiableFees),'10 % HT sur encaissements',progressPct(month.amiableFees,15000))}
    ${metric('Dossiers réussis',completed.length,'Succès historiques',progressPct(completed.length,100))}
    ${metric('Dossiers transférés',transferred.length,'Vers le judiciaire après échec',progressPct(transferred.length,50))}
  </div>
  <div class="columns">
    <section class="panel">
      <div class="section-head"><h2>⚙️ Organisation du pôle</h2><button class="btn primary" data-act="hireAmiable">＋ Recruter un chargé</button></div>
      <div class="notice">Chaque chargé de recouvrement amiable peut gérer jusqu’à <b>100 dossiers</b>. Le taux de recouvrement simulé varie selon les profils et les conditions du marché. Les honoraires du pôle amiable sont fixés à <b>10 % HT</b> des sommes effectivement recouvrées.</div>
      <div class="grid2" style="margin-top:14px">${amiableStaff().map(s=>staffCard(s,'amiable')).join('')||'<div class="muted">Aucun chargé amiable.</div>'}</div>
    </section>
    <section class="panel">
      <h2>📦 File de production</h2>
      <div class="muted" style="margin-bottom:10px">Les dossiers ci-dessous sont gérés automatiquement ; vous intervenez surtout au niveau de l’organisation, pas dans chaque relance.</div>
      ${state.dossiers.filter(d=>d.pole==='amiable'&&d.state==='En cours').slice(0,8).map(d=>`<div class="case-card"><div class="case-top"><div><div class="case-title">#${d.id} · ${esc(d.name)}</div><div class="case-sub">${esc(d.client)} · ${esc(d.profileLabel)}</div></div>${statusPill('Revue '+datefmt(d.amicableReviewDay||state.day),'blue')}</div><div class="case-grid"><div class="tiny-kpi"><small>Créance</small><strong>${euro(d.principalLeft)}</strong></div><div class="tiny-kpi"><small>Taux visé</small><strong>${Math.round(d.amiableRate*100)} %</strong></div><div class="tiny-kpi"><small>Ancienneté</small><strong>${d.age} jours</strong></div></div></div>`).join('')||'<div class="muted">Aucun dossier en file amiable.</div>'}
    </section>
  </div>`;
}

function staffCard(s,mode=''){const load=mode==='amiable'?state.dossiers.filter(d=>d.pole==='amiable'&&d.state==='En cours').length/Math.max(1,amiableStaff().length):state.dossiers.filter(d=>d.pole==='judicial'&&d.assignedTo===s.id&&d.state==='En cours').length; const cap=mode==='amiable'?100:25; return `<div class="avatar-card"><div class="row"><div class="debtor-avatar">${s.avatar}</div><div><strong>${esc(s.name)}</strong><small>${esc(s.role)} · ${euro(s.salary)}/mois</small></div></div><div class="stat-list" style="margin-top:12px"><div class="stat-row"><span>Compétence</span><strong>${s.skill}/100</strong></div><div class="stat-row"><span>Charge</span><strong>${Math.round(load)} / ${cap}</strong></div></div><div class="meter" style="margin-top:10px"><span style="width:${progressPct(load,cap)}%"></span></div></div>`;}

function teamView(){
  return `${headerBlock('Équipe de l’étude','Gérez vos capacités. Trop peu de monde freine la rentabilité ; trop de monde pèse sur la trésorerie.')}
  <div class="cards">
    ${metric('Effectif',state.staff.length,'Tous postes confondus',progressPct(state.staff.length,10))}
    ${metric('Masse salariale',euro(salaryMonthly()),'Coût mensuel',progressPct(salaryMonthly(),25000))}
    ${metric('Capacité judiciaire',clercCapacity(),'25 dossiers par clerc',progressPct(judicialLoad(),Math.max(1,clercCapacity())))}
    ${metric('Capacité amiable',amiableCapacity(),'100 dossiers par chargé',progressPct(amiableLoad(),Math.max(1,amiableCapacity())))}
  </div>
  <div class="columns">
    <section class="panel"><div class="section-head"><h2>👥 Collaborateurs</h2><button class="btn primary" data-act="hireMenu">＋ Recruter</button></div><div class="grid2">${state.staff.map(s=>staffCard(s,/amiable/i.test(s.role)?'amiable':'judicial')).join('')}</div></section>
    <section class="panel"><h2>Conseil de gestion</h2><div class="notice">Votre challenge de jeu repose sur un vrai équilibre : plus d’effectif = plus de capacité, mais aussi plus de charges fixes. L’étude doit donc croître suffisamment vite pour absorber ses recrutements.</div><div class="stat-list" style="margin-top:14px"><div class="stat-row"><span>Charge judiciaire actuelle</span><strong>${judicialLoad()} / ${clercCapacity()}</strong></div><div class="stat-row"><span>Charge amiable actuelle</span><strong>${amiableLoad()} / ${amiableCapacity()}</strong></div><div class="stat-row"><span>Trésorerie de prudence conseillée</span><strong>${euro(Math.max(15000,salaryMonthly()*1.2))}</strong></div></div></section>
  </div>`;
}

function financeView(){
  const rows=reportMonths().slice().reverse(); const current=currentMonthStats();
  return `${headerBlock('Finances','Une lecture plus ludique mais exploitable : rentabilité, croissance, fonds de tiers et tension de trésorerie.')}
  <div class="cards">
    ${metric('CA HT du mois',euro(current.revenue),'Honoraires + émoluments',progressPct(current.revenue,25000))}
    ${metric('Charges du mois',euro(current.charges),'Salaires + frais + marketing',progressPct(current.charges,25000))}
    ${metric('Résultat du mois',euro(current.result),'Avant impôts',progressPct(Math.max(0,current.result),15000))}
    ${metric('Fonds de tiers',euro(state.trust),'Hors chiffre d’affaires',progressPct(state.trust,80000))}
  </div>
  <section class="panel" style="margin-top:18px"><h2>Compte de résultat mensuel</h2><div class="table-wrap"><table><thead><tr><th>Mois</th><th>CA HT</th><th>Charges</th><th>Résultat</th><th>Amiable</th><th>Judiciaire</th><th>Collecté</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${r.key}</b></td><td>${euro(r.revenue)}</td><td>${euro(r.charges)}</td><td><b class="${r.result>=0?'result-good':'result-bad'}">${euro(r.result)}</b></td><td>${euro(r.amiableFees)}</td><td>${euro(r.judicialFees)}</td><td>${euro(r.collected)}</td></tr>`).join('')||'<tr><td colspan="7" class="muted">Aucun mois encore consolidé.</td></tr>'}</tbody></table></div><div class="notice" style="margin-top:14px">Le jeu distingue bien les recettes de l’étude et les fonds recouvrés pour compte de tiers. Les encaissements débiteurs ne gonflent donc pas artificiellement le résultat.</div></section>`;
}

function clientsView(){
  return `${headerBlock('Mandants et développement','Pilotez vos grands comptes : plus de volume apporte plus de chiffre, mais aussi plus de risque de saturation.')}
  <section class="panel"><div class="section-head"><h2>Portefeuille de mandants</h2><button class="btn primary" data-act="prospect">＋ Prospecter</button></div><div class="grid2">${state.clients.map((c,i)=>clientCard(c,i)).join('')}</div></section>`;
}
function clientCard(c,i){return `<div class="avatar-card"><div class="row"><div class="debtor-avatar">${sectorIcon(c.sector)}</div><div><strong>${esc(c.name)}</strong><small>${esc(c.sector)} · satisfaction ${c.satisfaction}/100</small></div></div><div class="stat-list" style="margin-top:12px"><div class="stat-row"><span>Volume mensuel</span><strong><input data-client-volume="${i}" type="number" min="0" max="350" value="${c.monthlyVolume}" style="width:90px"> dossiers</strong></div><div class="stat-row"><span>File actuelle</span><strong>${state.dossiers.filter(d=>d.client===c.name&&d.state==='En cours').length} actifs</strong></div></div></div>`;}
function sectorIcon(s){return s==='Banque'?'🏦':s==='Énergie'?'⚡':s==='Immobilier'?'🏢':s==='Télécom'?'📡':'💼'}

function journalView(){return `${headerBlock('Journal','Historique de la partie et décisions marquantes.')}<section class="panel"><div class="timeline">${state.events.map(e=>`<div class="event">${esc(e.msg)}<span>${datefmt(e.day)}</span></div>`).join('')}</div></section>`;}

function headerBlock(title,sub){return `<div class="head"><div><div class="eyebrow">${state.studyName} · ${datefmt(state.day)}</div><h1>${title}</h1><div class="muted">${sub}</div></div></div>`}
function metric(label,value,sub,pct){return `<div class="metric"><div class="label">${label}</div><strong>${value}</strong><small>${sub}</small><div class="line"><span style="width:${Math.max(0,Math.min(100,pct))}%"></span></div></div>`}

function openCase(id){
  const d=state.dossiers.find(x=>x.id===id); if(!d)return;
  const balance=money(d.principalLeft+d.feesLeft+d.rightsLeft);
  const actionsHtml=d.pole==='amiable'
    ? `<div class="notice">Ce dossier est traité par le pôle amiable. Vous n’arbitrez pas chaque relance ; en cas d’échec, il pourra être transféré au pôle judiciaire.</div>`
    : `<div class="case-actions">${availableActions(d).map(a=>`<button class="action-btn" data-case-action="${d.id}:${a}">${ACTIONS[a].label}</button>`).join('')}</div>`;
  const html=`<div class="modal-back"><div class="modal"><div class="modal-head"><div class="eyebrow">Dossier #${d.id} · ${d.pole==='amiable'?'Pôle amiable':'Pôle judiciaire'}</div><h2 style="margin:6px 0 8px">${esc(d.name)}</h2><div class="muted">Mandant : ${esc(d.client)} · Profil : ${esc(d.profileLabel)} · ${d.title?'Titre exécutoire présent':'Titre non obtenu'}</div></div><div class="modal-body"><div class="grid3"><div class="avatar-card"><strong>Solde total</strong><div class="big" style="font-size:26px;margin-top:8px">${euro(balance)}</div></div><div class="avatar-card"><strong>Principal recouvré</strong><div class="big" style="font-size:26px;margin-top:8px">${euro(d.principalRecovered)}</div></div><div class="avatar-card"><strong>Prochaine échéance</strong><div class="big" style="font-size:22px;margin-top:8px">${datefmt(caseDue(d))}</div></div></div><div class="grid2" style="margin-top:16px"><section class="panel"><h2>Décisions</h2>${actionsHtml}${d.pending?`<div class="notice" style="margin-top:12px">Action en cours : <b>${ACTIONS[d.pending.action].label}</b> · résultat attendu le ${datefmt(d.pending.due)}</div>`:''}${d.paymentPlan?`<div class="notice" style="margin-top:12px">Échéancier actif : ${euro(d.paymentPlan.amount)} à chaque échéance. Prochaine date : ${datefmt(d.paymentPlan.next)}</div>`:''}</section><section class="panel"><h2>Historique</h2><div class="timeline">${d.history.slice(0,10).map(h=>`<div class="event">${esc(h.msg)}<span>${datefmt(h.day)}</span></div>`).join('')}</div></section></div></div><div class="modal-foot"><button class="btn" id="closeModal">Fermer</button></div></div></div>`;
  document.getElementById('overlay').innerHTML=html;
  document.getElementById('closeModal').onclick=closeModal;
  document.querySelector('.modal-back').onclick=e=>{if(e.target.classList.contains('modal-back'))closeModal()};
  document.querySelectorAll('[data-case-action]').forEach(b=>b.onclick=()=>{const [id,act]=b.dataset.caseAction.split(':'); performAction(+id,act); closeModal();});
}
function closeModal(){document.getElementById('overlay').innerHTML=''}
function availableActions(d){
  if(d.state!=='En cours' || d.pole!=='judicial')return [];
  const arr=[];
  if(!d.pending){
    if(!d.miseSent){arr.push('relance','appel','mise','enquete','plan');}
    else if(!d.title){arr.push('relance','appel','titre','plan','enquete');}
    else if(!d.commandementSent){arr.push('commandement','saisiebanque','saisiemob','plan','enquete');}
    else {arr.push('saisiebanque','saisiemob','relance','appel','plan','enquete');}
    arr.push('cloture');
  }
  return [...new Set(arr)];
}
function performAction(id,action){
  const d=state.dossiers.find(x=>x.id===id); if(!d||d.state!=='En cours')return;
  const a=ACTIONS[action]; if(!a)return;
  if(action==='cloture'){
    d.state='Terminé'; d.statusLabel='Classé'; d.progress=100; state.reputation=Math.max(35,state.reputation-1); log(`Dossier #${d.id} classé sans suite.`); logCase(d,'Classement sans suite décidé.'); save(); render(); toast('Dossier classé.'); return;
  }
  if(state.cash<a.cost){toast('Trésorerie insuffisante pour cette action.'); return;}
  state.cash=money(state.cash-a.cost); logEntry(null,'actCost',a.cost,'Coût : '+a.label); d.pending={action,due:state.day+a.delay}; d.nextActionDay=state.day+a.delay+1; d.statusLabel=a.label+' en cours'; d.progress=Math.min(96,d.progress+rand(5,11)); if(action==='mise')d.miseSent=state.day; if(action==='commandement')d.commandementSent=state.day; logCase(d,a.msg); log(`Dossier #${d.id} : ${a.label}.`); save(); render(); toast('Décision enregistrée.');
}
function resolvePending(d){
  if(!d.pending || d.pending.due>state.day)return;
  const act=d.pending.action; const strength=caseStrength(d); let amount=0;
  if(act==='relance' || act==='appel'){
    if(Math.random()<strength*.45){ amount=money(d.principalLeft*between(.18,.45)); collectCase(d,amount,'Règlement après '+ACTIONS[act].label.toLowerCase(),'judicial'); d.statusLabel='Paiement partiel obtenu'; state.reputation=Math.min(95,state.reputation+1);} else { d.statusLabel='Sans réponse'; state.reputation=Math.max(30,state.reputation-.3); logCase(d,'Aucune suite concrète après cette démarche.'); }
  }
  if(act==='mise'){ d.statusLabel='Mise en demeure restée sans effet'; if(Math.random()<strength*.28){ amount=money(d.principalLeft*between(.15,.3)); collectCase(d,amount,'Paiement après mise en demeure','judicial'); } }
  if(act==='enquete'){ const hints=['Compte bancaire actif détecté','Emploi stable pressenti','Adresse incertaine','Aucun élément patrimonial significatif']; d.solvencyHint=pick(hints); logCase(d,'Résultat enquête : '+d.solvencyHint); d.statusLabel='Enquête disponible'; }
  if(act==='plan'){ const planAmt=money(Math.max(80,d.principalLeft/Math.max(3,rand(4,8)))); d.paymentPlan={amount:planAmt,next:state.day+30}; d.statusLabel='Échéancier accepté'; logCase(d,`Échéancier accepté pour ${euro(planAmt)} par échéance.`); }
  if(act==='titre'){
    if(d.miseSent!==null && Math.random()<Math.min(.88,.45+strength*.5)){ d.title=true; d.statusLabel='Titre obtenu'; state.xp+=18; recognizeRevenue('judicialFee',149,'Acte / titre obtenu'); logCase(d,'Titre exécutoire simulé obtenu.'); }
    else { d.statusLabel='Titre refusé ou incomplet'; state.reputation=Math.max(32,state.reputation-1); logCase(d,'La demande de titre n’a pas abouti cette fois.'); }
  }
  if(act==='commandement'){
    d.feesLeft=money(d.feesLeft+20.42); d.statusLabel='Commandement délivré'; recognizeRevenue('judicialFee',20.42,'Commandement'); logCase(d,'Le coût du commandement s’ajoute au solde du débiteur.'); }
  if(act==='saisiebanque'){
    d.feesLeft=money(d.feesLeft+77.36); if(d.title && Math.random()<strength*.8){ amount=money((d.principalLeft+d.feesLeft)*between(.35,.85)); collectCase(d,amount,'Encaissement après saisie bancaire','judicial'); d.statusLabel='Saisie fructueuse'; recognizeRevenue('judicialFee',44.05,'Saisie bancaire'); } else { d.statusLabel='Saisie infructueuse'; state.reputation=Math.max(28,state.reputation-.6); logCase(d,'Saisie bancaire infructueuse.'); }
  }
  if(act==='saisiemob'){
    d.feesLeft=money(d.feesLeft+66); if(d.title && Math.random()<strength*.65){ amount=money((d.principalLeft+d.feesLeft)*between(.25,.7)); collectCase(d,amount,'Recouvrement après saisie-vente','judicial'); d.statusLabel='Saisie-vente productive'; recognizeRevenue('judicialFee',33.31,'Dénonciation / suites saisie-vente'); } else { d.statusLabel='Mesure peu productive'; logCase(d,'La saisie-vente n’a pas donné le résultat espéré.'); }
  }
  d.pending=null;
}
function caseStrength(d){return Math.min(.95,Math.max(.15,((d.title?.15:0)+d.judicialRate*0.55+(d.solvencyHint&&/actif|stable/.test(d.solvencyHint)?0.12:0)+(d.profile==='cooperatif'?0.1:0)-(d.profile==='introuvable'?0.1:0))));}
function collectCase(d,amount,origin,mode){
  amount=money(Math.min(amount,d.principalLeft+d.feesLeft+d.rightsLeft)); if(amount<=0)return;
  let remaining=amount;
  const feePart=money(Math.min(remaining,d.feesLeft)); d.feesLeft=money(d.feesLeft-feePart); remaining=money(remaining-feePart);
  const rightPart=money(Math.min(remaining,d.rightsLeft)); d.rightsLeft=money(d.rightsLeft-rightPart); remaining=money(remaining-rightPart);
  const principal=money(Math.min(remaining,d.principalLeft)); d.principalLeft=money(d.principalLeft-principal); d.principalRecovered=money(d.principalRecovered+principal); d.lastPayment=state.day;
  state.trust=money(state.trust+principal+feePart+rightPart);
  logEntry(null,'collected',principal+feePart+rightPart,origin);
  if(mode==='judicial')recognizeRevenue('judicialFee',money(Math.max(18,principal*0.04)),origin);
  if(d.principalLeft<=0.01 && d.feesLeft<=0.01 && d.rightsLeft<=0.01){ d.state='Terminé'; d.statusLabel='Dossier soldé'; d.progress=100; state.xp+=22; state.reputation=Math.min(98,state.reputation+2); logCase(d,'Créance soldée.'); log(`Dossier #${d.id} soldé (${origin}).`); }
  else { d.statusLabel='Paiement encaissé'; d.progress=Math.min(98,d.progress+rand(10,18)); logCase(d,`${origin} : ${euro(amount)} encaissés.`); }
}
function recognizeRevenue(kind,amount,label){ amount=money(amount); if(amount<=0)return; state.cash=money(state.cash+amount); logEntry(null,kind,amount,label); }
function processPaymentPlans(){
  for(const d of activeCases().filter(x=>x.paymentPlan && x.paymentPlan.next<=state.day)){
    const pay=money(Math.min(d.paymentPlan.amount,d.principalLeft+d.feesLeft+d.rightsLeft)); collectCase(d,pay,'Échéancier honoré','judicial'); d.paymentPlan.next=state.day+30; if(Math.random()<.18){ d.paymentPlan=null; logCase(d,'Échéancier rompu par le débiteur.'); }
  }
}
function processAmiable(){
  for(const d of activeCases().filter(x=>x.pole==='amiable' && x.amicableReviewDay!==null && x.amicableReviewDay<=state.day)){
    const marketBoost=(state.marketMood-50)/200;
    const successRate=Math.max(.5,Math.min(.85,d.amiableRate+marketBoost));
    if(Math.random()<successRate){
      const collected=money(d.principalLeft*between(.65,1));
      state.trust=money(state.trust+collected);
      const fees=money(collected*0.10);
      recognizeRevenue('amiableFee',fees,'Honoraires amiables 10%');
      logEntry(null,'collected',collected,'Recouvrement amiable');
      d.principalRecovered=money(d.principalRecovered+collected);
      d.principalLeft=money(Math.max(0,d.principalLeft-collected));
      if(d.principalLeft<=0.01 || Math.random()<.55){ d.state='Terminé'; d.statusLabel='Soldé en amiable'; d.lastResolvedBy='amiable'; state.xp+=12; state.reputation=Math.min(97,state.reputation+1.1); logCase(d,`Le pôle amiable a recouvré ${euro(collected)}.`); log(`Dossier #${d.id} réglé par le pôle amiable.`); }
      else { d.state='Terminé'; d.lastResolvedBy='amiable'; d.statusLabel='Transaction amiable'; logCase(d,`Accord amiable partiel conclu pour ${euro(collected)}.`); }
    }else{
      d.pole='judicial'; d.transferredFromAmicable=true; d.statusLabel='Échec amiable · à arbitrer'; d.nextActionDay=state.day+1; d.amicableReviewDay=null; d.assignedTo=randomJudicialStaffId(); state.reputation=Math.max(30,state.reputation-.2); logCase(d,'Échec du pôle amiable. Dossier transféré au judiciaire.'); log(`Dossier #${d.id} transféré du pôle amiable vers le judiciaire.`);
    }
  }
}
function generateMonthlyBatches(){
  const key=monthKey(); if(state.generatedThisMonth===key)return; state.generatedThisMonth=key;
  for(const c of state.clients){
    let incoming=Math.max(0,Math.round(c.monthlyVolume*between(.72,1.18)));
    let freeAmiable=Math.max(0,amiableCapacity()-amiableLoad());
    let freeJudicial=Math.max(0,clercCapacity()-judicialLoad());
    let amiableTake=Math.min(freeAmiable,incoming);
    let rest=incoming-amiableTake;
    let judicialTake=Math.min(freeJudicial,Math.round(rest*between(.25,.5)));
    for(let i=0;i<amiableTake;i++) state.dossiers.unshift(createCase({name:Math.random()<.32?`SAS ${pick(['Nordis','Astre','Valmer','Opaline'])} ${rand(1,98)}`:randomName(),client:c.name,pole:'amiable',amount:randomAmount(c.sector),title:false}));
    for(let i=0;i<judicialTake;i++) state.dossiers.unshift(createCase({name:Math.random()<.32?`SARL ${pick(['Delta','Méridien','Horizon','Cobalt'])} ${rand(1,98)}`:randomName(),client:c.name,pole:'judicial',amount:randomAmount(c.sector),title:Math.random()<.45}));
    const pressure=incoming-(amiableTake+judicialTake);
    if(pressure>0){ c.satisfaction=Math.max(45,c.satisfaction-Math.min(5,Math.round(pressure/20))); log(`${c.name} souhaitait transmettre davantage de dossiers, mais l’étude manquait de capacité.`);} else { c.satisfaction=Math.min(95,c.satisfaction+1);}    
  }
}
function randomAmount(sector){ if(sector==='Banque')return rand(450,22000); if(sector==='Énergie')return rand(90,1900); if(sector==='Immobilier')return rand(350,7800); if(sector==='Télécom')return rand(120,2400); return rand(250,9000); }
function rollMonthIfNeeded(g=state,init=false){
  const key=monthKey(g.day); if(g.lastMonthProcessed===key && !init)return;
  const d=dayDate(g.day); if(init || g.lastMonthProcessed===-1){ g.lastMonthProcessed=key; return; }
}
function applyDailyCosts(){
  const dailySalary=salaryMonthly()/30; const dailyFixed=fixedMonthlyCosts()/30;
  state.cash=money(state.cash-dailySalary-dailyFixed);
  logEntry(null,'salary',dailySalary,'Charge salariale quotidienne');
  logEntry(null,'fixed',dailyFixed,'Charges fixes quotidiennes');
}
function monthlyPulse(){
  const currentKey=monthKey();
  if(state.lastMonthProcessed!==currentKey){
    state.lastMonthProcessed=currentKey;
    state.marketMood=Math.max(35,Math.min(70,state.marketMood+rand(-6,6)));
    log(`Nouveau mois : climat de marché ${state.marketMood}/100.`);
    if(currentKey===reportMonths().slice(-1)[0]?.key){/* no-op */}
  }
}
function advanceOne(){
  if(state.lost||state.won)return;
  state.day++;
  monthlyPulse();
  generateMonthlyBatches();
  applyDailyCosts();
  for(const d of activeCases()) d.age++;
  processAmiable();
  processPaymentPlans();
  for(const d of activeCases().filter(x=>x.pole==='judicial')) resolvePending(d);
  reputationAndPressure();
  checkWinLose();
}
function reputationAndPressure(){
  const jRatio=judicialLoad()/Math.max(1,clercCapacity()); const aRatio=amiableLoad()/Math.max(1,amiableCapacity());
  if(jRatio>1.08){ state.reputation=Math.max(25, money(state.reputation-0.4)); }
  if(aRatio>1.05){ state.reputation=Math.max(25, money(state.reputation-0.2)); }
  if(overdueTasks().length>6){ state.reputation=Math.max(22, money(state.reputation-0.35)); }
  if(state.cash>42000 && Math.random()<.08) state.reputation=Math.min(98,money(state.reputation+0.1));
}
function checkWinLose(){
  if(state.cash<-18000 || state.reputation<18){ state.lost=true; log('Partie compromise : l’étude n’a plus les marges suffisantes pour continuer.'); }
  if(monthsPlayed()>=state.objective.months && cumulativeProfit()>=state.objective.profit && state.cash>0){ state.won=true; log('Objectif atteint : votre étude a franchi le palier de rentabilité fixé par le jeu.'); }
}
function advance(days){ for(let i=0;i<days;i++)advanceOne(); save(); render(); toast(days===1?'Une journée s’est écoulée.':'Une semaine s’est écoulée.'); }

function hire(type){ const m=STAFF_LIBRARY[type]; if(!m)return; if(state.cash<m.hire){toast('Trésorerie insuffisante.'); return;} state.cash=money(state.cash-m.hire); logEntry(null,'hire',m.hire,'Recrutement'); state.staff.push({id:state.nextStaffId++,name:randomName(),type,role:m.role,salary:m.salary,skill:m.skill+rand(-4,4),avatar:m.avatar}); log(`Recrutement : ${m.role}.`); save(); render(); toast('Collaborateur recruté.'); }
function prospect(){
  if(state.cash<1200){toast('Trésorerie insuffisante pour prospecter.'); return;}
  state.cash=money(state.cash-1200); logEntry(null,'fixed',1200,'Prospection commerciale');
  if(Math.random()<.58 + (state.reputation/250)){
    const sec=pick(SECTORS); const name=sec.name+' '+rand(2,97); state.clients.push({id:Date.now()+Math.random(),name,sector:sec.sector,monthlyVolume:Math.round(sec.volume*between(.6,1.2)),satisfaction:65}); log(`Nouveau mandant signé : ${name}.`); state.reputation=Math.min(98,state.reputation+1); toast('Nouveau mandant signé !');
  }else{ log('Prospection sans signature cette fois.'); toast('Prospection sans signature.'); }
  save(); render();
}
function createManualCase(){
  const name=randomName(); const client=pick(state.clients).name; state.dossiers.unshift(createCase({name,client,pole:Math.random()<.55?'amiable':'judicial',amount:rand(250,9000),title:Math.random()<.35})); log('Nouveau dossier manuel ajouté.'); save(); render(); toast('Dossier créé.');
}

function bind(){
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{currentTab=b.dataset.go; render()});
  document.querySelectorAll('[data-case]').forEach(b=>b.onclick=()=>openCase(+b.dataset.case));
  document.querySelectorAll('[data-quick]').forEach(b=>b.onclick=()=>{const [id,act]=b.dataset.quick.split(':'); performAction(+id,act)});
  document.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>{
    const a=b.dataset.act;
    if(a==='newCase')createManualCase();
    if(a==='hireAmiable')hire('amiable');
    if(a==='prospect')prospect();
    if(a==='hireMenu')openHireMenu();
  });
  document.querySelectorAll('[data-client-volume]').forEach(inp=>inp.onchange=()=>{const c=state.clients[+inp.dataset.clientVolume]; c.monthlyVolume=Math.max(0,Math.min(350,Math.round(Number(inp.value)||0))); save(); render();});
  const pole=document.getElementById('fPole'), status=document.getElementById('fStatus'), query=document.getElementById('fQuery');
  if(pole&&status&&query){const filter=()=>{const q=query.value.toLowerCase(); const list=state.dossiers.filter(d=>(pole.value==='all'||d.pole===pole.value)&&(status.value==='all'||d.state===status.value)&&(`${d.id} ${d.name} ${d.client} ${d.profileLabel}`).toLowerCase().includes(q)); document.getElementById('dossierGrid').innerHTML=dossierGrid(list); bind();}; pole.onchange=filter; status.onchange=filter; query.oninput=filter;}
}
function openHireMenu(){
  const body=`<div class="grid3">${Object.entries(STAFF_LIBRARY).map(([key,m])=>`<div class="avatar-card"><div class="row"><div class="debtor-avatar">${m.avatar}</div><div><strong>${m.role}</strong><small>${euro(m.salary)}/mois</small></div></div><div class="stat-list" style="margin-top:10px"><div class="stat-row"><span>Coût recrutement</span><strong>${euro(m.hire)}</strong></div><div class="stat-row"><span>Compétence cible</span><strong>${m.skill}/100</strong></div></div><div class="case-actions" style="margin-top:12px"><button class="action-btn" data-hire-type="${key}">Recruter</button></div></div>`).join('')}</div>`;
  document.getElementById('overlay').innerHTML=`<div class="modal-back"><div class="modal"><div class="modal-head"><div class="eyebrow">Recrutement</div><h2 style="margin:6px 0 8px">Choisissez le profil à recruter</h2></div><div class="modal-body">${body}</div><div class="modal-foot"><button class="btn" id="closeModal">Fermer</button></div></div></div>`;
  document.getElementById('closeModal').onclick=closeModal; document.querySelector('.modal-back').onclick=e=>{if(e.target.classList.contains('modal-back'))closeModal()}; document.querySelectorAll('[data-hire-type]').forEach(b=>b.onclick=()=>{hire(b.dataset.hireType); closeModal()});
}

function render(){
  nav();
  document.getElementById('dateLabel').textContent=datefmt(state.day);
  let html='';
  if(state.lost){ html=`${headerBlock('Étude en difficulté','La partie est terminée. Vous pouvez repartir sur une nouvelle base.')}<section class="panel"><div class="notice"><b>❌ Défaite</b><br>Votre étude n’a pas tenu le choc : trésorerie insuffisante ou réputation trop dégradée. Dans ce jeu, grandir trop vite sans absorber les charges peut être fatal.</div><div class="case-actions" style="margin-top:12px"><button class="btn primary" onclick="resetGame()">Recommencer</button></div></section>`; }
  else if(state.won){ html=`${headerBlock('Objectif atteint','Votre étude a franchi le cap recherché : elle est rentable, structurée et crédible.')}${dashboardView()}<section class="panel" style="margin-top:18px"><div class="notice"><b>🏆 Victoire</b><br>Vous avez atteint l’objectif de rentabilité du jeu. Vous pouvez continuer à développer librement l’étude ou repartir pour faire mieux.</div></section>`; }
  else {
    html={dashboard:dashboardView,agenda:agendaView,dossiers:dossiersView,amiable:amiableView,team:teamView,finance:financeView,clients:clientsView,journal:journalView}[currentTab]();
  }
  document.getElementById('content').innerHTML=html;
  bind();
  save();
}
function resetGame(){ if(confirm('Créer une nouvelle partie ?')){ state=initialState(); currentTab='dashboard'; bootstrapLedger(state); save(); render(); } }
window.resetGame=resetGame;
document.getElementById('nextDay').onclick=()=>advance(1);
document.getElementById('nextWeek').onclick=()=>advance(7);
document.getElementById('saveReset').onclick=()=>resetGame();
render();
