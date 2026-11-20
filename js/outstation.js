/* Outstation: visual hotel lobby, hotel room, walkable city street and mini-games */
(function (SF) {
  const $ = s => document.querySelector(s);
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const esc = SF.esc;
  const O = SF.out = {};
  let api, S, loop = null, keys = { l: false, r: false };
  const DESK = { KUL: ['Aisyah', 3, 1], BKK: ['Ploy', 2, 0], HND: ['Yui', 0, 0], LHR: ['Olivia', 1, 4], JFK: ['Maya', 5, 0] };
  const DISH = { KUL: 'noodles', BKK: 'mango', HND: 'ramen', LHR: 'tea', JFK: 'show' };
  const WORLD = 2600, SPOTS = { hotel: 270, s1: 900, s2: 1500, shop: 2100 };

  /* ---------- helpers ---------- */
  const C = () => SF.CITIES[S.lay.city];
  const lerp = (a, b, t) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const f = s => Math.round(((A >> s) & 255) + (((B >> s) & 255) - ((A >> s) & 255)) * t); return '#' + ((1 << 24) + (f(16) << 16) + (f(8) << 8) + f(0)).toString(16).slice(1); };
  const frac = () => clamp(1 - S.lay.hours / C().hours, 0, 1);
  function skyCols() {
    const f = frac();
    if (f < 0.5) { const t = f / 0.5; return [lerp('#78bdf0', '#5b4a8a', t), lerp('#dff1ff', '#ffb27a', t)]; }
    const t = (f - 0.5) / 0.5; return [lerp('#5b4a8a', '#0b1330', t), lerp('#ffb27a', '#27386a', t)];
  }
  const night = () => frac() > 0.55;
  const me = (o) => api.props(Object.assign({ outfit: S.lay.casual ? 'casual' : 'uniform', dress: '#f6c453' }, o || {}));
  const fullMe = o => SF.avatarFull(me(o));
  const nest = (svg, x, y, w) => svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${w * 580 / 240}" `);
  const nestBust = (svg, x, y, w) => svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${w * 1.25}" `);
  const hud = () => `<div class="ohud"><span>${S.lay.hours} h until pick-up</span><span>Energy ${Math.round(S.energy)}%</span><span>S$${S.money}</span></div>`;
  function screen(inner) {
    stopLoop();
    document.body.classList.add('life-on');
    Flight.hideScr(); $('#hud').hidden = true;
    $('#life').innerHTML = api.topbar() + `<div class="oscene" id="osc">${inner}</div>`;
    fit();
  }
  function fit() {
    const o = $('#osc'), b = $('#life .lbar'); if (!o || !b) return;
    o.style.height = Math.max(320, innerHeight - b.offsetHeight) + 'px';
    const w = o.querySelector('svg.world:not(#wsvg)'); if (!w) return;
    const asp = o.clientWidth / o.clientHeight;
    if (asp * 540 >= 800) { w.setAttribute('viewBox', '0 0 800 540'); w.setAttribute('preserveAspectRatio', 'xMidYMax slice'); }
    else { const W = Math.max(430, asp * 540), Hh = W / asp, y0 = Hh > 540 ? 540 - Hh * 0.8 : 540 - Hh; w.setAttribute('viewBox', `${(410 - W / 2).toFixed(1)} ${y0.toFixed(1)} ${W.toFixed(1)} ${Hh.toFixed(1)}`); w.setAttribute('preserveAspectRatio', 'xMidYMax meet'); }
  }
  addEventListener('resize', () => { if ($('#osc')) fit(); });
  function bubble(who, text) { const b = $('#obub'); if (!b) return; b.innerHTML = (who ? `<b>${who}:</b> ` : '') + text; b.classList.add('on'); }
  function bar(prompt, buttons) {
    const el = $('#obar'); if (!el) return;
    el.innerHTML = (prompt ? `<div class="pr">${prompt}</div>` : '') + buttons.map(b => `<button class="obtn${b.main ? ' main' : ''}${b.cls ? ' ' + b.cls : ''}" data-o="${b.a}"${b.v != null ? ` data-v="${b.v}"` : ''} ${b.dis ? 'disabled' : ''}${b.label ? ` aria-label="${b.label}"` : ''}>${b.t}${b.s ? `<small>${b.s}</small>` : ''}</button>`).join('');
  }
  const hot = (a, x, y, r, label) => `<g class="hot" data-o="${a}" role="button" aria-label="${label}"><circle class="ring" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${r * 0.42}" fill="#a8326e" stroke="#fff" stroke-width="2"/></g>`;
  function moveMe(x, ms) { const g = $('#me'); if (!g) return; const cur = +g.dataset.x || 0; g.dataset.x = x; g.classList.toggle('face-l', x < cur); g.classList.add('walking'); g.style.transition = `transform ${ms || 1200}ms ease-in-out`; g.style.transform = `translate(${x}px,0)`; clearTimeout(g._t); g._t = setTimeout(() => g.classList.remove('walking'), ms || 1200); }
  const sfx = k => api.sfx(k);
  const save = () => api.save();

  /* ---------- lobby ---------- */
  function lobbySVG() {
    const D = DESK[S.lay.city];
    const rec = SF.avatar({ skin: D[1], hairC: D[2], look: { found: D[1], hair: 'bun', shadow: 'champ', blush: 'peach', lips: 'coral', acc: 'none', ear: 'studs' }, outfit: 'hotel', badge: true, name: D[0] });
    let s = '<svg class="world" viewBox="0 0 800 540" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">';
    s += '<defs><linearGradient id="lw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4e8d4"/><stop offset="1" stop-color="#e6d3b6"/></linearGradient><linearGradient id="lf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9ddc8"/><stop offset="1" stop-color="#cdbb9e"/></linearGradient></defs>';
    s += '<rect y="-700" width="800" height="1150" fill="#f4e8d4"/><rect width="800" height="450" fill="url(#lw)"/><rect y="250" width="800" height="80" fill="#d9c6a6"/><path d="M0 250h800" stroke="#c4ad88" stroke-width="3"/>';
    s += '<rect y="500" width="800" height="500" fill="#cdbb9e"/><rect y="330" width="800" height="210" fill="url(#lf)"/>' + [-400, -200, 0, 200, 400, 600, 800, 1000, 1200].map(x => `<path d="M${400 + (x - 400) * 0.35} 330L${400 + (x - 400) * 1.5} 540" stroke="#bfae92" stroke-width="1.2"/>`).join('') + '<path d="M0 370h800M0 410h800M0 460h800M0 515h800" stroke="#bfae92" stroke-width="1"/>';
    // columns + art
    s += '<rect x="20" y="40" width="36" height="290" fill="#eadbc2"/><rect x="744" y="40" width="36" height="290" fill="#eadbc2"/>';
    // elevator
    s += '<rect x="96" y="120" width="140" height="212" rx="4" fill="#bfa47a"/><rect x="106" y="132" width="120" height="200" fill="#8f9aa4"/><g id="doors"><rect id="dl" x="106" y="132" width="60" height="200" fill="#b8c2ca" style="transition:transform .9s;transform-box:fill-box"/><rect id="dr" x="166" y="132" width="60" height="200" fill="#aab4bd" style="transition:transform .9s;transform-box:fill-box"/></g><path d="M166 132v200" stroke="#7f8a94"/><circle cx="166" cy="110" r="7" fill="#ffd36b"/><path d="M162 112l4-5 4 5" stroke="#8a6a20" stroke-width="2" fill="none"/>';
    // chandelier + sign
    s += '<rect x="516" y="0" width="6" height="34" fill="#c9a14a"/><path d="M470 34h98l-14 30h-70z" fill="#d9b25a"/>' + [484, 504, 524, 544].map(x => `<circle cx="${x + 6}" cy="70" r="6" fill="#fff6d6"/><circle cx="${x + 6}" cy="70" r="14" fill="#fff6d6" opacity=".2"/>`).join('');
    s += `<rect x="400" y="96" width="300" height="44" rx="4" fill="#2b2f45"/><text x="550" y="124" fill="#e3c27a" font-size="17" font-family="Sora,sans-serif" text-anchor="middle" font-weight="700">${esc(C().hotel)}</text>`;
    // plants
    const plant = x => `<g transform="translate(${x} 250)"><path d="M-18 80h36l-5-30h-26z" fill="#8a6a50"/><path d="M0 52q-34-46-12-86M0 52q30-40 22-88M0 52q-2-52 2-74M0 52q-40-20-44-48M0 52q40-16 46-44" stroke="#3f7a3a" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
    s += plant(300) + plant(760);
    // receptionist + desk
    s += nestBust(rec, 480, 150, 150);
    s += '<rect x="400" y="300" width="300" height="110" fill="#6b4a32"/><rect x="392" y="290" width="316" height="16" rx="3" fill="#8a6a50"/><rect x="420" y="320" width="260" height="70" fill="#5c3e2a"/><path d="M430 330h240" stroke="#a8326e" stroke-width="3" opacity=".8"/>';
    s += `<g id="bell">${S.lay.lob === 0 ? hot('bell', 650, 278, 22, 'Ring the bell') : ''}<path d="M638 290a12 12 0 0 1 24 0z" fill="#e3b04b"/><rect x="634" y="289" width="32" height="4" rx="2" fill="#c9a14a"/><circle cx="650" cy="276" r="2.5" fill="#c9a14a"/></g>`;
    s += `<g id="phone">${S.lay.lob === 3 ? hot('wake', 440, 276, 22, 'Book a wake-up call') : ''}<rect x="426" y="280" width="30" height="12" rx="3" fill="#2a2a2a"/><path d="M424 280q16-14 34 0" stroke="#2a2a2a" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
    // card that flies between player and desk
    s += `<g id="card" style="transition:transform .8s ease,opacity .3s;opacity:0"><rect x="300" y="300" width="26" height="17" rx="2" fill="#fff" stroke="#1f6f8b" stroke-width="2"/><rect x="304" y="304" width="7" height="8" fill="#9fb3c0"/></g>`;
    // player + suitcase
    const x0 = S.lay.lob === 0 && !S.lay.arrived ? -140 : 250;
    s += `<g id="me" data-x="${x0}" style="transform:translate(${x0}px,0)"><g class="flipg">${nest(fullMe(), 0, 190, 100)}</g><g><rect x="96" y="372" width="40" height="58" rx="6" fill="#1f3b52"/><rect x="104" y="356" width="24" height="18" rx="4" fill="none" stroke="#2b2f36" stroke-width="4"/><circle cx="104" cy="434" r="4" fill="#222"/><circle cx="128" cy="434" r="4" fill="#222"/></g></g>`;
    return s + '</svg>';
  }
  function lobby() {
    S.phase = 'hotel'; S.lay.stage = 'lobby'; save();
    screen(lobbySVG() + '<div class="obub" id="obub"></div>' + hud() + '<div class="obar" id="obar"></div>');
    const D = DESK[S.lay.city][0];
    const st = S.lay.lob;
    if (st === 0) {
      if (!S.lay.arrived) { S.lay.arrived = true; save(); requestAnimationFrame(() => requestAnimationFrame(() => moveMe(250, 1600))); }
      bar(`You arrive at ${esc(C().hotel)} with the crew. Ring the bell at the front desk.`, [{ a: 'bell', t: 'Ring the bell', main: 1 }]);
    } else if (st === 1) {
      bubble(D, `${C().hi} Welcome to ${esc(C().hotel)}. May I see your crew ID, please?`);
      bar('', api.has('crewid') ? [{ a: 'id', t: 'Hand over crew ID', main: 1 }] : [{ a: 'noid', t: 'Search your bag…', main: 1 }]);
    } else if (st === 2) {
      bubble(D, `Thank you, ${esc(S.name)}! Which room would you like tonight?`);
      bar('Pick a room', [{ a: 'room', v: 'view', t: 'High floor, city view', s: '+5 energy' }, { a: 'room', v: 'quiet', t: 'Quiet corner room', s: 'better sleep' }, { a: 'room', v: 'pool', t: 'Near the pool', s: 'bigger pool boost' }]);
    } else if (st === 3) {
      bubble(D, 'Shall I book a wake-up call for your crew pick-up? Just tap the phone.');
      bar('', [{ a: 'wake', t: 'Book a wake-up call', main: 1 }, { a: 'nowake', t: 'I’ll set my own alarm' }]);
    } else {
      bubble(D, `Here’s your key card for room ${S.lay.roomNo}. Enjoy ${C().city}!`);
      bar('', [{ a: 'lift', t: 'Take the lift', main: 1 }]);
    }
  }
  function flyCard(fromPlayer, cb) {
    const c = $('#card'); if (!c) return cb && cb();
    c.style.transition = 'none'; c.style.opacity = 1; c.style.transform = fromPlayer ? 'translate(0px,0px)' : 'translate(250px,-20px)';
    requestAnimationFrame(() => requestAnimationFrame(() => { c.style.transition = 'transform .8s ease,opacity .3s'; c.style.transform = fromPlayer ? 'translate(250px,-20px)' : 'translate(0px,0px)'; }));
    setTimeout(() => { c.style.opacity = 0; cb && cb(); }, 950);
  }

  /* ---------- hotel room ---------- */
  function cityBack(code, x, y, sc, col) {
    const f = `fill="${col}"`;
    let g = '';
    if (code === 'KUL') g = `<path ${f} d="M-30 0V-200l8-16 8 16V0zM-36-160h28V0h-28zM14 0V-200l8-16 8 16V0zM8-160h28V0H8zM-8-120h16v6h-16z"/><path d="M-22-216v-24M22-216v-24" stroke="${col}" stroke-width="3"/>`;
    if (code === 'BKK') g = `<path ${f} d="M0-220l10 60h-20zM-40 0l40-150 40 150zM-90 0l24-80 24 80zM42 0l24-80 24 80zM-100-10h200V0h-200z"/>`;
    if (code === 'HND') g = `<path ${f} d="M-150 0L0-170L150 0Z" opacity=".55"/><path ${f} d="M60 0V-90h-8v-6h40v6h-8V0zM46-100h52l-4-8H50zM50-60h44v-5H50z"/>`;
    if (code === 'LHR') g = `<path ${f} d="M-20 0V-180h40V0zM-26-180L0-230L26-180z"/><circle cx="0" cy="-150" r="12" fill="#f4ead2" opacity="${col === '#ffffff' ? 0 : .9}"/><path ${f} d="M40-20h160V0H40z"/>`;
    if (code === 'JFK') g = `<path ${f} d="M-80 0V-130h30V0zM-44 0V-220h34V0zM-10 0V-160h30V0zM26 0V-250h36V0zM68 0V-120h30V0z"/><path d="M44-250v-30" stroke="${col}" stroke-width="3"/>`;
    return `<g transform="translate(${x} ${y}) scale(${sc})">${g}</g>`;
  }
  function roomSVG(noHot) {
    const [t, b] = skyCols(), n = night();
    let s = '<svg class="world" viewBox="0 0 800 540" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">';
    s += `<defs><linearGradient id="rs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t}"/><stop offset="1" stop-color="${b}"/></linearGradient><clipPath id="wc"><rect x="196" y="70" width="248" height="200"/></clipPath></defs>`;
    s += '<rect y="-700" width="800" height="1150" fill="#ecdfcc"/><rect y="0" width="800" height="18" fill="#dccbb2"/><rect y="340" width="800" height="700" fill="#b98f6a"/><path d="M0 420h800M0 490h800" stroke="#a8805c" stroke-width="1.5"/><path d="M0 340h800" stroke="#9c7552" stroke-width="3"/>';
    // window with city
    s += `<rect x="196" y="70" width="248" height="200" fill="url(#rs)"/><g clip-path="url(#wc)">${n ? [[220, 90], [300, 110], [400, 86], [250, 140], [420, 130]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#fff"/>`).join('') : `<circle cx="400" cy="110" r="16" fill="#fff4c9" opacity=".9"/>`}${cityBack(S.lay.city, 320, 270, 0.6, n ? '#1b2238' : '#5d6b85')}<g fill="${n ? '#1b2238' : '#7d8ba3'}">${[[196, 200, 40], [236, 220, 30], [400, 210, 44]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${270 - y}"/>`).join('')}</g>${n ? '<g fill="#ffd36b">' + [[204, 214], [214, 230], [244, 232], [410, 222], [424, 238]].map(([x, y]) => `<rect x="${x}" y="${y}" width="4" height="4"/>`).join('') + '</g>' : ''}</g>`;
    s += '<rect x="196" y="70" width="248" height="200" fill="none" stroke="#fff" stroke-width="10"/><path d="M320 70v200" stroke="#fff" stroke-width="6"/><path d="M176 56q14 120 2 230h28q-8-110-4-230z M464 56q-14 120-2 230h-28q8-110 4-230z" fill="#7a5c8a"/><rect x="170" y="50" width="300" height="8" rx="4" fill="#8a6a50"/>';
    s += hot('window', 320, 170, 24, 'Look out of the window');
    // door
    s += '<rect x="20" y="110" width="90" height="230" fill="#8a6a50"/><rect x="28" y="118" width="74" height="222" fill="#a07c5c"/><circle cx="92" cy="232" r="5" fill="#e3b04b"/><rect x="40" y="140" width="50" height="16" rx="2" fill="#f4ead2"/>' + hot('door', 65, 200, 26, 'Go out and explore');
    // suitcase on rack
    s += '<rect x="122" y="310" width="78" height="8" fill="#5c3e2a"/><path d="M128 318v24M194 318v24" stroke="#5c3e2a" stroke-width="5"/><rect x="128" y="262" width="66" height="48" rx="6" fill="#1f3b52"/><rect x="146" y="252" width="30" height="12" rx="4" fill="none" stroke="#2b2f36" stroke-width="4"/>' + hot('case', 161, 286, 22, 'Change clothes');
    // nightstand + lamp + phone
    s += '<rect x="470" y="286" width="56" height="56" fill="#8a6a50"/><rect x="490" y="246" width="6" height="40" fill="#c9a14a"/><path d="M472 216h44l-8 30h-28z" fill="#f4e3c4"/>' + (n ? '<circle cx="493" cy="236" r="40" fill="#ffe7a8" opacity=".25"/>' : '') + '<rect x="502" y="274" width="20" height="10" rx="2" fill="#2a2a2a"/>' + hot('phone', 512, 272, 18, 'Room service');
    // bed
    s += '<rect x="540" y="180" width="246" height="100" rx="8" fill="#5c3e2a"/><rect x="532" y="276" width="262" height="70" rx="8" fill="#f8f5ef"/><rect x="532" y="300" width="262" height="46" rx="6" fill="#1f6f8b"/><path d="M532 312h262" stroke="#e3b04b" stroke-width="3"/><rect x="556" y="248" width="96" height="36" rx="14" fill="#fff"/><rect x="666" y="248" width="96" height="36" rx="14" fill="#fff"/>';
    if (S.lay.rs) s += '<g><ellipse cx="700" cy="296" rx="40" ry="10" fill="#cfd8de"/><ellipse cx="690" cy="290" rx="16" ry="6" fill="#e6a23c"/><rect x="714" y="278" width="10" height="16" rx="3" fill="#f2d16b" opacity=".85"/></g>';
    s += hot('bed', 660, 300, 26, 'Bed');
    s += `<g id="me" data-x="300" style="transform:translate(300px,0)"><g class="flipg">${nest(fullMe(), 0, 196, 100)}</g></g>`;
    if (noHot) s = s.replace(/<g class="hot"[\s\S]*?<\/g>/g, '');
    s += '<rect id="dim" y="-700" width="800" height="1800" fill="#060a1c" opacity="0" style="transition:opacity 1s;pointer-events:none"/>';
    return s + '</svg>';
  }
  function room(msg) {
    S.phase = 'layover'; S.lay.stage = 'room'; save();
    screen(roomSVG() + '<div class="obub" id="obub"></div>' + hud() + '<div class="obar" id="obar"></div>');
    if (msg) bubble(msg[0], msg[1]);
    roomBar();
  }
  function roomBar() {
    const Y = S.lay, h = Y.hours;
    bar(h > 0 ? 'Tap things in the room, or pick an action.' : 'It’s late. Time to sleep before the pick-up.', [
      { a: 'case', t: Y.casual ? 'Back into uniform' : 'Change into a sundress' },
      { a: 'phone', t: 'Room service', s: '1 h · S$15', dis: Y.rs || h < 1 || S.money < 15 },
      { a: 'nap', t: 'Nap', s: '3 h', dis: h < 3 },
      { a: 'door', t: `Explore ${C().city}`, main: h > 0, dis: h <= 0 },
      { a: 'sleep', t: 'Sleep until pick-up', main: h <= 0 }
    ]);
  }
  const ROOM_X = { case: 150, phone: 430, bed: 560, door: 110, window: 270, nap: 560, sleep: 560 };
  function roomAct(a) {
    const Y = S.lay;
    moveMe(ROOM_X[a] - 50, 700);
    setTimeout(() => {
      if (a === 'case') { Y.casual = !Y.casual; save(); sfx('restock'); room(['', Y.casual ? 'Changed into a sundress. Ready to see the city!' : 'Back in uniform.']); }
      else if (a === 'phone') { if (Y.rs || Y.hours < 1 || S.money < 15) return; Y.rs = true; Y.hours -= 1; S.money -= 15; S.energy = clamp(S.energy + 8, 0, 100); save(); sfx('ding'); room(['Room service', 'A bowl of laksa and an iced lemon tea, on its way! (+8 energy)']); }
      else if (a === 'window') bubble('', night() ? `${C().city} glitters below. The streets are still busy.` : `Sunshine over ${C().city}. Perfect weather for exploring.`);
      else if (a === 'bed') bar('The bed looks very inviting.', [{ a: 'nap', t: 'Nap', s: '3 h', dis: Y.hours < 3 }, { a: 'sleep', t: 'Sleep until pick-up', main: 1 }, { a: 'back', t: 'Not yet' }]);
      else if (a === 'nap') { if (Y.hours < 3) return; dimThen(() => { Y.hours -= 3; S.energy = clamp(S.energy + Math.round(15 * (Y.room === 'quiet' ? 1.3 : 1)), 0, 100); save(); room(['', 'A lovely nap. You feel refreshed.']); }); }
      else if (a === 'sleep') dimThen(finish, 1400);
      else if (a === 'door') { if (Y.hours <= 0) return; if (!Y.casual) { bubble(S.name, 'I should change out of my uniform first. Crew don’t wear it around town.'); return; } Y.px = SPOTS.hotel + 40; save(); street(); }
    }, 720);
  }
  function dimThen(cb, ms) { const d = $('#dim'); if (d) d.style.opacity = .92; bar('Zzz…', []); setTimeout(cb, ms || 1100); }

  /* ---------- street ---------- */
  let SW = { vw: 800, cam: 0, x: 300, dir: 1, tx: null, npcs: [] };
  function streetSVG() {
    const [t, b] = skyCols(), n = night(), code = S.lay.city, Cc = C();
    let s = `<svg class="world" id="wsvg" viewBox="0 0 800 450" preserveAspectRatio="xMinYMax slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
    s += `<rect x="-400" y="-900" width="${WORLD + 800}" height="902" fill="${t}"/><rect x="-400" width="${WORLD + 800}" height="450" fill="url(#ss)"/>`;
    if (n) s += '<g fill="#fff">' + Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 173) % WORLD}" cy="${20 + (i * 37) % 160}" r="${1 + (i % 3) * .4}"/>`).join('') + '</g><circle cx="1800" cy="70" r="22" fill="#f6f1d9"/>';
    else s += `<circle cx="600" cy="80" r="26" fill="#fff4c9" opacity="${1 - frac()}"/>`;
    const far = lerp(b, '#2a3350', 0.45), mid = n ? '#2b3350' : '#8d98ad';
    s += `<g fill="${far}">` + Array.from({ length: 30 }, (_, i) => `<rect x="${i * 90 - 40}" y="${200 + (i * 53) % 80}" width="70" height="${200}"/>`).join('') + '</g>';
    s += cityBack(code, 960, 360, 1.1, n ? '#1c2238' : lerp(far, '#3b4660', 0.5));
    // mid buildings
    const bl = [[480, 150, 130], [620, 210, 90], [1180, 170, 120], [1320, 220, 100], [1640, 160, 140], [1800, 200, 110], [2280, 170, 130], [2420, 210, 140]];
    s += bl.map(([x, y, w], i) => `<rect x="${x}" y="${y}" width="${w}" height="${380 - y}" fill="${mid}"/>` + Array.from({ length: Math.floor((380 - y) / 34) }, (_, r) => Array.from({ length: Math.floor(w / 30) }, (_, c) => `<rect x="${x + 10 + c * 30}" y="${y + 14 + r * 34}" width="14" height="16" fill="${n ? ((r + c + i) % 3 ? '#ffd36b' : '#3a4466') : '#b9c6d6'}"/>`).join('')).join('')).join('');
    // hotel
    s += `<rect x="110" y="90" width="320" height="290" fill="${n ? '#4a3f3a' : '#d9c3a3'}"/>` + Array.from({ length: 6 }, (_, r) => Array.from({ length: 7 }, (_, c) => `<rect x="${126 + c * 42}" y="${104 + r * 30}" width="26" height="18" fill="${n ? ((r + c) % 2 ? '#ffd36b' : '#3a3550') : '#a9c4dc'}"/>`).join('')).join('');
    s += `<rect x="150" y="290" width="240" height="20" fill="#2b2f45"/><text x="270" y="305" fill="#e3c27a" font-size="13" font-family="Sora,sans-serif" text-anchor="middle" font-weight="700">${esc(Cc.hotel)}</text><path d="M200 310h140l14 18H186z" fill="#a8326e"/><rect x="226" y="328" width="88" height="52" fill="#9fb3c0"/><path d="M270 328v52" stroke="#5d6b78" stroke-width="3"/>`;
    // spot 1: photo point
    s += `<g><rect x="${SPOTS.s1 - 4}" y="300" width="8" height="80" fill="#5d4637"/><rect x="${SPOTS.s1 - 46}" y="282" width="92" height="34" rx="6" fill="#fff8e8" stroke="#5d4637" stroke-width="3"/><text x="${SPOTS.s1}" y="304" font-size="12" font-family="Sora,sans-serif" text-anchor="middle" font-weight="700" fill="#2a3540">Photo spot</text><ellipse cx="${SPOTS.s1}" cy="420" rx="40" ry="8" fill="#a8326e" opacity=".35"/></g>`;
    // spot 2: food/show
    s += stall(DISH[code], SPOTS.s2, n);
    // shop
    s += `<rect x="${SPOTS.shop - 120}" y="200" width="240" height="180" fill="${n ? '#3f2f3f' : '#f2d6e2'}"/><path d="M${SPOTS.shop - 130} 236h260l-14 26H${SPOTS.shop - 116}z" fill="#a8326e"/><path d="M${SPOTS.shop - 116} 262${Array.from({ length: 9 }, (_, i) => `q${13} 14 ${26} 0`).join('')}" fill="#d16a9f"/><text x="${SPOTS.shop}" y="228" font-size="15" font-family="Sora,sans-serif" text-anchor="middle" font-weight="800" fill="${n ? '#ffd9ec' : '#6b1f45'}">${esc(Cc.shop.n)}</text><rect x="${SPOTS.shop - 96}" y="280" width="120" height="80" fill="#fff" opacity=".85"/>` + ['#b3132f', '#e98fa6', '#8e2347', '#ef6a5b'].map((c, i) => `<rect x="${SPOTS.shop - 86 + i * 28}" y="318" width="12" height="30" rx="3" fill="${c}"/><rect x="${SPOTS.shop - 86 + i * 28}" y="340" width="12" height="10" fill="#c9a14a"/>`).join('') + `<rect x="${SPOTS.shop + 40}" y="290" width="54" height="90" fill="#9fb3c0"/>`;
    // trees + lamps
    for (let x = 510; x < WORLD; x += 300) s += `<rect x="${x - 4}" y="330" width="8" height="54" fill="#5d4637"/><circle cx="${x}" cy="318" r="28" fill="${n ? '#1f3a2c' : '#4f8a4a'}"/><circle cx="${x - 16}" cy="332" r="18" fill="${n ? '#1f3a2c' : '#5ea055'}"/>`;
    for (let x = 660; x < WORLD; x += 300) s += `<rect x="${x - 3}" y="250" width="6" height="134" fill="#2b2f36"/><path d="M${x} 250q14 0 18 10" stroke="#2b2f36" stroke-width="4" fill="none"/><circle cx="${x + 18}" cy="264" r="6" fill="${n ? '#ffe7a8' : '#ddd'}"/>${n ? `<circle cx="${x + 18}" cy="264" r="40" fill="#ffe7a8" opacity=".18"/>` : ''}`;
    // pavement + road
    s += `<rect x="-400" y="380" width="${WORLD + 800}" height="52" fill="${n ? '#6d6a66' : '#d7cdbd'}"/><path d="M-400 380H${WORLD + 400}" stroke="${n ? '#55524e' : '#b8ad9a'}" stroke-width="3"/>` + Array.from({ length: 60 }, (_, i) => `<path d="M${i * 50 - 400} 380l-12 52" stroke="${n ? '#5f5c58' : '#c7bca9'}" stroke-width="1.5"/>`).join('');
    s += `<rect x="-400" y="432" width="${WORLD + 800}" height="500" fill="#3a3a3e"/><path d="M-400 486H${WORLD + 400}" stroke="#e8e2d0" stroke-width="4" stroke-dasharray="40 40"/>`;
    // people
    s += SW.npcs.map((p, i) => `<g class="npc walking" id="npc${i}"><g class="flipg">${nest(p.svg, 4, 252, 72)}</g></g>`).join('');
    s += `<g id="me"><path d="M34 214l8 10 8-10z" fill="#a8326e" stroke="#fff" stroke-width="2"/><g class="flipg">${nest(fullMe(), 0, 228, 84)}</g></g>`;
    return s + '</svg>';
  }
  function stall(kind, x, n) {
    const awn = { noodles: '#c9302c', mango: '#f2a71b', ramen: '#2b2f45', tea: '#5b8e7d', show: '#3a2350' }[kind];
    let s = `<rect x="${x - 110}" y="230" width="220" height="150" fill="${n ? '#3a2e2a' : '#efe0c8'}"/><path d="M${x - 124} 230h248l-12 34H${x - 112}z" fill="${awn}"/>`;
    if (kind === 'noodles' || kind === 'ramen') s += Array.from({ length: 5 }, (_, i) => `<rect x="${x - 96 + i * 44}" y="270" width="18" height="24" rx="8" fill="${kind === 'ramen' ? '#f4e3c4' : '#ff5a3c'}"/>`).join('') + `<rect x="${x - 90}" y="320" width="180" height="60" fill="#7a4a2a"/><ellipse cx="${x - 30}" cy="318" rx="20" ry="6" fill="#fff"/><path d="M${x - 40} 300q4-10 0-18M${x - 26} 300q4-10 0-18" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/>`;
    if (kind === 'ramen') s += `<rect x="${x - 70}" y="264" width="140" height="44" fill="#f4e3c4"/><path d="M${x - 35} 264v44M${x} 264v44M${x + 35} 264v44" stroke="#2b2f45" stroke-width="2"/>`;
    if (kind === 'mango') s += `<rect x="${x - 90}" y="310" width="180" height="70" fill="#7a4a2a"/>` + [[-60, '#ffb347'], [-30, '#ffd23f'], [0, '#ffb347'], [30, '#7cb342'], [60, '#ffd23f']].map(([d, c]) => `<circle cx="${x + d}" cy="304" r="12" fill="${c}"/>`).join('');
    if (kind === 'tea') s += `<rect x="${x - 70}" y="276" width="140" height="70" fill="#cfe0e8"/><path d="M${x} 276v70M${x - 70} 311h140" stroke="#fff" stroke-width="4"/><text x="${x}" y="254" font-size="13" font-family="Sora,sans-serif" text-anchor="middle" font-weight="700" fill="#fff">Tea Room</text>`;
    if (kind === 'show') s += `<rect x="${x - 90}" y="264" width="180" height="40" fill="#3a2350" stroke="#ffd36b" stroke-width="3"/>` + Array.from({ length: 12 }, (_, i) => `<circle cx="${x - 84 + i * 15}" cy="268" r="2.4" fill="#ffd36b"/>`).join('') + `<text x="${x}" y="292" font-size="13" font-family="Sora,sans-serif" text-anchor="middle" font-weight="800" fill="#ffd9ec">TONIGHT</text><rect x="${x - 40}" y="320" width="80" height="60" fill="#7a2a3a"/>`;
    return s;
  }
  function street() {
    S.phase = 'layover'; S.lay.stage = 'street'; save();
    if (!SW.npcs.length || SW.city !== S.lay.city) {
      SW.city = S.lay.city;
      const cols = ['#ef476f', '#2e86ab', '#06a77d', '#f78764', '#9b5de5'];
      SW.npcs = [0, 1, 2, 3].map(i => ({ x: 500 + i * 520, v: (i % 2 ? -1 : 1) * (28 + i * 6), svg: SF.avatarFull({ skin: (i * 2 + 1) % 6, hairC: i % 5, look: { found: null, hair: ['loose', 'pony', 'bun', 'chignon'][i], shadow: 'none', blush: 'none', lips: ['nude', 'none', 'coral', 'none'][i], acc: 'none', ear: 'none' }, outfit: i === 3 ? 'hotel' : 'casual', dress: cols[i] }) }));
    }
    SW.x = S.lay.px || SPOTS.hotel + 40; SW.tx = null;
    screen(streetSVG() + '<div class="obub" id="obub"></div>' + hud() + '<div class="obar" id="obar"></div>');
    if (S.lay.hours <= 0) bubble(S.name, 'It’s getting really late. Back to the hotel for some sleep!');
    else if (!S.lay.toldWalk) { S.lay.toldWalk = true; bubble('', 'Walk with ◀ ▶ (or the arrow keys), or tap the pavement. Stop at a spot to do something.'); }
    $('#wsvg').addEventListener('pointerdown', e => { if (e.target.closest('.hot')) return; const r = e.currentTarget.getBoundingClientRect(); const sc = (SW.vh || 540) / r.height; SW.tx = clamp(SW.cam + (e.clientX - r.left) * sc, 60, WORLD - 60); });
    SW.near = undefined;
    startLoop();
  }
  function nearSpot() {
    let best = null, d = 1e9;
    for (const [k, x] of Object.entries(SPOTS)) { const dd = Math.abs(SW.x - x); if (dd < 110 && dd < d) { d = dd; best = k; } }
    return best;
  }
  function streetBar() {
    const k = nearSpot(); if (k === SW.near) return; SW.near = k;
    const Y = S.lay, Cc = C(), h = Y.hours;
    const walk = [{ a: 'wl', t: '◀', cls: 'walkbtn', label: 'Walk left' }, { a: 'wr', t: '▶', cls: 'walkbtn', label: 'Walk right' }];
    let p = h > 0 ? `Explore ${Cc.city}. Walk to the photo spot, the ${DISH[Y.city] === 'show' ? 'theatre' : 'food stall'} or the shop.` : 'It’s late. Head back to the hotel (far left).', b = [];
    if (k === 'hotel') { p = esc(Cc.hotel); b = [{ a: 'enter', t: 'Back to my room', main: 1 }]; }
    if (k === 's1' || k === 's2') {
      const sp = Cc.spots[k === 's1' ? 0 : 1], done = Y.done.includes(sp.id);
      const verb = k === 's1' ? 'Take a photo' : DISH[Y.city] === 'show' ? 'Watch the show' : 'Eat here';
      p = `<b>${sp.n}</b> · ${sp.h} h · ${sp.cost ? 'S$' + sp.cost : 'free'} · energy ${sp.e}${done ? ' · done today' : S.stamps.includes(sp.id) ? '' : ' · new postcard!'}`;
      b = [{ a: k === 's1' ? 'photo' : 'food', t: verb, main: 1, dis: done || h < sp.h || S.money < sp.cost || S.energy + sp.e < 0 }];
    }
    if (k === 'shop') { p = `<b>${esc(Cc.shop.n)}</b> · makeup and accessories`; b = [{ a: 'shop', t: 'Browse the shop', main: 1, dis: !Y.shop && h < 1, s: Y.shop ? '' : '1 h' }]; }
    bar(p, walk.concat(b));
    bindHold();
  }
  function bindHold() {
    [['wl', 'l'], ['wr', 'r']].forEach(([a, k]) => { const el = document.querySelector(`#obar [data-o="${a}"]`); if (!el) return; const on = e => { e.preventDefault(); keys[k] = true; SW.tx = null; }, off = () => keys[k] = false; el.addEventListener('pointerdown', on); el.addEventListener('pointerup', off); el.addEventListener('pointerleave', off); el.addEventListener('pointercancel', off); });
  }
  function startLoop() {
    stopLoop(); let last = performance.now();
    const step = now => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const svg = $('#wsvg'); if (!svg) { loop = null; return; }
      const r = svg.getBoundingClientRect(); const vh = Math.max(540, 430 * r.height / r.width); SW.vh = vh; SW.vw = r.width / r.height * vh;
      let v = 0; const sp = 210 * (0.8 + 0.4 * S.energy / 100);
      if (keys.l) v = -sp; else if (keys.r) v = sp; else if (SW.tx != null) { const d = SW.tx - SW.x; if (Math.abs(d) < 6) SW.tx = null; else v = Math.sign(d) * sp; }
      SW.x = clamp(SW.x + v * dt, 60, WORLD - 60); if (v) SW.dir = v < 0 ? -1 : 1;
      SW.cam = clamp(SW.x - SW.vw / 2, 0, Math.max(0, WORLD - SW.vw));
      SW.y0 = vh > 540 ? 540 - vh * 0.86 : 0; svg.setAttribute('viewBox', `${SW.cam.toFixed(1)} ${SW.y0.toFixed(1)} ${SW.vw.toFixed(1)} ${vh.toFixed(1)}`);
      const m = $('#me'); m.setAttribute('transform', `translate(${(SW.x - 42).toFixed(1)} 0)`); m.classList.toggle('walking', !!v); m.classList.toggle('face-l', SW.dir < 0);
      SW.npcs.forEach((p, i) => { p.x += p.v * dt; if (p.x < 380 || p.x > WORLD - 100) p.v *= -1; const g = $('#npc' + i); if (g) { g.setAttribute('transform', `translate(${(p.x - 40).toFixed(1)} 0)`); g.classList.toggle('face-l', p.v < 0); } });
      streetBar();
      loop = requestAnimationFrame(step);
    };
    loop = requestAnimationFrame(step);
  }
  function stopLoop() { if (loop) cancelAnimationFrame(loop); loop = null; keys.l = keys.r = false; }
  addEventListener('keydown', e => { if (!$('#wsvg') || $('.ogame')) return; const k = e.key.toLowerCase(); if (k === 'arrowleft' || k === 'a') { keys.l = true; SW.tx = null; e.preventDefault(); } if (k === 'arrowright' || k === 'd') { keys.r = true; SW.tx = null; e.preventDefault(); } if (k === 'enter' || k === ' ') { const b = document.querySelector('#obar .obtn.main:not(:disabled)'); if (b) { e.preventDefault(); b.click(); } } });
  addEventListener('keyup', e => { const k = e.key.toLowerCase(); if (k === 'arrowleft' || k === 'a') keys.l = false; if (k === 'arrowright' || k === 'd') keys.r = false; });

  /* ---------- mini-games ---------- */
  function overlay(html) { const o = document.createElement('div'); o.className = 'ogame'; o.innerHTML = html; $('#osc').appendChild(o); keys.l = keys.r = false; return o; }
  function reward(sp, extra) {
    const Y = S.lay; Y.hours -= sp.h; S.money -= sp.cost; S.energy = clamp(S.energy + sp.e, 0, 100); Y.done.push(sp.id);
    const isNew = !S.stamps.includes(sp.id); if (isNew) S.stamps.push(sp.id); save();
    return isNew;
  }
  function resultCard(o, sp, isNew, head, stars) {
    o.innerHTML = `<div class="pol">${SF.postcard(sp.id)}<p><b>${head}</b><br>${sp.t}</p>${stars ? `<p>${'★'.repeat(stars)}${'☆'.repeat(3 - stars)} photo</p>` : ''}</div>
      <div class="res" style="margin-top:18px">${isNew ? `<b>New postcard for your scrapbook!</b> (${S.stamps.length}/10)<br>` : ''}−${sp.h} h${sp.cost ? ' · −S$' + sp.cost : ''} · energy ${sp.e}<div class="row-btns" style="margin-top:12px"><button class="cta" data-o="closegame">Keep exploring</button></div></div>`;
    sfx('win');
  }
  function photo() {
    const sp = C().spots[0];
    const o = overlay(`<div class="cam"><div class="camv">${SF.postcard(sp.id)}</div><div class="vf" id="vf"></div><div class="flash" id="flash"></div></div><div class="obar" style="position:static;background:none;justify-content:center;margin-top:14px"><div class="pr" style="text-align:center">Line the frame up with ${esc(sp.n.toLowerCase())}, then snap!</div><button class="obtn main" data-o="snap">Snap</button><button class="obtn" data-o="closegame">Cancel</button></div>`);
    let t = 0, last = performance.now(), live = true; o._pos = [50, 45];
    const tick = now => { if (!live || !document.body.contains(o)) return; t += (now - last) / 1000; last = now; const x = 50 + Math.sin(t * 1.6) * 26, y = 46 + Math.sin(t * 2.3 + 1) * 18; o._pos = [x, y]; const vf = $('#vf'); if (vf) { vf.style.left = x + '%'; vf.style.top = y + '%'; } requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    o._snap = () => {
      if (!live) return; live = false;
      const [x, y] = o._pos, d = Math.hypot((x - 50) / 26, (y - 46) / 18);
      const stars = d < 0.22 ? 3 : d < 0.55 ? 2 : 1;
      const f = $('#flash'); f.classList.add('on'); sfx('restock');
      setTimeout(() => { f.classList.remove('on'); const isNew = reward(sp); setTimeout(() => resultCard(o, sp, isNew, ['', 'Nice shot!', 'Great shot!', 'Perfect shot!'][stars], stars), 350); }, 120);
    };
  }
  function dishSVG(kind) {
    let base = '<svg class="dish" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" rx="20" fill="#8a5a3a"/><path d="M0 60h400M0 140h400M0 220h400" stroke="#7a4a2a" stroke-width="3"/>';
    const bites = [];
    if (kind === 'show') {
      base = '<svg class="dish" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" rx="20" fill="#120c24"/><rect x="20" y="40" width="360" height="220" fill="#2a1640"/><ellipse cx="200" cy="250" rx="160" ry="20" fill="#ffd36b" opacity=".25"/>';
      base += '<g fill="#0c0818"><circle cx="140" cy="150" r="14"/><path d="M126 166h28l8 70h-44z"/><circle cx="200" cy="140" r="15"/><path d="M185 157h30l10 80h-50z"/><circle cx="260" cy="150" r="14"/><path d="M246 166h28l8 70h-44z"/></g><path d="M200 0L120 260h160z" fill="#fff" opacity=".08"/>';
      base += '<rect id="cl" x="20" y="40" width="180" height="220" fill="#b0283a" style="transition:transform 1.2s ease;transform-box:fill-box;transform-origin:left"/><rect id="cr" x="200" y="40" width="180" height="220" fill="#9c2033" style="transition:transform 1.2s ease;transform-box:fill-box;transform-origin:right"/><rect x="10" y="26" width="380" height="20" fill="#e3b04b"/>';
      return base + '</svg>';
    }
    base += '<ellipse cx="200" cy="160" rx="150" ry="92" fill="#fff"/><ellipse cx="200" cy="160" rx="118" ry="70" fill="none" stroke="#e2e6ea" stroke-width="3"/>';
    if (kind === 'noodles') { base += '<ellipse cx="200" cy="156" rx="100" ry="54" fill="#8a5a2a"/>'; bites.push(...[[150, 150], [210, 140], [240, 175]].map(([x, y]) => `<g><ellipse cx="${x}" cy="${y}" rx="38" ry="22" fill="#c9853a"/><path d="M${x - 28} ${y - 4}q14-10 28 0t28 0M${x - 26} ${y + 6}q14-10 28 0t26 0" stroke="#e8b36a" stroke-width="3" fill="none"/><circle cx="${x + 10}" cy="${y - 8}" r="5" fill="#e4572e"/><circle cx="${x - 12}" cy="${y + 2}" r="4" fill="#7cb342"/></g>`)); }
    if (kind === 'mango') { base += '<ellipse cx="200" cy="160" rx="96" ry="54" fill="#f6eedc"/>'; bites.push(...[[160, 150], [220, 140], [230, 180]].map(([x, y]) => `<g><path d="M${x - 34} ${y}q34-30 68 0q-34 22-68 0z" fill="#ffc22e"/><path d="M${x - 20} ${y}q20-12 40 0" stroke="#f2a71b" stroke-width="3" fill="none"/><ellipse cx="${x}" cy="${y + 16}" rx="26" ry="9" fill="#fffaf0"/></g>`)); }
    if (kind === 'ramen') { base = base.replace('<ellipse cx="200" cy="160" rx="150" ry="92" fill="#fff"/>', '<ellipse cx="200" cy="160" rx="150" ry="92" fill="#2b2b2b"/>') + '<ellipse cx="200" cy="156" rx="118" ry="66" fill="#e8b46a"/>'; bites.push(`<g><circle cx="150" cy="150" r="24" fill="#fff6e0"/><circle cx="150" cy="150" r="11" fill="#f2b632"/></g>`, `<g><rect x="196" y="120" width="56" height="34" rx="8" fill="#b86a4a"/><path d="M204 130h40" stroke="#8a4a32" stroke-width="3"/></g>`, `<g><path d="M150 186q20-14 40 0t40 0t40 0" stroke="#fff3c4" stroke-width="7" fill="none"/><path d="M160 196q20-14 40 0t40 0" stroke="#fff3c4" stroke-width="7" fill="none"/><circle cx="250" cy="176" r="8" fill="#5aa84f"/></g>`); }
    if (kind === 'tea') { bites.push(...[[150, 150], [210, 170], [250, 140]].map(([x, y]) => `<g><path d="M${x - 26} ${y + 10}q-4-30 26-30t26 30z" fill="#d9b48f"/><ellipse cx="${x}" cy="${y - 4}" rx="20" ry="6" fill="#fffaf0"/><circle cx="${x}" cy="${y - 10}" r="6" fill="#c9302c"/></g>`)); }
    return base + bites.map((b, i) => `<g id="b${i}" style="transition:opacity .25s">${b}</g>`).join('') + '</svg>';
  }
  function food() {
    const sp = C().spots[1], kind = DISH[S.lay.city], show = kind === 'show';
    const need = show ? 5 : 3;
    const o = overlay(`<div style="position:relative;width:min(520px,100%)">${dishSVG(kind)}</div><div class="obar" style="position:static;background:none;justify-content:center;margin-top:14px"><div class="pr" style="text-align:center" id="fpr">${show ? 'The lights go down… tap the stage to applaud! (0/5)' : 'Tap the dish to take a bite (0/3)'}</div><button class="obtn" data-o="closegame">Leave</button></div>`);
    if (show) setTimeout(() => { const l = $('#cl'), r = $('#cr'); if (l) { l.style.transform = 'scaleX(.08)'; r.style.transform = 'scaleX(.08)'; } }, 400);
    let n = 0;
    o.querySelector('.dish').addEventListener('click', e => {
      if (n >= need) return; n++;
      if (!show) { const b = $('#b' + (n - 1)); if (b) b.style.opacity = 0; }
      const y = document.createElement('div'); y.className = 'yum'; y.textContent = show ? pickOne(['Bravo!', 'Clap clap!', 'Encore!', 'Wow!']) : pickOne(['Mmm!', 'So good!', 'Yum!', 'Shiok!']);
      const r = o.querySelector('.dish').getBoundingClientRect(), pr = o.querySelector('.dish').parentNode.getBoundingClientRect();
      y.style.left = (e.clientX - pr.left - 20) + 'px'; y.style.top = (e.clientY - pr.top - 20) + 'px'; o.querySelector('.dish').parentNode.appendChild(y); setTimeout(() => y.remove(), 1000);
      sfx('ding');
      const fp = $('#fpr'); if (fp) fp.textContent = show ? `Tap the stage to applaud! (${n}/5)` : `Tap the dish to take a bite (${n}/3)`;
      if (n >= need) setTimeout(() => { const isNew = reward(sp); resultCard(o, sp, isNew, show ? 'What a show!' : 'Delicious!', 0); }, 700);
    });
  }
  const pickOne = a => a[Math.floor(Math.random() * a.length)];
  function prodSVG(id) {
    const it = SF.SHOP[id];
    const lipC = { berry: '#8e2347', neon: '#a6f03a', sakura: '#e98fa6' }[id];
    if (it.kind === 'lips') return `<svg viewBox="0 0 80 80"><rect x="30" y="38" width="20" height="34" rx="3" fill="#2b2f36"/><rect x="30" y="34" width="20" height="8" fill="#c9a14a"/><path d="M32 34V18l16-8v24z" fill="${lipC}"/></svg>`;
    if (it.kind === 'shadow') return `<svg viewBox="0 0 80 80"><rect x="12" y="22" width="56" height="36" rx="6" fill="#2b2f36"/><circle cx="30" cy="40" r="11" fill="${id === 'gold' ? '#d4a73c' : '#3a7bff'}"/><circle cx="52" cy="40" r="11" fill="${id === 'gold' ? '#e8cfa0' : '#9bc2ff'}"/>${id === 'glitter' ? '<circle cx="28" cy="36" r="1.5" fill="#fff"/><circle cx="54" cy="42" r="1.5" fill="#fff"/>' : ''}</svg>`;
    if (id === 'orchid') return `<svg viewBox="0 0 80 80"><g transform="translate(40 40)">${[0, 72, 144, 216, 288].map((a, i) => `<ellipse rx="9" ry="16" cy="-12" fill="${i % 2 ? '#d16a9f' : '#a8326e'}" transform="rotate(${a})"/>`).join('')}<circle r="6" fill="#e3b04b"/></g></svg>`;
    if (id === 'bow') return `<svg viewBox="0 0 80 80"><path d="M40 40L8 18Q2 40 8 62ZM40 40L72 18Q78 40 72 62Z" fill="#ff4d6d"/><circle cx="40" cy="40" r="8" fill="#e0304f"/></svg>`;
    if (id === 'pearlclip') return `<svg viewBox="0 0 80 80"><rect x="10" y="44" width="60" height="6" rx="3" fill="#c9a14a"/>${[0, 1, 2, 3, 4].map(i => `<circle cx="${16 + i * 12}" cy="40" r="6" fill="#fbf7ef" stroke="#cfc6b6"/>`).join('')}</svg>`;
    if (id === 'pearls') return `<svg viewBox="0 0 80 80"><circle cx="26" cy="44" r="10" fill="#fbf7ef" stroke="#cfc6b6" stroke-width="2"/><circle cx="54" cy="44" r="10" fill="#fbf7ef" stroke="#cfc6b6" stroke-width="2"/><path d="M26 34v-8M54 34v-8" stroke="#c9a14a" stroke-width="2"/></svg>`;
    if (id === 'hoops') return `<svg viewBox="0 0 80 80"><circle cx="24" cy="44" r="16" fill="none" stroke="#e3b04b" stroke-width="4"/><circle cx="56" cy="44" r="16" fill="none" stroke="#e3b04b" stroke-width="4"/></svg>`;
    return '';
  }
  function shop() {
    const Y = S.lay, Cc = C();
    if (!Y.shop) { Y.shop = true; Y.hours -= 1; save(); }
    const o = overlay('');
    const render = () => {
      o.innerHTML = `<div class="res" style="width:min(680px,100%)"><h2 style="margin:0 0 4px">${esc(Cc.shop.n)}</h2><p class="sub" style="margin:0 0 12px">You have S$${S.money}. Purchases appear at your vanity mirror. Not everything here is within the grooming guide!</p>
        <div class="shelf">${Cc.shop.items.map(id => { const it = SF.SHOP[id], own = S.owned.includes(id); return `<button class="prod" data-o="buy" data-v="${id}" ${own || S.money < it.p ? 'disabled' : ''}>${prodSVG(id)}${it.n}<span class="tag">${own ? 'Owned' : 'S$' + it.p}</span></button>`; }).join('')}</div>
        <div class="row-btns" style="margin-top:14px"><button class="cta" data-o="closegame">Done shopping</button></div></div>`;
    };
    o._render = render; render();
  }

  /* ---------- end of layover ---------- */
  function finish() {
    const Y = S.lay;
    if (!Y.final) {
      const gain = Math.round(Y.hours * 5 * (Y.room === 'quiet' ? 1.3 : 1)) + 20;
      S.energy = clamp(S.energy + gain, 0, 100);
      const late = !Y.wake && Math.random() < 0.35;
      if (late) S.energy = clamp(S.energy - 10, 0, 100);
      const L = Flight.LEVELS[Y.lvl];
      Y.final = { ret: 'SF ' + String(parseInt(L.code.slice(3), 10) + 1).padStart(3, '0'), gain, late };
      Y.hours = Math.round(C().hours * 0.92); Y.casual = false; save();
    }
    const { ret, gain, late } = Y.final;
    // morning scene
    screen(roomSVG(true) + '<div class="obub" id="obub"></div><div class="obar" id="obar"></div>');
    const d = $('#dim'); if (d) { d.style.transition = 'none'; d.style.opacity = .92; requestAnimationFrame(() => requestAnimationFrame(() => { d.style.transition = 'opacity 1.6s'; d.style.opacity = 0; })); }
    if (late) { bubble(S.name, 'Oh no, my alarm didn’t go off! The crew bus is leaving!'); sfx('buzz'); }
    else bubble(Y.wake ? 'Wake-up call' : S.name, Y.wake ? `Good morning, ${esc(S.name)}! Your crew pick-up is in 30 minutes.` : 'Alarm’s ringing. Rise and shine!');
    bar(`You slept well. (+${gain} energy${late ? ', −10 for the mad dash' : ''})`, [{ a: 'gohome', t: `Operate ${ret} home`, main: 1 }]);
  }
  function goHome() {
    const Y = S.lay, f = Y.final || { ret: '' };
    S.energy = clamp(S.energy - 15 + 30, 0, 100);
    S.day++; api.resetMorning(); S.phase = 'home'; S.lay = null; save();
    api.home();
    api.modal(`<h2>Home sweet home</h2><p>You operated <b>${f.ret}</b> back to Singapore, unpacked and had a good night in your own bed.</p><div class="rew" style="margin-bottom:14px"><div>Day ${S.day}</div><div>Energy ${Math.round(S.energy)}%</div><div>${S.stamps.length}/10 postcards</div></div><div class="row-btns"><button class="cta" data-l="close">Start a new day</button></div>`);
  }

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-o]'); if (!b || !$('#osc') || !$('#osc').contains(b)) return;
    try { Flight.ac(); } catch (x) { }
    const a = b.dataset.o, v = b.dataset.v, Y = S.lay, D = DESK[Y.city] && DESK[Y.city][0];
    // lobby
    if (a === 'bell' && Y.lob === 0) { sfx('ding'); Y.lob = 1; save(); lobby(); }
    else if (a === 'id' && Y.lob === 1) { flyCard(true, () => { Y.lob = 2; save(); lobby(); }); bar('', []); }
    else if (a === 'noid' && Y.lob === 1) { Y.hours -= 1; bubble(D, 'No problem, let me call your airline to confirm… (that took an hour)'); bar('', []); setTimeout(() => { Y.lob = 2; save(); lobby(); }, 1800); }
    else if (a === 'room' && Y.lob === 2) { Y.room = v; if (v === 'view') S.energy = clamp(S.energy + 5, 0, 100); Y.lob = 3; save(); lobby(); }
    else if ((a === 'wake' || a === 'nowake') && Y.lob === 3) { Y.wake = a === 'wake'; if (Y.wake) sfx('restock'); Y.roomNo = 1200 + Math.floor(Math.random() * 1500); Y.lob = 4; save(); lobby(); setTimeout(() => flyCard(false), 200); }
    else if (a === 'lift' && Y.lob === 4) { bar('', []); moveMe(80, 1100); setTimeout(() => { const l = $('#dl'), r = $('#dr'); if (l) { l.style.transform = 'scaleX(.05)'; r.style.transform = 'scaleX(.05)'; } }, 600); setTimeout(() => room(['', `Room ${Y.roomNo}. ${Y.room === 'view' ? 'What a view!' : Y.room === 'quiet' ? 'So peaceful.' : 'The pool is right downstairs.'}`]), 1700); }
    // room
    else if (['case', 'phone', 'bed', 'nap', 'sleep', 'door', 'window'].includes(a) && Y.stage === 'room') roomAct(a);
    else if (a === 'back') roomBar();
    // street
    else if (a === 'enter') { Y.px = SW.x; save(); room(); }
    else if (a === 'photo') photo();
    else if (a === 'food') food();
    else if (a === 'shop') shop();
    else if (a === 'snap') { const o = $('.ogame'); if (o && o._snap) o._snap(); }
    else if (a === 'buy') { const it = SF.SHOP[v]; if (S.money >= it.p && !S.owned.includes(v)) { S.money -= it.p; S.owned.push(v); save(); sfx('ding'); const o = $('.ogame'); if (o && o._render) o._render(); } }
    else if (a === 'closegame') { const o = $('.ogame'); if (o) o.remove(); Y.px = SW.x; save(); street(); }
    else if (a === 'gohome') goHome();
  });
  document.addEventListener('keydown', e => { if (e.key === ' ' && document.querySelector('.ogame [data-o="snap"]')) { e.preventDefault(); const o = $('.ogame'); if (o && o._snap) o._snap(); } });

  O.start = function () { api = SF.life.api; S = api.state(); Object.assign(S.lay, { stage: 'lobby', lob: 0, arrived: false, casual: false, rs: false, px: SPOTS.hotel + 40 }); save(); lobby(); };
  O.resume = function () { api = SF.life.api; S = api.state(); const st = S.lay.stage || 'lobby'; if (S.lay.final) return finish(); (st === 'street' ? street : st === 'room' ? room : lobby)(); };
  O.stop = stopLoop;
  O._sw = SW;
})(window.SF);
