/* Crew Life: the stewardess's day around each flight */
(function (SF) {
  const $ = s => document.querySelector(s);
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const esc = SF.esc;
  const KEY = 'sf_crew_life_v1';
  const BARE = { found: null, hair: 'loose', shadow: 'none', blush: 'none', lips: 'none', acc: 'none', ear: 'none' };
  const MORNING_WEAR = { outfit: 'robe', badge: false, wings: false, watch: false, shoes: 'slippers' };

  function fresh() {
    return { v: 1, created: false, name: 'Mei', skin: 1, hairC: 0, look: { ...BARE }, usual: null, wear: { ...MORNING_WEAR }, bag: ['charger', 'snacks'],
      xp: 0, money: 50, energy: 90, day: 1, owned: [], stamps: [], stars: [0, 0, 0, 0, 0], best: [0, 0, 0, 0, 0], flights: 0,
      groomed: null, dressed: false, phase: 'home', next: 0, lay: null };
  }
  let S = fresh();
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) S = Object.assign(fresh(), s); } catch (e) { }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };

  const rankIdx = () => { let r = 0; SF.RANKS.forEach((k, i) => { if (S.xp >= k.xp) r = i; }); return r; };
  const uniKey = () => SF.RANKS[rankIdx()].uni;
  const U = () => SF.UNI[uniKey()];
  const LV = () => Flight.LEVELS;
  const unlocked = i => i === 0 || S.stars[i - 1] > 0;
  const has = id => S.bag.includes(id);
  const owns = item => !item.shop || S.owned.includes(item.id);
  const me = o => SF.avatar(Object.assign({ skin: S.skin, hairC: S.hairC, look: S.look, outfit: S.wear.outfit, uni: uniKey(), badge: S.wear.badge, wings: S.wear.wings, name: S.name }, o || {}));
  const SUP = { skin: 2, hairC: 0, look: { found: 2, hair: 'twist', shadow: 'brown', blush: 'rose', lips: 'ruby', acc: 'none', ear: 'pearls' }, outfit: 'uniform', uni: 'plum', badge: true, wings: true, name: 'Mdm Tan' };
  const orchid = '<svg viewBox="0 0 40 40" aria-hidden="true"><g transform="translate(20 20)">' + [0, 72, 144, 216, 288].map(a => '<ellipse rx="6" ry="11" cy="-9" fill="' + (a % 144 ? '#d16a9f' : '#a8326e') + '" transform="rotate(' + a + ')"/>').join('') + '<circle r="4.5" fill="#e3b04b"/></g></svg>';
  const starRow = n => '<div class="stars">' + [0, 1, 2].map(i => '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="' + (i < n ? '#e3b04b' : '#ddd5c6') + '" stroke="' + (i < n ? '#b9852a' : '#cbc2b2') + '"/></svg>').join('') + '</div>';
  const sfx = k => { try { Flight.SFX[k](); } catch (e) { } };

  /* ---------- layout ---------- */
  function topbar() {
    const r = rankIdx(), cur = SF.RANKS[r], nx = SF.RANKS[r + 1];
    const pct = nx ? Math.round((S.xp - cur.xp) / (nx.xp - cur.xp) * 100) : 100;
    return `<div class="lbar"><div class="who"><i style="background:${U().c}"></i>${esc(S.name)} <span style="font-weight:400;opacity:.8">${cur.n}</span></div>
      <div class="lstat" title="Experience">XP <span class="mini"><b style="width:${pct}%"></b></span></div>
      <div class="lstat" title="Energy">Energy <span class="mini"><b style="width:${S.energy}%;background:${S.energy < 30 ? '#ff5a5f' : '#5cc98a'}"></b></span> ${Math.round(S.energy)}%</div>
      <div class="lstat">S$${S.money}</div><div class="lstat">Day ${S.day}</div><div class="sp"></div>
      ${S.phase === 'home' ? '<button data-l="book">Scrapbook</button><button data-l="career">Career</button>' : ''}<button data-l="title">Menu</button></div>`;
  }
  function frame(stage, panel, one) {
    document.body.classList.add('life-on');
    Flight.hideScr();
    $('#hud').hidden = true;
    $('#life').innerHTML = topbar() + `<div class="lmain${one ? ' one' : ''}">${one ? '' : `<div class="stage" id="stage">${stage}</div>`}<div class="lpanel">${panel}</div></div>`;
    $('#life').scrollTop = 0;
    const f = $('#life .lpanel button:not(:disabled), #life .lpanel input'); if (f) f.focus({ preventScroll: true });
  }
  const setStage = html => { const s = $('#stage'); if (s) s.innerHTML = html; };
  function modal(html) { closeModal(); const m = document.createElement('div'); m.className = 'lmodal'; m.innerHTML = `<div class="card">${html}</div>`; $('#life').appendChild(m); const b = m.querySelector('button'); if (b) b.focus(); }
  function closeModal() { const m = $('#life .lmodal'); if (m) m.remove(); }

  /* ---------- title ---------- */
  function title() {
    document.body.classList.remove('life-on');
    Flight.show(`<div class="card title"><div class="brand">${orchid}Singapore Flight · Cabin crew</div><h1>Aisle Service</h1>
      <p>Live a stewardess's life: do your makeup, put on the kebaya uniform, brief with your supervisor, work the aisle at 38,000 feet, then check into the hotel and explore the city on your layover.</p>
      <div class="row-btns"><button class="cta" data-life="start">${S.created ? 'Continue crew life' : 'Start crew life'}</button><button class="ghost" data-a="sel">Quick flight</button><button class="ghost" data-life="mute">${Flight.muted ? 'Sound off' : 'Sound on'}</button></div>
      <div class="keys">In flight: <kbd>▲</kbd><kbd>▼</kbd> or <kbd>W</kbd><kbd>S</kbd> walk · <kbd>1</kbd>–<kbd>7</kbd> serve · <kbd>Space</kbd> warm smile · <kbd>T</kbd> secure trolley · <kbd>B</kbd> seatbelt check · <kbd>R</kbd> restock · <kbd>P</kbd> pause<br>On a phone: tap the arrows, the trolley and the cabin map.</div>
      <div class="fine">A fan-made game. Singapore Flight is a made-up airline.</div></div>`);
  }
  function resume() {
    if (!S.created) return creator();
    if ((S.phase === 'hotel' || S.phase === 'layover') && S.lay) return SF.out.resume();
    if (S.phase === 'flying') { S.phase = 'home'; save(); }
    home();
  }

  /* ---------- character creator ---------- */
  function creator() {
    const panel = `<h2>Create your stewardess</h2><p class="sub">You can change your makeup and hair every morning. These are just the basics.</p>
      <div class="field"><label for="nm"><b>Name on your badge</b></label><input id="nm" maxlength="12" value="${esc(S.name)}" autocomplete="off"></div>
      <div><b>Skin tone</b><div class="sw" style="margin-top:8px">${SF.SKINS.map((c, i) => `<button class="swb${i === S.skin ? ' on' : ''}" data-l="cskin" data-v="${i}" aria-label="Skin tone ${i + 1}"><i style="background:${c}"></i></button>`).join('')}</div></div>
      <div><b>Hair colour</b><div class="sw" style="margin-top:8px">${SF.HAIRC.map((c, i) => `<button class="swb${i === S.hairC ? ' on' : ''}" data-l="chair" data-v="${i}" aria-label="Hair colour ${i + 1}"><i style="background:${c}"></i></button>`).join('')}</div></div>
      <div class="box">Welcome to <b>Singapore Flight</b>! You start as a trainee in the teal kebaya. Fly well to earn XP, climb the ranks and unlock new uniform colours.</div>
      <div class="row-btns"><button class="cta" data-l="cdone">Start my first day</button></div>`;
    frame(SF.scene('create', me({ outfit: 'uniform', badge: true, wings: true, look: { ...BARE, hair: 'bun', lips: 'nude', found: S.skin } })), panel);
    $('#nm').addEventListener('input', e => { S.name = e.target.value.trim() || 'Mei'; });
  }

  /* ---------- home ---------- */
  function home() {
    S.phase = 'home'; if (!unlocked(S.next)) S.next = 0; save();
    const L = LV()[S.next];
    const g = S.groomed, rank = SF.RANKS[rankIdx()];
    const tired = S.energy < 40;
    const panel = `<h2>Good morning, ${esc(S.name)}</h2><p class="sub">Day ${S.day} · ${rank.n} · ${S.stamps.length}/10 postcards collected</p>
      <div class="box"><b>Today’s duty</b><div class="chips" style="margin:10px 0">${LV().map((l, i) => `<button class="tab${i === S.next ? ' on' : ''}" data-l="pick" data-v="${i}" ${unlocked(i) ? '' : 'disabled'}>${l.code.replace(' ', '')} · ${l.to}${S.stars[i] ? ' ' + '★'.repeat(S.stars[i]) : ''}</button>`).join('')}</div>
        <div style="font-size:15px"><b>${L.code}</b> Singapore → ${L.tc} · ${L.time} · ${L.N} rows · layover at ${SF.CITIES[L.to].hotel}</div></div>
      <div class="steps">
        <button class="step${g ? ' done' : ''}" data-l="groom"><span class="n">${g ? '✓' : '1'}</span><span><b>Get ready at the vanity</b><span>${g ? 'Grooming check: ' + '★'.repeat(g.stars) + '☆'.repeat(3 - g.stars) : 'Makeup and hair, then a grooming check'}</span></span><span aria-hidden="true">›</span></button>
        <button class="step${S.dressed ? ' done' : ''}" data-l="ward"><span class="n">${S.dressed ? '✓' : '2'}</span><span><b>Dress and pack your crew bag</b><span>${S.dressed ? 'In uniform, bag packed (' + S.bag.length + ' items)' : 'Uniform, pins, shoes and documents'}</span></span><span aria-hidden="true">›</span></button>
        <button class="step" data-l="brief" ${g && S.dressed ? '' : 'disabled'}><span class="n">3</span><span><b>Report to the crew centre</b><span>${g && S.dressed ? 'Briefing with Mdm Tan, then board ' + L.code : 'Finish steps 1 and 2 first'}</span></span><span aria-hidden="true">›</span></button>
      </div>
      ${tired ? `<div class="box">You’re running low on energy (${Math.round(S.energy)}%). Tired crew walk the aisle more slowly. <button class="ghost" style="margin-top:10px" data-l="rest">Take a rest day (+40 energy)</button></div>` : ''}`;
    frame(SF.scene('home', me()), panel);
  }

  /* ---------- vanity / grooming ---------- */
  let gtab = 'found';
  const TABS = [['found', 'Foundation'], ['eyes', 'Eyeshadow'], ['blush', 'Blush'], ['lips', 'Lipstick'], ['hair', 'Hair'], ['acc', 'Accessories']];
  function vanityStage() { return SF.scene('vanity', SF.avatar({ skin: S.skin, hairC: S.hairC, look: S.look, outfit: S.wear.outfit, uni: uniKey(), name: S.name }, '30 14 180 225')); }
  function groom() {
    const sw = (key, list, colorOf) => `<div class="sw">${list.filter(owns).map(it => {
      const c = colorOf(it); const on = S.look[key] === it.id;
      return `<button class="swb${on ? ' on' : ''}" data-l="look" data-k="${key}" data-v="${it.id}">${c ? `<i style="background:${c}"></i>` : '<i style="background:repeating-linear-gradient(45deg,#fff 0 4px,#eee 4px 8px)"></i>'}${it.n}</button>`;
    }).join('')}</div>`;
    let body = '';
    if (gtab === 'found') body = `<p class="sub" style="margin:0 0 8px">Pick the shade that matches your skin. Check the mirror: face and neck should be the same colour.</p><div class="sw">${SF.FOUND.map((f, i) => `<button class="swb${S.look.found === i ? ' on' : ''}" data-l="found" data-v="${i}"><i style="background:${f.c}"></i>${f.n}</button>`).join('')}</div>`;
    if (gtab === 'eyes') body = sw('shadow', SF.SHADOW, it => it.c === 'uni' ? U().c : it.c);
    if (gtab === 'blush') body = sw('blush', SF.BLUSH, it => it.c);
    if (gtab === 'lips') body = sw('lips', SF.LIPS, it => it.c);
    if (gtab === 'hair') body = sw('hair', SF.HAIR, () => SF.HAIRC[S.hairC]);
    if (gtab === 'acc') body = '<b>Hair accessory</b>' + sw('acc', SF.ACC, it => ({ none: null, orchid: '#a8326e', pearlclip: '#fbf7ef', bow: '#ff4d6d' })[it.id]) + '<b style="margin-top:6px;display:block">Earrings</b>' + sw('ear', SF.EAR, it => ({ none: null, studs: '#e3b04b', pearls: '#fbf7ef', hoops: '#e3b04b' })[it.id]);
    const shopNote = S.owned.length < 10 ? '<p class="sub" style="margin:4px 0 0">Find more shades and accessories in the shops on your layovers.</p>' : '';
    const panel = `<h2>Vanity mirror</h2><p class="sub">Polished and natural is the Singapore Flight look. Your supervisor checks it before every flight.</p>
      <div class="tabs" role="tablist">${TABS.map(([k, n]) => `<button class="tab${gtab === k ? ' on' : ''}" data-l="gtab" data-v="${k}" role="tab" aria-selected="${gtab === k}">${n}</button>`).join('')}</div>
      <div class="box">${body}${shopNote}</div>
      <div class="row-btns">${S.usual ? '<button class="ghost" data-l="usual">Apply my usual look</button>' : ''}<button class="ghost" data-l="bare">Remove makeup</button><button class="cta" data-l="gcheck">Grooming check</button></div>
      <div><button class="ghost" data-l="home">Back home</button></div>`;
    frame(vanityStage(), panel);
  }
  function groomResult() {
    const L = S.look, r = [];
    const f = L.found;
    r.push(f == null ? [0, 'Foundation', 'No foundation yet. Even out your skin tone first.'] : Math.abs(f - S.skin) === 0 ? [1, 'Foundation', 'A perfect match.'] : Math.abs(f - S.skin) === 1 ? [1, 'Foundation', 'Close enough to your skin tone.'] : [0, 'Foundation', 'That shade doesn’t match your skin. Your face and neck are two different colours!']);
    const h = SF.HAIR.find(x => x.id === L.hair);
    r.push(h.ok ? [1, 'Hair', h.n + ', neat and off the collar.'] : [0, 'Hair', 'Hair must be pinned up: a bun, French twist or chignon.']);
    const lp = SF.LIPS.find(x => x.id === L.lips);
    r.push(lp.id === 'none' ? [0, 'Lipstick', 'A touch of lipstick finishes the look.'] : lp.ok ? [1, 'Lipstick', lp.n + ' is a lovely choice.'] : [0, 'Lipstick', lp.n + ' isn’t in the grooming guide. Save it for your day off!']);
    const sh = SF.SHADOW.find(x => x.id === L.shadow);
    r.push(sh.ok ? [1, 'Eyes', 'Soft and polished.'] : [0, 'Eyes', 'Too much sparkle for the cabin.']);
    const bl = SF.BLUSH.find(x => x.id === L.blush);
    r.push(bl.ok ? [1, 'Blush', bl.id === 'none' ? 'Fresh-faced.' : 'Subtle and fresh.'] : [0, 'Blush', 'Tone the blush down a little.']);
    const ac = SF.ACC.find(x => x.id === L.acc), er = SF.EAR.find(x => x.id === L.ear);
    r.push(ac.ok && er.ok ? [1, 'Accessories', 'Within the guide.'] : [0, 'Accessories', (!ac.ok ? ac.n : er.n) + ' is a bit much for duty.']);
    const pass = r.filter(x => x[0]).length;
    const stars = pass === 6 ? 3 : pass === 5 ? 2 : pass === 4 ? 1 : 0;
    return { r, stars, bonus: [-5, 2, 5, 8][stars] };
  }
  function groomCheck() {
    const g = groomResult();
    const head = ['Not quite ready', 'Almost there', 'Looking good', 'Picture perfect!'][g.stars];
    modal(`<h2>${head}</h2>${starRow(g.stars)}<ul class="checks">${g.r.map(([ok, k, t]) => `<li><span class="${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'}</span><span><b>${k}:</b> ${t}</span></li>`).join('')}</ul>
      <p style="font-size:14px;margin:0 0 14px">${g.stars ? `Cabin mood bonus on your next flight: <b>+${g.bonus}%</b>.` : 'Report like this and you’ll start the flight with <b>−5%</b> cabin mood.'}</p>
      <div class="row-btns">${g.stars === 3 ? '' : '<button class="ghost" data-l="close">Keep fixing</button>'}<button class="cta" data-l="gdone">${g.stars ? 'All set' : 'Go anyway'}</button></div>`);
    sfx(g.stars >= 2 ? 'ding' : 'buzz');
  }

  /* ---------- wardrobe + crew bag ---------- */
  function ward() {
    const W = S.wear, u = U();
    const card = (l, k, v, on, label, icon, extra) => `<button class="swb${on ? ' on' : ''}" data-l="${l}" data-k="${k}" data-v="${v}" aria-pressed="${on}">${icon}${label}${extra || ''}</button>`;
    const panel = `<h2>Wardrobe</h2><p class="sub">Your rank wears the <b>${u.n.toLowerCase()}</b> kebaya. New colours unlock as you climb the ranks.</p>
      <div class="box"><b>Outfit</b><div class="sw" style="margin-top:8px">${SF.OUTFITS.map(o => card('wear', 'outfit', o.id, W.outfit === o.id, o.n, SF.icon(o.id, u.c))).join('')}</div></div>
      <div class="box"><b>Uniform details</b><div class="sw" style="margin-top:8px">${[['badge', 'Name badge'], ['wings', 'Wings pin'], ['watch', 'Watch']].map(([k, n]) => card('wtog', k, '1', W[k], n, SF.icon(k))).join('')}</div>
        <b style="display:block;margin-top:12px">Shoes</b><div class="sw" style="margin-top:8px">${SF.SHOES.map(sh => card('wear', 'shoes', sh.id, W.shoes === sh.id, sh.n, SF.icon(sh.id))).join('')}</div></div>
      <div class="box"><b>Crew bag (${S.bag.length}/${SF.BAG_MAX})</b> <span class="sub" style="margin:0">Items tagged “duty” are needed at work.</span>
        <div class="sw" style="margin-top:8px">${SF.BAG.map(it => card('bag', 'bag', it.id, has(it.id), it.n, SF.icon(it.id), it.req ? ' <span class="tag req">duty</span>' : '')).join('')}</div></div>
      <div class="row-btns"><button class="cta" data-l="wdone" ${W.outfit === 'uniform' ? '' : 'disabled'}>${W.outfit === 'uniform' ? 'I’m ready' : 'Put on your uniform first'}</button><button class="ghost" data-l="home">Back home</button></div>`;
    frame(SF.scene('wardrobe', me(), { uni: u.c }), panel);
  }

  /* ---------- briefing ---------- */
  let B = null;
  function dutyChecks() {
    const W = S.wear, out = [];
    const add = (ok, t, pts) => out.push({ ok, t, pts: ok ? 0 : pts });
    const g = S.groomed || { stars: 0, bonus: -5 };
    out.push({ ok: g.stars > 0, t: `Grooming: ${'★'.repeat(g.stars) + '☆'.repeat(3 - g.stars)}`, pts: g.bonus, groom: 1 });
    add(W.badge, W.badge ? 'Name badge on' : 'No name badge! Passengers like to know who’s serving them.', -2);
    add(W.wings, W.wings ? 'Wings pin on' : 'Your wings pin is missing.', -2);
    add(W.watch, W.watch ? 'Watch on, perfect for timing service' : 'No watch. How will you time the service?', -2);
    add(W.shoes === 'pumps', W.shoes === 'pumps' ? 'Uniform pumps' : SF.SHOES.find(s => s.id === W.shoes).n + ' aren’t uniform shoes!', -3);
    add(has('passport'), has('passport') ? 'Passport ready' : 'No passport! Ground staff had to rush you a temporary pass.', -10);
    add(has('crewid'), has('crewid') ? 'Crew ID ready' : 'No crew ID. Hotel check-in will take longer.', -3);
    add(has('licence'), has('licence') ? 'Crew licence ready' : 'Crew licence left at home.', -3);
    add(has('torch'), has('torch') ? 'Torch packed' : 'No torch for the night cabin.', -2);
    add(has('manual'), has('manual') ? 'Manual tablet packed' : 'No manual tablet.', -2);
    return out;
  }
  function brief() {
    const qs = SF.QUIZ.slice().sort(() => Math.random() - .5).slice(0, 3).map(q => ({ ...q, order: [0, 1, 2].sort(() => Math.random() - .5) }));
    B = { step: 0, qs, qi: 0, right: 0, picked: null, checks: dutyChecks() };
    briefRender();
  }
  function briefRender() {
    const L = LV()[S.next];
    let panel = '';
    if (B.step === 0) {
      panel = `<h2>Crew centre briefing</h2><div class="chat"><div class="bub them"><b>Mdm Tan:</b> Good morning, ${esc(S.name)}! Before we board ${L.code} to ${L.tc}, let me take a look at you.</div></div>
        <ul class="checks box">${B.checks.map(c => `<li><span class="${c.ok ? 'ok' : 'no'}">${c.ok ? '✓' : '✗'}</span><span>${c.t}${c.pts ? ` <b>(${c.pts > 0 ? '+' : ''}${c.pts}% mood)</b>` : ''}</span></li>`).join('')}</ul>
        <div class="row-btns"><button class="cta" data-l="bnext">Start the safety questions</button></div>`;
    } else if (B.step === 1) {
      const q = B.qs[B.qi], ans = B.picked;
      panel = `<h2>Question ${B.qi + 1} of 3</h2><div class="chat"><div class="bub them"><b>Mdm Tan:</b> ${q.q}</div></div>
        <div class="opts">${q.order.map(i => `<button class="opt" data-l="bans" data-v="${i}" ${ans != null ? 'disabled' : ''} style="${ans != null && i === 0 ? 'border-color:#2e9e5b;background:#e7f7ee' : ans === i ? 'border-color:#d7263d;background:#fde8ea' : ''}">${q.a[i]}</button>`).join('')}</div>
        ${ans != null ? `<div class="box">${ans === 0 ? '<b style="color:#2e9e5b">Correct!</b>' : '<b style="color:#d7263d">Not quite.</b>'} ${q.why}</div><div class="row-btns"><button class="cta" data-l="bq">${B.qi < 2 ? 'Next question' : 'Finish briefing'}</button></div>` : ''}`;
    } else {
      const m = briefMods();
      panel = `<h2>Ready for boarding</h2><div class="chat"><div class="bub them"><b>Mdm Tan:</b> ${B.right === 3 ? 'Full marks, well done!' : B.right ? 'Good effort.' : 'Let’s revise those together on the flight.'} Have a lovely flight to ${L.tc}.</div></div>
        <div class="box"><ul class="checks" style="margin:0">
          <li><span class="ok">●</span><span>Cabin mood at take-off: <b>${clamp(75 + m.sat, 5, 100)}%</b> (${m.sat >= 0 ? '+' : ''}${m.sat}% from grooming, kit and ${B.right}/3 correct answers)</span></li>
          <li><span class="ok">●</span><span>Energy ${Math.round(S.energy)}%: walking pace <b>${Math.round(m.walk * 100)}%</b>${m.smile ? `, smile meter starts at <b>${m.smile}/6</b>` : ''}</span></li></ul></div>
        <div class="row-btns"><button class="cta" data-l="fly">Board ${L.code}</button></div>`;
    }
    frame(SF.scene('brief', SF.avatar(SUP), { code: L.code, to: L.to }), panel);
  }
  function briefMods() {
    const sat = B.checks.reduce((a, c) => a + (c.groom ? c.pts : c.pts), 0) + B.right * 2;
    const walk = 0.8 + 0.4 * S.energy / 100, smile = S.energy >= 80 ? 2 : S.energy >= 50 ? 1 : 0;
    return { sat, walk, smile };
  }
  function fly() {
    const m = briefMods(), u = U();
    S.phase = 'flying'; save();
    document.body.classList.remove('life-on');
    Flight.startLevel(S.next, { career: true, name: S.name, sat: m.sat, walk: m.walk, smile: m.smile, sleeve: u.c, sleeveAccent: u.a,
      note: S.energy < 30 ? 'You’re exhausted today, so your steps are slower. Rest well on the layover.' : !has('torch') && LV()[S.next].theme === 'night' ? 'No torch tonight. Mind your step in the dark cabin.' : null });
  }

  /* ---------- after the flight ---------- */
  function flightDone(res) {
    const L = LV()[res.lvl];
    const right = B ? B.right : 0;
    const before = rankIdx(), wasNext = unlocked(res.lvl + 1);
    const xp = Math.round(res.score / 10) + res.stars * 60 + right * 20;
    const pay = 40 + res.lvl * 20 + Math.round(res.score / 120) + res.stars * 10;
    const tired = 20 + res.lvl * 5;
    S.xp += xp; S.money += pay; S.energy = clamp(S.energy - tired, 0, 100); S.flights++;
    if (res.stars > S.stars[res.lvl]) S.stars[res.lvl] = res.stars;
    if (res.score > S.best[res.lvl]) S.best[res.lvl] = res.score;
    S.phase = 'hotel';
    S.lay = { city: L.to, lvl: res.lvl, hours: SF.CITIES[L.to].hours, room: null, wake: true, done: [], shop: false, stage: 'lobby', lob: 0 };
    save();
    const up = rankIdx() > before, newR = SF.RANKS[rankIdx()];
    const unlockedNow = !wasNext && unlocked(res.lvl + 1) && res.lvl < 4;
    const head = !res.ok ? 'The purser stepped in' : ['Rough landing', 'Landed safely', 'Smooth flight', 'Outstanding service!'][res.stars];
    const panel = `<h2>${head}</h2><p class="sub">${L.code} landed in ${L.tc}</p>${starRow(res.stars)}
      <div class="stats" style="margin:0"><div><b>${res.score.toLocaleString()}</b><span>Score</span></div><div><b>${res.sat}%</b><span>Cabin mood</span></div><div><b>${res.served}</b><span>Served</span></div></div>
      <div class="rew"><div>+${xp} XP</div><div>+S$${pay} allowance</div><div>−${tired}% energy</div></div>
      ${up ? `<div class="banner2">Promoted to <b>${newR.n}</b>!${SF.RANKS[before].uni !== newR.uni ? ` You now wear the <b>${SF.UNI[newR.uni].n.toLowerCase()}</b> kebaya.` : ''}</div>` : ''}
      ${unlockedNow ? `<div class="box">New route unlocked: <b>${LV()[res.lvl + 1].code}</b> to ${LV()[res.lvl + 1].tc}.</div>` : ''}
      ${res.stars === 0 ? '<div class="box">You need at least one star (50% cabin mood) to clear this route. Try it again on your next duty day.</div>' : ''}
      <div class="row-btns"><button class="cta" data-l="hotel">Head to the hotel</button></div>`;
    frame(SF.scene('report', me({ outfit: 'uniform' })), panel);
    if (up) sfx('win');
  }

  /* ---------- scrapbook & career ---------- */
  function book() {
    const cityOf = id => Object.values(SF.CITIES).find(c => c.spots.some(s => s.id === id));
    const panel = `<h2>Layover scrapbook</h2><p class="sub">${S.stamps.length} of 10 postcards. Explore on your layovers to collect them all.</p>
      <div class="grid10">${SF.STAMPS.map(id => { const c = cityOf(id), sp = c.spots.find(s => s.id === id), got = S.stamps.includes(id);
      return `<div class="card2">${got ? SF.postcard(id) : '<div class="lock">?</div>'}<div class="t"><b>${got ? sp.n : 'Not yet visited'}</b><br>${c.city}</div></div>`; }).join('')}</div>
      <div><button class="ghost" data-l="home">Back home</button></div>`;
    frame('', panel, true);
  }
  function career() {
    const r = rankIdx();
    const panel = `<h2>Career</h2><p class="sub">${S.xp.toLocaleString()} XP · ${S.flights} flights flown · S$${S.money} saved</p>
      <div class="ladder">${SF.RANKS.map((k, i) => `<div class="rung${i === r ? ' cur' : ''}${i > r ? ' lock' : ''}"><i style="background:${SF.UNI[k.uni].c}"></i><span><b>${k.n}</b><br><span class="sub" style="margin:0">${SF.UNI[k.uni].n} kebaya</span></span><span>${k.xp.toLocaleString()} XP</span></div>`).join('')}</div>
      <div class="box"><b>Route stars</b><div class="chips" style="margin-top:8px">${LV().map((l, i) => `<span class="tag">${l.code} ${l.to} ${'★'.repeat(S.stars[i]) || '–'}</span>`).join('')}</div></div>
      <div class="row-btns"><button class="ghost" data-l="home">Back home</button><button class="ghost" data-l="reset">Start a new career</button></div>`;
    frame('', panel, true);
  }

  /* ---------- events ---------- */
  const A = {
    title: () => { if (SF.out) SF.out.stop(); Flight.toMenu(); }, home, book, career, close: closeModal,
    cskin: v => { S.skin = +v; creator(); }, chair: v => { S.hairC = +v; creator(); },
    cdone: () => { S.name = ($('#nm').value.trim() || 'Mei').slice(0, 12); S.created = true; save(); home(); },
    pick: v => { S.next = +v; save(); home(); },
    rest: () => { S.energy = clamp(S.energy + 40, 0, 100); S.day++; S.look = { ...BARE }; S.wear = { ...MORNING_WEAR }; S.groomed = null; S.dressed = false; save(); home(); },
    groom: () => { gtab = 'found'; groom(); }, gtab: v => { gtab = v; groom(); },
    look: (v, b) => { S.look[b.dataset.k] = v; S.groomed = null; save(); groom(); },
    found: v => { S.look.found = +v; S.groomed = null; save(); groom(); },
    usual: () => { S.look = { ...S.usual }; S.groomed = null; save(); groom(); },
    bare: () => { S.look = { ...BARE }; S.groomed = null; save(); groom(); },
    gcheck: groomCheck,
    gdone: () => { const g = groomResult(); S.groomed = { stars: g.stars, bonus: g.bonus }; if (g.stars >= 2) S.usual = { ...S.look }; save(); closeModal(); home(); },
    ward,
    wear: (v, b) => { S.wear[b.dataset.k] = v; if (b.dataset.k === 'outfit' && v !== 'uniform') S.dressed = false; save(); ward(); },
    wtog: (v, b) => { const k = b.dataset.k; S.wear[k] = !S.wear[k]; save(); ward(); },
    bag: v => { if (has(v)) S.bag = S.bag.filter(x => x !== v); else if (S.bag.length < SF.BAG_MAX) S.bag.push(v); else { modal(`<h2>Your bag is full</h2><p>Crew bags hold ${SF.BAG_MAX} things. Take something out first.</p><div class="row-btns"><button class="cta" data-l="close">OK</button></div>`); return; } save(); ward(); },
    wdone: () => { S.dressed = true; save(); home(); },
    brief, bnext: () => { B.step = 1; briefRender(); },
    bans: v => { B.picked = +v; if (+v === 0) { B.right++; sfx('ding'); } else sfx('buzz'); briefRender(); },
    bq: () => { B.picked = null; if (B.qi < 2) B.qi++; else B.step = 2; briefRender(); },
    fly, hotel: () => SF.out.start(),
    reset: () => modal('<h2>Start a new career?</h2><p>This clears your name, rank, postcards and purchases.</p><div class="row-btns"><button class="ghost" data-l="close">Keep my career</button><button class="cta" data-l="reset2">Start over</button></div>'),
    reset2: () => { S = fresh(); save(); closeModal(); creator(); }
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-l]');
    if (b && $('#life').contains(b)) { try { Flight.ac(); } catch (x) { } const f = A[b.dataset.l]; if (f) f(b.dataset.v, b); return; }
    const t = e.target.closest('[data-life]');
    if (t) { const a = t.dataset.life; if (a === 'start') resume(); if (a === 'mute') t.textContent = Flight.toggleMute() ? 'Sound off' : 'Sound on'; }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#life .lmodal')) closeModal(); });

  const resetMorning = () => { S.look = { ...BARE }; S.wear = { ...MORNING_WEAR }; S.groomed = null; S.dressed = false; };
  SF.life = { title, home, flightDone, get state() { return S; },
    api: { state: () => S, save, topbar, modal, closeModal, sfx, has, home, resetMorning,
      props: o => Object.assign({ skin: S.skin, hairC: S.hairC, look: S.look, outfit: S.wear.outfit, uni: uniKey(), badge: S.wear.badge, wings: S.wear.wings, name: S.name }, o || {}) } };
  Flight.toMenu();
})(window.SF);
