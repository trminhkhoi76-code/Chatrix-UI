
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.scrollEl = null;
    this.EMOJIS = ['👍','❤️','😂','🔥','🎉'];
    this.REPLIES = ['Nice one! 😄','Got it 👍','lol same here','On it now 💪','Sounds good to me','haha 🔥','Love that idea 💡','Brb in 5','Totally agree','wait really? 👀'];
    this.NAMES = [
      { name:'Aiko', initial:'A', color:'#FF6A88' },
      { name:'Ren', initial:'R', color:'#7C5CFF' },
      { name:'Mika', initial:'M', color:'#00C2A8' },
    ];
    this.CHANNELS = [
      { id:'general', name:'general', icon:'💬', badge:'Now' },
      { id:'ideas', name:'ideas', icon:'💡' },
      { id:'design', name:'design', icon:'🎨' },
      { id:'gaming', name:'gaming', icon:'🎮', badge:'3' },
      { id:'music', name:'music', icon:'🎵' },
      { id:'random', name:'random', icon:'🎲' },
      { id:'archive', name:'archive', icon:'🗄️' },
    ];
    this.TOPICS = {
      general:'Team-wide chatter & daily standup',
      ideas:'Half-baked thoughts welcome',
      design:'Crits, mocks & inspo',
      gaming:'LFG · squad up tonight',
      music:'What are you listening to?',
      random:'Off-topic & memes',
      archive:'',
    };
    this.THEMES = {
      midnight: {
        name:'Midnight', icon:'🌙',
        appBg:'radial-gradient(1100px 560px at 72% -12%, #28304a 0%, #0e1015 58%)',
        rail:'#13151d', railBorder:'rgba(255,255,255,.05)',
        side:'#171a23', chatBg:'linear-gradient(180deg,#1a1d27,#15171f)',
        header:'rgba(23,26,35,.72)', panel:'#1b1f2b',
        bubbleOther:'#262b39', bubbleOtherText:'#e9ebf2',
        text:'#edeff5', muted:'#8b92a6', faint:'#5b6175',
        divider:'rgba(255,255,255,.08)',
        input:'#212533', inputBorder:'rgba(255,255,255,.07)',
        hover:'rgba(255,255,255,.06)',
        cardShadow:'0 3px 14px rgba(0,0,0,.32)',
      },
      daylight: {
        name:'Daylight', icon:'☀️',
        appBg:'#e9ecf4',
        rail:'#fff7f3', railBorder:'rgba(0,0,0,.06)',
        side:'#ffffff', chatBg:'linear-gradient(180deg,#fbfcff,#f3f5fb)',
        header:'rgba(255,255,255,.82)', panel:'#ffffff',
        bubbleOther:'#ffffff', bubbleOtherText:'#1a1d27',
        text:'#1a1d27', muted:'#6b7180', faint:'#a5abba',
        divider:'rgba(20,24,40,.08)',
        input:'#f1f3ف9', inputBorder:'rgba(20,24,40,.1)',
        hover:'rgba(20,24,40,.045)',
        cardShadow:'0 3px 14px rgba(30,40,80,.07)',
      },
      candy: {
        name:'Bubble', icon:'🫧',
        appBg:'linear-gradient(155deg,#fff0f6 0%,#eef1ff 52%,#f1fbff 100%)',
        rail:'linear-gradient(180deg,#ff8e53,#ff5e8a)', railBorder:'rgba(255,255,255,.3)',
        side:'rgba(255,255,255,.74)', chatBg:'transparent',
        header:'rgba(255,255,255,.62)', panel:'rgba(255,255,255,.92)',
        bubbleOther:'#ffffff', bubbleOtherText:'#3a3450',
        text:'#332c4a', muted:'#897fa8', faint:'#b6aecf',
        divider:'rgba(130,100,170,.14)',
        input:'rgba(255,255,255,.85)', inputBorder:'rgba(150,120,190,.22)',
        hover:'rgba(150,120,190,.1)',
        cardShadow:'0 6px 20px rgba(150,120,190,.18)',
      },
    };
    // fix accidental non-ascii token
    this.THEMES.daylight.input = '#f1f3f9';

    this.state = {
      theme: this.THEMES[props.defaultTheme] ? props.defaultTheme : 'midnight',
      channel: 'general',
      hovered: null,
      draft: '',
      showMembers: props.membersOpen !== false,
      typing: false,
      typingPerson: this.NAMES[0],
      msgs: this.seed(),
    };
  }

  seed() {
    return {
      general: [
        { id:'g1', me:false, ...this.NAMES[0], text:'Morning team! Just pushed the new build 🚀', time:'09:12', reactions:[{emoji:'🔥',count:3,mine:false},{emoji:'🎉',count:1,mine:true}] },
        { id:'g2', me:true, text:'hello fen 123', time:'16:47', reactions:[] },
        { id:'g3', me:false, ...this.NAMES[1], text:'hahaha', time:'16:47', reactions:[{emoji:'😂',count:2,mine:false}] },
        { id:'g4', me:true, text:'test delay 123', time:'16:47', reactions:[] },
      ],
      ideas: [
        { id:'i1', me:false, ...this.NAMES[2], text:'What if reactions floated up like bubbles? ✨', time:'14:02', reactions:[{emoji:'💡',count:2,mine:false}] },
        { id:'i2', me:true, text:'ooh I like that a lot', time:'14:05', reactions:[] },
      ],
      design: [
        { id:'d1', me:false, ...this.NAMES[1], text:'New color palette is up in Figma, take a look 🎨', time:'11:20', reactions:[{emoji:'❤️',count:4,mine:true}] },
      ],
      gaming: [
        { id:'gm1', me:false, ...this.NAMES[0], text:'anyone up for ranked tonight? 🎮', time:'20:30', reactions:[{emoji:'👍',count:3,mine:false}] },
        { id:'gm2', me:false, ...this.NAMES[2], text:'count me in', time:'20:31', reactions:[] },
        { id:'gm3', me:true, text:'lets gooo, queue at 9?', time:'20:32', reactions:[{emoji:'🔥',count:2,mine:false}] },
      ],
      music: [],
      random: [
        { id:'r1', me:false, ...this.NAMES[2], text:'my coffee just achieved sentience ☕', time:'08:45', reactions:[{emoji:'😂',count:5,mine:true}] },
      ],
      archive: [],
    };
  }

  now() {
    const d = new Date();
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  }
  av(color, size) {
    return `width:${size}px;height:${size}px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font:800 ${Math.round(size*0.38)}px 'Plus Jakarta Sans';color:#fff;background:linear-gradient(135deg, color-mix(in srgb, ${color} 78%, #ffffff), ${color});box-shadow:0 3px 10px color-mix(in srgb, ${color} 45%, transparent)`;
  }

  switchChannel(id) {
    clearTimeout(this._t1); clearTimeout(this._t2);
    this.setState({ channel:id, hovered:null, typing:false, draft:'' });
  }
  goGeneral = () => this.switchChannel('general');
  toggleMembers = () => this.setState(s => ({ showMembers: !s.showMembers }));
  setHovered = (id) => this.setState({ hovered:id });
  onLeave = () => this.setState({ hovered:null });
  onDraft = (e) => this.setState({ draft:e.target.value });
  onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); } };
  composerEmoji = () => this.setState(s => ({ draft: s.draft + '😊' }));

  pushMine(text) {
    const ch = this.state.channel;
    const msg = { id:'m'+Date.now(), me:true, text, time:this.now(), reactions:[] };
    this.setState(s => ({ msgs: { ...s.msgs, [ch]: [...(s.msgs[ch]||[]), msg] }, draft:'' }));
    this.scheduleReply(ch);
  }
  send = () => { const t = this.state.draft.trim(); if (t) this.pushMine(t); };
  quickWave = () => this.pushMine('Hey everyone 👋');
  quickFire = () => this.pushMine("Let's gooo 🔥🔥");
  quickIdea = () => this.pushMine('I had an idea 💡');

  scheduleReply(ch) {
    clearTimeout(this._t1); clearTimeout(this._t2);
    const person = this.NAMES[Math.floor(Math.random()*this.NAMES.length)];
    this._t1 = setTimeout(() => {
      if (this.state.channel === ch) this.setState({ typing:true, typingPerson:person });
    }, 550);
    this._t2 = setTimeout(() => {
      const text = this.REPLIES[Math.floor(Math.random()*this.REPLIES.length)];
      this.setState(s => {
        const reply = { id:'rep'+Date.now(), me:false, name:person.name, initial:person.initial, color:person.color, text, time:this.now(), reactions:[] };
        return { typing:false, msgs: { ...s.msgs, [ch]: [...(s.msgs[ch]||[]), reply] } };
      });
    }, 2100);
  }

  react(id, emoji) {
    const ch = this.state.channel;
    this.setState(s => {
      const list = (s.msgs[ch]||[]).map(m => {
        if (m.id !== id) return m;
        const rs = (m.reactions||[]).map(r => ({ ...r }));
        const ex = rs.find(r => r.emoji === emoji);
        if (!ex) rs.push({ emoji, count:1, mine:true });
        else if (ex.mine) { ex.count -= 1; ex.mine = false; }
        else { ex.count += 1; ex.mine = true; }
        return { ...m, reactions: rs.filter(r => r.count > 0) };
      });
      return { msgs: { ...s.msgs, [ch]: list } };
    });
  }

  componentDidMount() { this.toBottom(); }
  componentDidUpdate() {
    const s = this.state;
    const sig = s.channel + ':' + ((s.msgs[s.channel]||[]).length) + ':' + s.typing;
    if (sig !== this._sig) { this._sig = sig; this.toBottom(); }
  }
  toBottom() { if (this.scrollEl) this.scrollEl.scrollTop = this.scrollEl.scrollHeight; }

  renderVals() {
    const s = this.state;
    const base = this.THEMES[s.theme];
    const accent = this.props.accent || '#ff6a3d';
    const t = {
      ...base,
      accent,
      accentGrad: `linear-gradient(135deg, color-mix(in srgb, ${accent} 70%, #ffffff), ${accent})`,
      active: `color-mix(in srgb, ${accent} 15%, transparent)`,
      glow: `0 6px 22px color-mix(in srgb, ${accent} 42%, transparent)`,
    };

    const channels = this.CHANNELS.map(c => {
      const active = c.id === s.channel;
      const isNow = c.badge === 'Now';
      return {
        ...c,
        onClick: () => this.switchChannel(c.id),
        itemStyle: `display:flex;align-items:center;gap:10px;width:100%;border:none;cursor:pointer;padding:10px 11px;margin:2px 0;border-radius:12px;font:700 14.5px 'Plus Jakarta Sans';transition:background .16s,color .16s;background:${active ? t.active : 'transparent'};color:${active ? t.accent : t.muted}`,
        badgeStyle: isNow
          ? `font:800 10px 'Plus Jakarta Sans';color:#fff;background:${accent};padding:2px 8px;border-radius:20px;letter-spacing:.3px`
          : `font:800 11px 'Plus Jakarta Sans';color:#fff;background:#e8493f;min-width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;padding:0 5px`,
      };
    });

    const deriveMsg = (m) => {
      const me = !!m.me;
      const bubbleStyle = me
        ? `background:${t.accentGrad};color:#fff;padding:11px 15px;border-radius:18px 18px 6px 18px;font:500 14.5px/1.5 'Plus Jakarta Sans';box-shadow:${t.glow};max-width:540px;word-break:break-word`
        : `background:${t.bubbleOther};color:${t.bubbleOtherText};padding:11px 15px;border-radius:18px 18px 18px 6px;font:500 14.5px/1.5 'Plus Jakarta Sans';border:1px solid ${t.divider};box-shadow:${t.cardShadow};max-width:540px;word-break:break-word`;
      const reactions = (m.reactions||[]).map(r => ({
        label: r.emoji + ' ' + r.count,
        onClick: () => this.react(m.id, r.emoji),
        style: `display:inline-flex;align-items:center;gap:4px;border-radius:11px;padding:3px 9px;cursor:pointer;font:700 12.5px 'Plus Jakarta Sans';transition:transform .14s,background .14s;border:1px solid ${r.mine ? t.accent : t.divider};background:${r.mine ? t.active : 'transparent'};color:${r.mine ? t.accent : t.muted}`,
      }));
      return {
        ...m, me, notMe: !me,
        author: m.name || 'Unknown',
        align: me ? 'flex-end' : 'flex-start',
        avatarStyle: this.av(m.color || '#7C5CFF', 42),
        bubbleStyle,
        hovered: s.hovered === m.id,
        onEnter: () => this.setHovered(m.id),
        reactions, hasReactions: reactions.length > 0,
        pickers: this.EMOJIS.map(e => ({ emoji:e, onClick: () => this.react(m.id, e) })),
      };
    };

    const list = s.msgs[s.channel] || [];
    const rows = list.map(deriveMsg);
    const is404 = s.channel === 'archive';
    const hasMessages = !is404 && list.length > 0;
    const isEmpty = !is404 && list.length === 0;

    const themeBtns = Object.keys(this.THEMES).map(k => {
      const active = s.theme === k;
      return {
        key:k, icon:this.THEMES[k].icon, label:this.THEMES[k].name,
        onClick: () => this.setState({ theme:k }),
        style: `border:none;cursor:pointer;width:34px;height:30px;border-radius:10px;font-size:15px;display:flex;align-items:center;justify-content:center;transition:all .18s;background:${active ? t.accentGrad : 'transparent'};box-shadow:${active ? t.glow : 'none'};filter:${active ? 'none' : 'grayscale(.4) opacity(.65)'}`,
      };
    });

    const mkUser = (u, online) => ({
      ...u,
      avatarStyle: this.av(u.color, 38),
      dotStyle: `position:absolute;right:-2px;bottom:-2px;width:12px;height:12px;border-radius:50%;background:${online ? '#2ecc71' : '#9aa0ad'};border:2.5px solid ${base.side.indexOf('rgba')===0 ? '#ffffff' : base.side}`,
    });
    const online = [
      mkUser({ name:'Aiko', initial:'A', color:'#FF6A88', role:'Playing Valorant' }, true),
      mkUser({ name:'Ren', initial:'R', color:'#7C5CFF', role:'Designing in Figma' }, true),
      mkUser({ name:'Mika', initial:'M', color:'#00C2A8', role:'Listening to Lo-fi' }, true),
      mkUser({ name:'mkt-76', initial:'M', color:accent, role:'Online' }, true),
    ];
    const offline = [
      mkUser({ name:'Sora', initial:'S', color:'#8890a0', role:'Offline' }, false),
      mkUser({ name:'Kai', initial:'K', color:'#8890a0', role:'Offline' }, false),
    ];

    const iconBtn = `border:none;background:transparent;cursor:pointer;width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;color:${t.muted};transition:background .15s,color .15s`;
    const membersBtn = `border:none;cursor:pointer;width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s;background:${s.showMembers ? t.active : 'transparent'};color:${s.showMembers ? t.accent : t.muted}`;
    const canSend = s.draft.trim().length > 0;

    return {
      t,
      channels,
      channelName: (this.CHANNELS.find(c => c.id === s.channel) || {}).name || 'general',
      channelTopic: this.TOPICS[s.channel] || '',
      rows, is404, hasMessages, isEmpty, notFound: !is404,
      typing: s.typing,
      typingName: s.typingPerson.name,
      typingInitial: s.typingPerson.initial,
      typingAvatar: this.av(s.typingPerson.color, 42),
      themeBtns,
      online, offline,
      onlineCount: online.length, offlineCount: offline.length,
      showMembers: s.showMembers, toggleMembers: this.toggleMembers,
      draft: s.draft, onDraft: this.onDraft, onKey: this.onKey, send: this.send,
      composerEmoji: this.composerEmoji,
      goGeneral: this.goGeneral,
      onLeave: this.onLeave,
      quickWave: this.quickWave, quickFire: this.quickFire, quickIdea: this.quickIdea,
      scrollRef: (el) => { this.scrollEl = el; },
      iconBtn,
      membersBtn,
      footBtn: `border:none;background:transparent;cursor:pointer;width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;color:${t.muted};transition:background .15s,color .15s`,
      composerIcon: `border:none;background:transparent;cursor:pointer;width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;color:${t.muted};transition:background .15s,color .15s`,
      sendStyle: `border:none;cursor:pointer;width:40px;height:40px;flex:none;border-radius:13px;display:flex;align-items:center;justify-content:center;color:#fff;background:${t.accentGrad};box-shadow:${t.glow};transition:transform .15s,opacity .15s;transform:${canSend ? 'scale(1)' : 'scale(.92)'};opacity:${canSend ? '1' : '.55'}`,
      quickBtn: `border:1px solid ${t.divider};background:${t.panel};color:${t.text};cursor:pointer;padding:11px 16px;border-radius:13px;font:700 13.5px 'Plus Jakarta Sans';box-shadow:${t.cardShadow};transition:transform .15s`,
    };
  }
}
