<script type="text/x-dc" data-dc-script="" data-props="{&quot;$preview&quot;:{&quot;width&quot;:&quot;100%&quot;,&quot;height&quot;:&quot;100%&quot;},&quot;defaultTheme&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;options&quot;:[&quot;midnight&quot;,&quot;daylight&quot;,&quot;candy&quot;],&quot;default&quot;:&quot;midnight&quot;,&quot;tsType&quot;:&quot;'midnight'|'daylight'|'candy'&quot;},&quot;accent&quot;:{&quot;editor&quot;:&quot;color&quot;,&quot;default&quot;:&quot;#FF6A3D&quot;,&quot;tsType&quot;:&quot;string&quot;}}">
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.scrollEl = null;
    this.THEMES = {
      midnight: {
        name:'Midnight', icon:'🌙',
        appBg:'radial-gradient(1100px 560px at 78% -12%, #28304a 0%, #0e1015 58%)',
        side:'#171a23', header:'rgba(23,26,35,.72)', panel:'#1b1f2b', card:'#1b1f2b',
        text:'#edeff5', muted:'#8b92a6', faint:'#5b6175',
        divider:'rgba(255,255,255,.08)', input:'#212533', inputBorder:'rgba(255,255,255,.07)',
        hover:'rgba(255,255,255,.06)', cardShadow:'0 3px 16px rgba(0,0,0,.32)', cardBorder:'rgba(255,255,255,.07)',
      },
      daylight: {
        name:'Daylight', icon:'☀️',
        appBg:'#e9ecf4',
        side:'#ffffff', header:'rgba(255,255,255,.82)', panel:'#ffffff', card:'#ffffff',
        text:'#1a1d27', muted:'#6b7180', faint:'#a5abba',
        divider:'rgba(20,24,40,.08)', input:'#f1f3f9', inputBorder:'rgba(20,24,40,.1)',
        hover:'rgba(20,24,40,.045)', cardShadow:'0 4px 18px rgba(30,40,80,.07)', cardBorder:'rgba(20,24,40,.07)',
      },
      candy: {
        name:'Bubble', icon:'🫧',
        appBg:'linear-gradient(155deg,#fff0f6 0%,#eef1ff 52%,#f1fbff 100%)',
        side:'rgba(255,255,255,.78)', header:'rgba(255,255,255,.62)', panel:'rgba(255,255,255,.94)', card:'rgba(255,255,255,.82)',
        text:'#332c4a', muted:'#897fa8', faint:'#b6aecf',
        divider:'rgba(130,100,170,.14)', input:'rgba(255,255,255,.85)', inputBorder:'rgba(150,120,190,.22)',
        hover:'rgba(150,120,190,.1)', cardShadow:'0 6px 22px rgba(150,120,190,.18)', cardBorder:'rgba(150,120,190,.16)',
      },
    };
    this.DATA = {
      signups:[12,18,15,22,19,28,32,30,38,42,39,48,52,61],
      active:[120,135,128,150,142,168,180,175,195,210,205,230,248,265],
      messages:[820,940,880,1100,1020,1280,1450,1390,1600,1720,1680,1900,2050,2240],
      session:[8.2,8.5,8.1,9.0,8.7,9.4,9.8,9.6,10.2,10.5,10.3,11.0,11.2,11.6],
    };
    this.WEEK=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    this.CHANNELS=[
      {name:'general',icon:'💬',count:'418k',color:'#FF6A3D',raw:38},
      {name:'gaming',icon:'🎮',count:'264k',color:'#7C5CFF',raw:24},
      {name:'design',icon:'🎨',count:'176k',color:'#21c197',raw:16},
      {name:'music',icon:'🎵',count:'132k',color:'#3D9DF6',raw:12},
      {name:'random',icon:'🎲',count:'110k',color:'#FFB13D',raw:10},
    ];
    this.USERS=[
      {name:'Aiko Tanaka',handle:'@aiko',role:'Member',messages:'4,182',joined:'Jan 4, 2026',status:'Active',color:'#FF6A88'},
      {name:'Ren Watanabe',handle:'@ren',role:'Moderator',messages:'3,920',joined:'Dec 19, 2025',status:'Active',color:'#7C5CFF'},
      {name:'Mika Sato',handle:'@mika',role:'Member',messages:'2,604',joined:'Feb 11, 2026',status:'Active',color:'#00C2A8'},
      {name:'Sora Kim',handle:'@sora',role:'Member',messages:'1,870',joined:'Mar 2, 2026',status:'Idle',color:'#3D9DF6'},
      {name:'Kai Nakamura',handle:'@kai',role:'Member',messages:'1,540',joined:'Mar 18, 2026',status:'Offline',color:'#FFB13D'},
      {name:'Yuki Mori',handle:'@yuki',role:'Admin',messages:'6,210',joined:'Nov 8, 2025',status:'Active',color:'#FF6A3D'},
      {name:'Hana Suzuki',handle:'@hana',role:'Member',messages:'940',joined:'Apr 1, 2026',status:'Offline',color:'#9b6cff'},
      {name:'Leo Yamada',handle:'@leo',role:'Member',messages:'2,118',joined:'Feb 24, 2026',status:'Idle',color:'#e85a92'},
    ];
    this.state = {
      theme: this.THEMES[props.defaultTheme] ? props.defaultTheme : 'midnight',
      view: 'overview',
      range: '14d',
      metric: 'active',
      chartHover: null,
      barHover: null,
      userQuery: '',
    };
  }

  av(color,size){return `width:${size}px;height:${size}px;border-radius:11px;flex:none;display:flex;align-items:center;justify-content:center;font:800 ${Math.round(size*0.38)}px 'Plus Jakarta Sans';color:#fff;background:linear-gradient(135deg, color-mix(in srgb, ${color} 78%, #fff), ${color})`;}

  // build smooth-ish polyline path + area
  pathFor(vals,w,h,padT,padB){
    const min=Math.min(...vals), max=Math.max(...vals), span=(max-min)||1;
    const n=vals.length;
    const X=i=>n===1?w/2:i/(n-1)*w;
    const Y=v=>h-padB-((v-min)/span)*(h-padT-padB);
    const pts=vals.map((v,i)=>[X(i),Y(v)]);
    const line='M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');
    const area=line+` L${w} ${h} L0 ${h} Z`;
    return {line,area,pts,X,Y};
  }

  setView=(v)=>this.setState({view:v});

  renderVals(){
    const s=this.state;
    const base=this.THEMES[s.theme];
    const accent=this.props.accent||'#FF6A3D';
    const t={...base,accent,
      accentGrad:`linear-gradient(135deg, color-mix(in srgb, ${accent} 70%, #fff), ${accent})`,
      active:`color-mix(in srgb, ${accent} 15%, transparent)`,
      glow:`0 6px 22px color-mix(in srgb, ${accent} 40%, transparent)`,
    };
    const cardStyle=`background:${t.card};border:1px solid ${t.cardBorder};border-radius:18px;padding:18px;box-shadow:${t.cardShadow};transition:transform .18s,background .45s ease`;

    const icon=(p)=>`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
    const NAV=[
      {id:'overview',label:'Dashboard',icon:icon('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>')},
      {id:'users',label:'Members',icon:icon('<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3 3 0 0 1 0 5.8"/><path d="M16.5 19a5 5 0 0 1 4-5"/>'),badge:'12'},
      {id:'reports',label:'Reports',icon:icon('<path d="M3 3v18h18"/><path d="m7 14 3-4 3 3 4-6"/>')},
    ];
    const GEN=[
      {id:'channels',label:'Channels',icon:icon('<path d="M9 4 7 20"/><path d="M17 4l-2 16"/><path d="M4 9h16"/><path d="M3 15h16"/>')},
      {id:'settings',label:'Settings',icon:icon('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 5 12.6H4.9a2 2 0 0 1 0-4H5a1.6 1.6 0 0 0 1.1-2.7L6 5.7a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 12 3.6V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 21 12.6"/>')},
    ];
    const navStyle=(id)=>`display:flex;align-items:center;gap:11px;width:100%;border:none;cursor:pointer;padding:10px 12px;border-radius:12px;font:700 13.5px 'Plus Jakarta Sans';transition:background .15s,color .15s;background:${s.view===id?t.active:'transparent'};color:${s.view===id?t.accent:t.muted}`;
    const navItems=NAV.map(n=>({...n,style:navStyle(n.id),onClick:()=>this.setView(n.id)}));
    const navGeneral=GEN.map(n=>({...n,style:navStyle(n.id),onClick:()=>this.setView(n.id)}));

    // KPIs with sparklines
    const trendUp=`font:800 12px 'Plus Jakarta Sans';color:#21c197;background:color-mix(in srgb,#21c197 14%,transparent);padding:3px 8px;border-radius:8px`;
    const spark=(vals,color)=>{const p=this.pathFor(vals,120,34,4,4);return{linePath:p.line,areaPath:p.area,spark:color};};
    const kpiDefs=[
      {icon:'👥',iconBg:'color-mix(in srgb,#7C5CFF 16%,transparent)',value:'12,480',label:'Total registered',trend:'▲ 8.2%',data:this.DATA.signups,color:'#7C5CFF'},
      {icon:'🟢',iconBg:'color-mix(in srgb,#21c197 16%,transparent)',value:'2,317',label:'Active today',trend:'▲ 4.1%',data:this.DATA.active,color:'#21c197'},
      {icon:'💬',iconBg:t.active,value:'1.24M',label:'Total messages',trend:'▲ 12.6%',data:this.DATA.messages,color:accent},
      {icon:'⏱️',iconBg:'color-mix(in srgb,#3D9DF6 16%,transparent)',value:'11m 36s',label:'Avg. session',trend:'▲ 5.3%',data:this.DATA.session,color:'#3D9DF6'},
    ];
    const kpis=kpiDefs.map(k=>{const sp=spark(k.data,k.color);return{...k,...sp,trendStyle:trendUp};});

    // main chart
    const metricMap={active:{label:'Active users',data:this.DATA.active,fmt:v=>v.toLocaleString()},signups:{label:'New signups',data:this.DATA.signups,fmt:v=>v.toLocaleString()},messages:{label:'Messages',data:this.DATA.messages,fmt:v=>v.toLocaleString()}};
    const cur=metricMap[s.metric];
    const CW=720,CH=240;
    const cp=this.pathFor(cur.data,CW,CH,24,28);
    const gridLines=[0,1,2,3].map(i=>({y:(24+(i/3)*(CH-24-28)).toFixed(1)}));
    const n=cur.data.length;
    const dayLabel=(i)=>{const d=new Date();d.setDate(d.getDate()-(n-1-i));return (d.getMonth()+1)+'/'+d.getDate();};
    const cols=cur.data.map((v,i)=>({onEnter:()=>this.setState({chartHover:i})}));
    const hov=s.chartHover;
    const hasHov=hov!=null;
    const xlabels=[0,Math.floor(n/4),Math.floor(n/2),Math.floor(3*n/4),n-1].map(i=>({label:dayLabel(i)}));
    const metricBtns=Object.keys(metricMap).map(k=>({label:metricMap[k].label.split(' ')[k==='signups'?1:0],onClick:()=>this.setState({metric:k}),style:`border:none;cursor:pointer;padding:6px 11px;border-radius:9px;font:700 12px 'Plus Jakarta Sans';transition:all .15s;background:${s.metric===k?t.accentGrad:'transparent'};color:${s.metric===k?'#fff':t.muted}`}));

    // donut
    const C=2*Math.PI*48;
    let acc=0;
    const donutSegs=this.CHANNELS.map(c=>{const len=C*c.raw/100;const seg={color:c.color,dash:`${len.toFixed(1)} ${(C-len).toFixed(1)}`,offset:(-acc).toFixed(1)};acc+=len;return seg;});
    const donut={segs:donutSegs,total:'1.24M',legend:this.CHANNELS.map(c=>({name:'#'+c.name,color:c.color,pct:c.raw+'%'}))};

    // messages bar (week)
    const wk=this.DATA.messages.slice(-7);
    const wkMax=Math.max(...wk);
    const bars=wk.map((v,i)=>({val:v.toLocaleString(),label:this.WEEK[i],h:(18+(v/wkMax)*82).toFixed(0)+'%',fill:i===wk.length-1?t.accentGrad:`color-mix(in srgb, ${accent} 38%, transparent)`,hovered:s.barHover===i,onEnter:()=>this.setState({barHover:i})}));

    // top channels
    const maxC=Math.max(...this.CHANNELS.map(c=>c.raw));
    const topChannels=this.CHANNELS.map(c=>({...c,pct:(c.raw/maxC*100).toFixed(0)+'%'}));

    // users
    const q=s.userQuery.trim().toLowerCase();
    const stStyle=(st)=>{const m={Active:'#21c197',Idle:'#FFB13D',Offline:'#8890a0'}[st];return `font:700 11.5px 'Plus Jakarta Sans';color:${m};background:color-mix(in srgb,${m} 15%,transparent);padding:4px 11px;border-radius:20px;white-space:nowrap`;};
    const userRows=this.USERS.filter(u=>!q||u.name.toLowerCase().includes(q)||u.handle.toLowerCase().includes(q)).map(u=>({...u,initial:u.name[0],avatarStyle:this.av(u.color,38),statusStyle:stStyle(u.status)}));
    const userKpis=[
      {label:'Total members',value:'12,480'},
      {label:'New this week',value:'+312'},
      {label:'Active now',value:'2,317'},
      {label:'Moderators',value:'18'},
    ];

    // reports
    const rep={
      signup:{w:CW,h:200,...this.pathFor(this.DATA.signups,CW,200,18,22)},
      session:{w:CW,h:200,...this.pathFor(this.DATA.session,CW,200,18,22)},
      activeBars:(()=>{const mx=Math.max(...this.DATA.active);return this.DATA.active.map(v=>({h:(14+(v/mx)*84).toFixed(0)+'%'}));})(),
      metricRows:[
        {icon:'📈',label:'Retention (30d)',value:'68.4%',trend:'▲ 2.1%'},
        {icon:'🔁',label:'Messages / user',value:'99.3',trend:'▲ 6.0%'},
        {icon:'🕒',label:'Peak hour',value:'9–10pm',trend:'JST'},
        {icon:'🌍',label:'Countries',value:'42',trend:'▲ 3'},
        {icon:'⚡',label:'Avg. response',value:'1m 12s',trend:'▼ 8s'},
      ].map(m=>({...m,trendStyle:`font:700 12px 'Plus Jakarta Sans';color:${t.muted};white-space:nowrap`})),
    };

    const rangeBtns=['7d','14d','30d'].map(r=>({label:r,onClick:()=>this.setState({range:r}),style:`border:none;cursor:pointer;padding:6px 12px;border-radius:9px;font:700 12px 'Plus Jakarta Sans';transition:all .15s;background:${s.range===r?t.accentGrad:'transparent'};color:${s.range===r?'#fff':t.muted}`}));
    const themeBtns=Object.keys(this.THEMES).map(k=>({key:k,icon:this.THEMES[k].icon,label:this.THEMES[k].name,onClick:()=>this.setState({theme:k}),style:`border:none;cursor:pointer;width:34px;height:30px;border-radius:9px;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .18s;background:${s.theme===k?t.accentGrad:'transparent'};box-shadow:${s.theme===k?t.glow:'none'};filter:${s.theme===k?'none':'grayscale(.4) opacity(.65)'}`}));

    const titles={overview:['Dashboard','Realtime overview of your community'],users:['Members','Manage everyone in Chatrix'],reports:['Reports','Deep-dive analytics & trends'],channels:['Channels','Organize text & voice spaces'],settings:['Settings','Workspace configuration']};
    const vt=titles[s.view]||titles.overview;

    return {
      t,cardStyle,
      navItems,navGeneral,
      rangeBtns,themeBtns,
      viewTitle:vt[0],viewSub:vt[1],
      isOverview:s.view==='overview',
      isUsers:s.view==='users',
      isReports:s.view==='reports'||s.view==='channels'||s.view==='settings',
      kpis,
      metricLabel:cur.label,metricBtns,
      chart:{
        w:CW,h:CH,grid:gridLines,line:cp.line,area:cp.area,cols,
        hover:hasHov,
        hx:hasHov?cp.pts[hov][0].toFixed(1):0,
        hy:hasHov?cp.pts[hov][1].toFixed(1):0,
        tipLeft:hasHov?(cp.pts[hov][0]/CW*100).toFixed(2)+'%':'0',
        tipVal:hasHov?cur.fmt(cur.data[hov]):'',
        tipDay:hasHov?dayLabel(hov):'',
        xlabels,
      },
      onChartLeave:()=>this.setState({chartHover:null}),
      donut,
      bars,onBarLeave:()=>this.setState({barHover:null}),
      topChannels,
      userKpis,userRows,userQuery:s.userQuery,onUserQuery:(e)=>this.setState({userQuery:e.target.value}),
      rep,
      scrollRef:(el)=>{this.scrollEl=el;},
    };
  }
}
</script>