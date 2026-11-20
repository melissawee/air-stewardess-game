/* Crew Life art: avatar portraits, item icons, postcards and scene backdrops (all SVG strings) */
(function (SF) {
  let uid = 0;
  const find = (arr, id) => arr.find(x => x.id === id) || arr[0];

  /* ---------- avatar (viewBox 0 0 240 300) ---------- */
  // p: {skin, hairC, look:{found,hair,shadow,blush,lips,acc,ear}, outfit, uni, badge, wings, name, hairCol?}
  SF.avatar = function (p, viewBox) {
    const id = 'a' + (++uid);
    const L = p.look || {};
    const skin = SF.SKINS[p.skin] || SF.SKINS[1];
    const face = L.found != null ? SF.FOUND[L.found].c : skin;
    const hair = p.hairCol || SF.HAIRC[p.hairC] || SF.HAIRC[0];
    const U = SF.UNI[p.uni || 'teal'];
    const style = L.hair || 'loose';
    let s = `<svg viewBox="${viewBox || '0 0 240 300'}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name || 'Crew member'}">`;
    s += `<defs><pattern id="${id}k" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="${U.c}"/>
      <g fill="${U.a}" opacity=".85"><circle cx="11" cy="11" r="2.4"/><ellipse cx="11" cy="5.5" rx="1.8" ry="3.2"/><ellipse cx="11" cy="16.5" rx="1.8" ry="3.2"/><ellipse cx="5.5" cy="11" rx="3.2" ry="1.8"/><ellipse cx="16.5" cy="11" rx="3.2" ry="1.8"/></g>
      <circle cx="0" cy="0" r="1.6" fill="${U.a}"/><circle cx="22" cy="22" r="1.6" fill="${U.a}"/><circle cx="22" cy="0" r="1.6" fill="${U.a}"/><circle cx="0" cy="22" r="1.6" fill="${U.a}"/></pattern>
      <linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hair}"/><stop offset="1" stop-color="${shade(hair, -18)}"/></linearGradient></defs>`;
    // hair behind
    const hb = `fill="url(#${id}h)"`;
    if (style === 'bun') s += `<circle cx="120" cy="50" r="25" ${hb}/><path d="M104 44q16-12 32 0" stroke="${shade(hair, 25)}" stroke-width="2" fill="none" opacity=".6"/>`;
    if (style === 'twist') s += `<ellipse cx="120" cy="104" rx="60" ry="64" ${hb}/><path d="M164 70q16 30 6 76" stroke="${shade(hair, 22)}" stroke-width="3" fill="none" opacity=".6"/>`;
    if (style === 'chignon') s += `<ellipse cx="120" cy="104" rx="57" ry="62" ${hb}/><circle cx="166" cy="152" r="18" ${hb}/>`;
    if (style === 'pony') s += `<ellipse cx="120" cy="104" rx="57" ry="62" ${hb}/><path d="M150 70Q200 104 184 204Q178 224 166 210Q180 150 144 86Z" ${hb}/>`;
    if (style === 'loose') s += `<path d="M62 104Q56 40 120 40Q184 40 178 104L188 236Q120 254 52 236Z" ${hb}/>`;
    // body / outfit
    const body = 'M18 300L20 252Q24 214 70 204L104 192Q120 206 136 192L170 204Q216 214 220 252L222 300Z';
    const o = p.outfit || 'uniform';
    if (o === 'uniform') {
      s += `<path d="${body}" fill="url(#${id}k)"/><path d="M20 300L22 262Q30 236 46 232L52 300Z M220 300L218 262Q210 236 194 232L188 300Z" fill="${U.d}" opacity=".35"/>`;
      s += `<path d="M98 194L120 242L142 194Z" fill="${skin}"/><path d="M94 196L120 248L146 196" stroke="#f3e2b8" stroke-width="5" fill="none" stroke-linejoin="round"/>`;
      s += `<path d="M120 248L120 300" stroke="#f3e2b8" stroke-width="3" opacity=".8"/>`;
    } else if (o === 'casual') {
      s += `<path d="${body}" fill="#f6c453"/><path d="M80 230q40 20 80 0M70 262q50 22 100 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/><path d="M100 194Q120 218 140 194Z" fill="${skin}"/>`;
    } else if (o === 'robe') {
      s += `<path d="${body}" fill="#f4f1ec"/><path d="M96 194L120 250L144 194Z" fill="${skin}"/><path d="M92 196L120 256L148 196M120 256L80 300M120 256L160 300" stroke="#dcd6cc" stroke-width="5" fill="none"/>`;
    } else if (o === 'hotel') {
      s += `<path d="${body}" fill="#2b2f45"/><path d="M100 194L120 250L140 194Z" fill="#fff"/><path d="M114 204L120 232L126 204L120 198Z" fill="#a8326e"/><path d="M96 196L120 256L144 196" stroke="#3d4260" stroke-width="5" fill="none"/>`;
    }
    // neck + head
    s += `<path d="M104 146L104 196Q120 206 136 196L136 146Z" fill="${skin}"/><path d="M104 176Q120 186 136 176L136 168Q120 178 104 168Z" fill="#000" opacity=".06"/>`;
    s += `<ellipse cx="69" cy="118" rx="8" ry="12" fill="${skin}"/><ellipse cx="171" cy="118" rx="8" ry="12" fill="${skin}"/>`;
    s += `<ellipse cx="120" cy="112" rx="51" ry="59" fill="${face}"/>`;
    // eyeshadow
    const sh = find(SF.SHADOW, L.shadow);
    if (sh.c) {
      const c = sh.c === 'uni' ? U.c : sh.c;
      s += `<g fill="${c}" opacity="${sh.id === 'champ' ? .9 : .62}"><path d="M84 114Q98 97 114 111L114 114Q98 104 84 116Z"/><path d="M156 114Q142 97 126 111L126 114Q142 104 156 116Z"/></g>`;
      if (sh.id === 'glitter') s += `<g fill="#fff">${[88, 96, 104, 136, 144, 152].map((x, i) => `<circle cx="${x}" cy="${104 + (i % 2) * 4}" r="1.3"/>`).join('')}</g>`;
    }
    // eyes
    const eye = cx => `<path d="M${cx - 11} 114Q${cx} 106 ${cx + 11} 114Q${cx} 121 ${cx - 11} 114Z" fill="#fff"/><circle cx="${cx}" cy="114" r="5.4" fill="#3b2416"/><circle cx="${cx}" cy="114" r="2.5" fill="#120a06"/><circle cx="${cx + 2}" cy="112" r="1.5" fill="#fff"/>`;
    s += eye(99) + eye(141);
    s += `<g stroke="#1d1310" stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M86 114Q99 104 112 113"/><path d="M86 114l-4-3"/><path d="M154 114Q141 104 128 113"/><path d="M154 114l4-3"/></g>`;
    s += `<g stroke="${shade(hair, -10)}" stroke-width="3.4" fill="none" stroke-linecap="round"><path d="M87 95Q99 89 111 93"/><path d="M129 93Q141 89 153 95"/></g>`;
    s += `<path d="M120 120Q116 132 121 136" stroke="${shade(skin, -40)}" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/>`;
    // blush
    const bl = find(SF.BLUSH, L.blush);
    if (bl.c) s += `<g fill="${bl.c}" opacity="${bl.id === 'clown' ? .75 : .38}"><circle cx="89" cy="134" r="${bl.id === 'clown' ? 16 : 10}"/><circle cx="151" cy="134" r="${bl.id === 'clown' ? 16 : 10}"/></g>`;
    // lips
    const lp = find(SF.LIPS, L.lips);
    const lc = lp.c || shade(skin, -38);
    s += `<path d="M107 148Q114 142 120 145Q126 142 133 148Q120 151 107 148Z" fill="${lc}"/><path d="M107 148Q120 161 133 148Q120 152 107 148Z" fill="${lp.c ? shade(lc, 12) : shade(skin, -28)}"/>`;
    if (lp.c) s += `<path d="M113 153q7 2 13 0" stroke="#fff" stroke-width="1.4" opacity=".45" fill="none" stroke-linecap="round"/>`;
    // hair front
    s += `<path d="M66 112Q62 50 120 46Q178 50 174 112Q170 84 152 70Q124 86 90 74Q72 88 66 112Z" fill="url(#${id}h)"/>`;
    if (style === 'pony' || style === 'loose') s += `<path d="M72 98Q94 60 152 64Q124 78 104 100Q90 92 72 98Z" fill="${hair}"/>`;
    if (style === 'loose') s += `<path d="M66 108Q58 172 72 232L86 230Q76 172 80 112Z" fill="${hair}"/><path d="M174 108Q182 172 168 232L154 230Q164 172 160 112Z" fill="${hair}"/>`;
    s += `<path d="M84 64Q110 54 138 58" stroke="${shade(hair, 30)}" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>`;
    // accessories
    const ac = L.acc || 'none';
    if (ac === 'orchid') s += `<g transform="translate(80 68)">${[0, 72, 144, 216, 288].map((a, i) => `<ellipse rx="5" ry="9" cy="-7" fill="${i % 2 ? '#d16a9f' : '#a8326e'}" transform="rotate(${a})"/>`).join('')}<circle r="3.6" fill="#e3b04b"/></g>`;
    if (ac === 'pearlclip') s += `<g fill="#fbf7ef" stroke="#cfc6b6">${[0, 1, 2, 3].map(i => `<circle cx="${74 + i * 8}" cy="${80 - i * 5}" r="3.8"/>`).join('')}</g>`;
    if (ac === 'bow') s += `<g transform="translate(120 40)"><path d="M0 0L-46 -24Q-54 0 -46 24Z M0 0L46 -24Q54 0 46 24Z" fill="#ff4d6d"/><circle r="9" fill="#e0304f"/></g>`;
    const er = L.ear || 'none';
    if (er === 'studs') s += `<circle cx="69" cy="129" r="3" fill="#e3b04b"/><circle cx="171" cy="129" r="3" fill="#e3b04b"/>`;
    if (er === 'pearls') s += `<g fill="#fbf7ef" stroke="#d6cdbd"><circle cx="69" cy="131" r="4.4"/><circle cx="171" cy="131" r="4.4"/></g>`;
    if (er === 'hoops') s += `<g stroke="#e3b04b" stroke-width="3" fill="none"><circle cx="68" cy="140" r="11"/><circle cx="172" cy="140" r="11"/></g>`;
    if (o === 'uniform' && p.wings) s += `<g transform="translate(70 234)"><path d="M0 0C-8-7-22-7-28-4C-21-2-14 1-7 3Z" fill="#e3b04b"/><path d="M0 0C8-7 22-7 28-4C21-2 14 1 7 3Z" fill="#e3b04b"/><circle r="3.6" fill="#a8326e"/></g>`;
    if ((o === 'uniform' || o === 'hotel') && p.badge) s += `<rect x="148" y="228" width="46" height="15" rx="2.5" fill="#f7efdf" stroke="#c9a14a"/><text x="171" y="239" font-size="8" font-family="Sora,sans-serif" font-weight="600" text-anchor="middle" fill="#2a3540">${esc((p.name || '').slice(0, 10))}</text>`;
    return s + '</svg>';
  };
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const f = v => Math.max(0, Math.min(255, v + amt));
    return '#' + ((1 << 24) + (f(n >> 16) << 16) + (f((n >> 8) & 255) << 8) + f(n & 255)).toString(16).slice(1);
  }
  SF.shade = shade;
  function esc(t) { return String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  SF.esc = esc;

  /* ---------- small item icons (viewBox 0 0 48 48) ---------- */
  const I = {
    passport: '<rect x="12" y="6" width="24" height="36" rx="3" fill="#7a1f2b"/><circle cx="24" cy="20" r="6" fill="none" stroke="#e3b04b" stroke-width="2"/><rect x="17" y="31" width="14" height="2.5" rx="1" fill="#e3b04b"/>',
    crewid: '<path d="M24 4v10" stroke="#a8326e" stroke-width="3"/><rect x="10" y="12" width="28" height="32" rx="3" fill="#fff" stroke="#9aa3ab" stroke-width="1.5"/><rect x="15" y="17" width="10" height="12" rx="1.5" fill="#cfd8de"/><circle cx="20" cy="21.5" r="2.6" fill="#8a96a0"/><rect x="27" y="18" width="7" height="2" fill="#9aa3ab"/><rect x="27" y="23" width="7" height="2" fill="#9aa3ab"/><rect x="15" y="34" width="18" height="4" rx="1" fill="#1f6f8b"/>',
    licence: '<rect x="8" y="9" width="32" height="26" rx="2" fill="#fbf6ea" stroke="#c9a14a" stroke-width="1.5"/><rect x="13" y="15" width="22" height="2" fill="#b8ad97"/><rect x="13" y="20" width="16" height="2" fill="#b8ad97"/><circle cx="32" cy="30" r="5" fill="#d23a3a"/><path d="M29 34l-2 9 5-3 5 3-2-9" fill="#d23a3a"/>',
    torch: '<rect x="8" y="20" width="22" height="9" rx="3" fill="#3d4651"/><path d="M30 18l6-3v19l-6-3z" fill="#5d6874"/><path d="M36 15l10-6v31l-10-6z" fill="#ffe27a" opacity=".7"/>',
    manual: '<rect x="11" y="6" width="26" height="36" rx="4" fill="#2b2f36"/><rect x="14" y="10" width="20" height="26" rx="1.5" fill="#cfe8f5"/><rect x="17" y="14" width="14" height="2" fill="#1f6f8b"/><rect x="17" y="19" width="10" height="2" fill="#7f97a6"/><rect x="17" y="24" width="12" height="2" fill="#7f97a6"/><circle cx="24" cy="39" r="1.4" fill="#666"/>',
    pouch: '<path d="M8 20q16-8 32 0l-3 20H11z" fill="#f2a7c3"/><path d="M8 20q16-8 32 0" stroke="#a8326e" stroke-width="2" fill="none"/><circle cx="36" cy="18" r="2" fill="#e3b04b"/><rect x="18" y="8" width="5" height="12" rx="1.5" fill="#b3132f"/>',
    snacks: '<path d="M12 8h24l-2 34H14z" fill="#f2c14e"/><path d="M12 8l4 4 4-4 4 4 4-4 4 4 4-4" stroke="#c9952a" stroke-width="1.5" fill="none"/><circle cx="24" cy="26" r="6" fill="#e4572e"/>',
    charger: '<rect x="10" y="10" width="14" height="16" rx="3" fill="#f2f2f2" stroke="#9aa3ab" stroke-width="1.5"/><path d="M14 6v4M20 6v4" stroke="#9aa3ab" stroke-width="2"/><path d="M17 26c0 10 18 2 18 14" stroke="#555" stroke-width="2.5" fill="none"/>',
    novel: '<rect x="10" y="8" width="26" height="34" rx="2" fill="#5b8e7d"/><rect x="34" y="10" width="4" height="30" fill="#f4efe4"/><rect x="15" y="15" width="14" height="3" fill="#f4efe4"/>',
    swimsuit: '<path d="M16 6v8q-4 6 0 14l-2 14h20l-2-14q4-8 0-14V6l-4 8h-8z" fill="#2e86ab"/><path d="M15 28h18" stroke="#fff" stroke-width="2"/>',
    umbrella: '<path d="M6 24a18 18 0 0 1 36 0z" fill="#ef476f"/><path d="M24 24v14q0 4-4 4" stroke="#333" stroke-width="2.5" fill="none"/>',
    pumps: '<path d="M6 34q8-2 14-12l10 2q8 2 12 8v4H6z" fill="#1f3b52"/><path d="M38 36l2 8h-4z" fill="#1f3b52"/>',
    sneakers: '<path d="M6 36v-8q8 0 12-8l12 6q10 2 12 6v4z" fill="#f4f4f4" stroke="#9aa3ab" stroke-width="1.5"/><rect x="6" y="36" width="36" height="5" rx="2" fill="#e4572e"/>',
    stilettos: '<path d="M6 34q10-4 16-16l8 6q6 4 10 10v2H6z" fill="#e0304f"/><path d="M36 36l1 9" stroke="#e0304f" stroke-width="2"/>',
    slippers: '<ellipse cx="24" cy="32" rx="18" ry="9" fill="#f4f1ec" stroke="#dcd6cc" stroke-width="1.5"/><ellipse cx="18" cy="18" rx="3" ry="9" fill="#f4f1ec" stroke="#dcd6cc"/><ellipse cx="28" cy="18" rx="3" ry="9" fill="#f4f1ec" stroke="#dcd6cc"/><circle cx="24" cy="28" r="2" fill="#f2a7c3"/>',
    badge: '<rect x="6" y="16" width="36" height="16" rx="3" fill="#f7efdf" stroke="#c9a14a" stroke-width="1.5"/><rect x="11" y="22" width="26" height="4" rx="1" fill="#2a3540"/>',
    wings: '<path d="M24 24C18 16 6 16 2 19C7 21 13 24 19 26Z M24 24C30 16 42 16 46 19C41 21 35 24 29 26Z" fill="#e3b04b"/><circle cx="24" cy="24" r="4" fill="#a8326e"/>',
    watch: '<rect x="18" y="4" width="12" height="40" rx="4" fill="#5d4637"/><circle cx="24" cy="24" r="10" fill="#f7f2e8" stroke="#c9a14a" stroke-width="2.5"/><path d="M24 24v-6M24 24l4 2" stroke="#2a3540" stroke-width="1.8" stroke-linecap="round"/>',
    uniform: '<path d="M24 6v4" stroke="#8a7a5a" stroke-width="2"/><path d="M16 12h16l8 6-4 6-4-2v20H16V22l-4 2-4-6z" fill="currentColor"/><path d="M20 12l4 9 4-9" stroke="#f3e2b8" stroke-width="2" fill="none"/>',
    casual: '<path d="M24 6v4" stroke="#8a7a5a" stroke-width="2"/><path d="M18 12h12l2 10 6 20H10l6-20z" fill="#f6c453"/>',
    robe: '<path d="M24 6v4" stroke="#8a7a5a" stroke-width="2"/><path d="M14 12h20l6 10-4 3v17H12V25l-4-3z" fill="#f4f1ec" stroke="#dcd6cc"/><path d="M20 12l4 14 4-14" stroke="#dcd6cc" stroke-width="2" fill="none"/>'
  };
  SF.icon = (k, color) => `<svg viewBox="0 0 48 48" aria-hidden="true" style="color:${color || '#1f6f8b'}">${I[k] || ''}</svg>`;

  /* ---------- postcards (viewBox 0 0 200 130) ---------- */
  const sky = (a, b, id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="200" height="130" fill="url(#${id})"/>`;
  const P = {
    kul1: g => sky('#5b3a7a', '#ff9a6b', g) + '<g fill="#2b2140"><path d="M70 130V40l4-8 4 8v90z M70 44h8M66 60h16V130H66z"/><path d="M122 130V40l4-8 4 8v90z M118 60h16V130h-16z"/><rect x="82" y="72" width="36" height="4"/><rect x="0" y="104" width="200" height="26"/><rect x="20" y="90" width="18" height="40"/><rect x="160" y="84" width="22" height="46"/></g><g fill="#ffe08a">' + [74, 126].map(x => [70, 84, 98, 112].map(y => `<rect x="${x - 2}" y="${y}" width="8" height="2"/>`).join('')).join('') + '</g><path d="M74 26v-14M126 26v-14" stroke="#2b2140" stroke-width="1.5"/>',
    kul2: g => sky('#1d1b3a', '#4a2c5a', g) + '<path d="M0 30q50 16 100 0t100 0" stroke="#333" fill="none"/>' + [20, 50, 80, 110, 140, 170].map((x, i) => `<circle cx="${x}" cy="${36 + (i % 2) * 4}" r="7" fill="#ff5a3c"/><circle cx="${x}" cy="${36 + (i % 2) * 4}" r="3" fill="#ffd36b"/>`).join('') + '<rect x="0" y="80" width="200" height="50" fill="#3a2a2a"/><rect x="10" y="70" width="80" height="18" fill="#c9302c"/><rect x="110" y="70" width="80" height="18" fill="#2e86ab"/><ellipse cx="100" cy="112" rx="36" ry="10" fill="#f4f0e8"/><ellipse cx="100" cy="108" rx="28" ry="6" fill="#d9822b"/><path d="M80 104q8-6 16 0M104 102q8-6 16 0" stroke="#7a3d12" stroke-width="2" fill="none"/>',
    bkk1: g => sky('#e0628a', '#ffcf6b', g) + '<rect y="96" width="200" height="34" fill="#c46a5a" opacity=".7"/><g fill="#7a3a2a"><path d="M100 16l6 30h-12z M80 96l20-50 20 50z M50 96l12-34 12 34z M126 96l12-34 12 34z"/><rect x="40" y="88" width="120" height="10"/></g><g fill="#ffd36b" opacity=".85"><path d="M100 26l3 18h-6z"/><rect x="92" y="70" width="16" height="3"/></g><path d="M20 112h40l-6 6H26zM130 116h46l-6 6h-34z" fill="#3a2a2a"/>',
    bkk2: g => sky('#8fd0de', '#f6e6b4', g) + '<rect y="70" width="200" height="60" fill="#6aa58a"/>' + [[30, 92, '#ffb347'], [100, 108, '#f2c14e'], [160, 90, '#e4572e']].map(([x, y, c]) => `<path d="M${x - 30} ${y}h60l-8 10h-44z" fill="#7a4a2a"/><circle cx="${x - 10}" cy="${y - 4}" r="5" fill="${c}"/><circle cx="${x + 2}" cy="${y - 5}" r="5" fill="#7cb342"/><circle cx="${x + 12}" cy="${y - 4}" r="5" fill="${c}"/><path d="M${x - 4} ${y - 2}l-10-22h28z" fill="#f4e0a8"/>`).join(''),
    hnd1: g => sky('#9fd3ff', '#f7e1ea', g) + '<path d="M30 110L100 30L170 110Z" fill="#6b7fa8"/><path d="M84 48L100 30L116 48L108 52L100 46L92 52Z" fill="#fff"/><rect y="104" width="200" height="26" fill="#6aa58a"/><g fill="#f7a8c4">' + [[20, 96], [36, 90], [168, 92], [184, 98], [150, 100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10"/>`).join('') + '</g><g fill="#b8323a"><rect x="138" y="70" width="18" height="4"/><rect x="141" y="74" width="12" height="30"/><rect x="134" y="64" width="26" height="4"/></g>',
    hnd2: g => sky('#2a1c2e', '#4c2a3a', g) + [30, 70, 130, 170].map(x => `<rect x="${x - 8}" y="18" width="16" height="22" rx="7" fill="#ff5a3c"/><rect x="${x - 6}" y="22" width="12" height="14" rx="5" fill="#ffd36b" opacity=".6"/>`).join('') + '<rect y="86" width="200" height="44" fill="#6b4a32"/><ellipse cx="100" cy="98" rx="44" ry="12" fill="#2b2b2b"/><ellipse cx="100" cy="96" rx="38" ry="9" fill="#e8b46a"/><circle cx="86" cy="94" r="7" fill="#fff6e0"/><circle cx="86" cy="94" r="3.5" fill="#f2b632"/><rect x="104" y="88" width="16" height="9" rx="2" fill="#b86a4a"/><path d="M140 70l-20 26M148 72l-22 25" stroke="#c9a26b" stroke-width="2.5"/>',
    lhr1: g => sky('#9bb3c9', '#e4e7ea', g) + '<g fill="#5a5048"><rect x="40" y="30" width="22" height="86"/><path d="M36 30L51 6L66 30Z"/></g><circle cx="51" cy="44" r="8" fill="#f4ead2"/><path d="M51 44v-5M51 44l3 2" stroke="#333" stroke-width="1.4"/><rect y="104" width="200" height="26" fill="#6b8299"/><path d="M70 100h130v6H70z" fill="#5a5048"/><g fill="#d23a3a"><rect x="120" y="82" width="46" height="20" rx="3"/><rect x="122" y="84" width="42" height="6" fill="#ffd9d9"/></g><circle cx="130" cy="103" r="3" fill="#222"/><circle cx="156" cy="103" r="3" fill="#222"/>' + [20, 80, 170, 190].map((x, i) => `<path d="M${x} ${10 + i * 6}l-3 8" stroke="#6b8299" stroke-width="1.2"/>`).join(''),
    lhr2: g => sky('#f4e3d0', '#ecd2bd', g) + '<rect y="96" width="200" height="34" fill="#c9a888"/><ellipse cx="62" cy="96" rx="34" ry="6" fill="#fff"/><path d="M42 94q0-26 20-26t20 26z" fill="#fbf7ef" stroke="#c9b9a6"/><path d="M82 80q12 0 10 10" stroke="#c9b9a6" stroke-width="3" fill="none"/><path d="M42 80l-12-8" stroke="#c9b9a6" stroke-width="3"/><g fill="#d9b48f"><path d="M118 96q-2-14 14-14t14 14z"/><path d="M150 96q-2-14 14-14t14 14z"/></g><g fill="#fff"><ellipse cx="132" cy="84" rx="9" ry="3"/><ellipse cx="164" cy="84" rx="9" ry="3"/></g><circle cx="132" cy="80" r="3" fill="#c9302c"/><circle cx="164" cy="80" r="3" fill="#c9302c"/>',
    jfk1: g => sky('#7fb2ff', '#ffd2b0', g) + '<g fill="#4a5872">' + [[10, 60], [30, 40], [52, 70], [72, 24], [96, 54], [118, 34], [140, 64], [160, 46], [180, 70]].map(([x, y]) => `<rect x="${x}" y="${y}" width="18" height="${100 - y}"/>`).join('') + '<path d="M78 24l3-14 3 14z"/></g><rect y="96" width="200" height="34" fill="#4f8a4a"/><g fill="#e98a2a">' + [20, 50, 90, 130, 170].map(x => `<circle cx="${x}" cy="100" r="13"/>`).join('') + '</g><g fill="#d4532a">' + [36, 110, 150].map(x => `<circle cx="${x}" cy="106" r="10"/>`).join('') + '</g>',
    jfk2: g => sky('#120c24', '#2a1640', g) + '<rect x="30" y="40" width="140" height="44" rx="4" fill="#3a2350" stroke="#ffd36b" stroke-width="2"/>' + Array.from({ length: 16 }, (_, i) => `<circle cx="${38 + i * 8.3}" cy="44" r="2" fill="#ffd36b"/><circle cx="${38 + i * 8.3}" cy="80" r="2" fill="#ffd36b"/>`).join('') + '<rect x="56" y="54" width="88" height="16" rx="2" fill="#a8326e"/><rect x="66" y="60" width="68" height="4" fill="#ffd9ec"/><rect y="98" width="200" height="32" fill="#1c1430"/>' + [20, 180, 40, 160].map((x, i) => `<path d="M${x} ${16 + i * 4}l2 4 4 1-4 1-2 4-2-4-4-1 4-1z" fill="#fff" opacity=".8"/>`).join('')
  };
  SF.postcard = (id, cls) => { const g = 'pg' + (++uid); return `<svg viewBox="0 0 200 130" class="${cls || ''}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${(P[id] || P.kul1)(g)}</svg>`; };

  /* ---------- scene backdrops (viewBox 0 0 400 440); avatar nested ---------- */
  const avAt = (av, x, y, w) => av.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${w * 1.25}" `);
  SF.scene = function (kind, av, extra) {
    extra = extra || {};
    let s = '<svg viewBox="0 0 400 440" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">';
    const g = 'sc' + (++uid);
    if (kind === 'home') {
      s += `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd9a8"/><stop offset="1" stop-color="#bfe3f5"/></linearGradient></defs>`;
      s += '<rect width="400" height="440" fill="#f6e3d3"/><rect y="372" width="400" height="68" fill="#d4ab84"/><path d="M0 372h400" stroke="#b88d66" stroke-width="3"/>';
      s += `<rect x="34" y="36" width="190" height="210" rx="8" fill="url(#${g})"/>`;
      s += '<g fill="#8fa9bd">' + [[44, 150, 30], [80, 120, 26], [112, 160, 34], [150, 110, 24], [178, 140, 36]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${246 - y}"/>`).join('') + '</g>';
      s += '<g fill="#e8eef2" opacity=".8">' + [[48, 160], [56, 172], [84, 132], [90, 150], [118, 172], [126, 190], [154, 124], [184, 156], [192, 176]].map(([x, y]) => `<rect x="${x}" y="${y}" width="5" height="4"/>`).join('') + '</g>';
      s += '<circle cx="190" cy="74" r="16" fill="#fff4c9"/><rect x="34" y="36" width="190" height="210" rx="8" fill="none" stroke="#fff" stroke-width="10"/><path d="M129 36v210M34 141h190" stroke="#fff" stroke-width="6"/>';
      s += '<path d="M20 26q20 120 6 230h26q-10-110-6-230z" fill="#a8326e" opacity=".85"/><path d="M238 26q-20 120-6 230h-26q10-110 6-230z" fill="#a8326e" opacity=".85"/><rect x="14" y="20" width="230" height="8" rx="4" fill="#8a6a50"/>';
      s += '<g transform="translate(345 300)"><path d="M-22 72h44l-6-40h-32z" fill="#c46a4a"/><path d="M0 32q-4-60-30-80M0 32q2-50 24-74M0 32q0-40 4-62" stroke="#3f7a3a" stroke-width="4" fill="none"/>' + [[-30, -48], [24, -42], [4, -30], [-14, -20]].map(([x, y]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a, i) => `<ellipse rx="4" ry="7" cy="-5" fill="${i % 2 ? '#d16a9f' : '#a8326e'}" transform="rotate(${a})"/>`).join('')}<circle r="2.6" fill="#e3b04b"/></g>`).join('') + '</g>';
      s += avAt(av, 112, 140, 240);
    } else if (kind === 'vanity') {
      s += `<defs><clipPath id="${g}"><ellipse cx="200" cy="200" rx="150" ry="180"/></clipPath><radialGradient id="${g}r"><stop offset="0" stop-color="#fff8ee"/><stop offset="1" stop-color="#f1d9c9"/></radialGradient></defs>`;
      s += '<rect width="400" height="440" fill="#f3d6d0"/>';
      s += `<ellipse cx="200" cy="200" rx="166" ry="196" fill="#d9b48f"/><ellipse cx="200" cy="200" rx="150" ry="180" fill="url(#${g}r)"/>`;
      s += `<g clip-path="url(#${g})">${av.replace('<svg ', '<svg x="20" y="10" width="360" height="450" ')}</g>`;
      s += Array.from({ length: 12 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 12; return `<circle cx="${200 + Math.cos(a) * 166}" cy="${200 + Math.sin(a) * 196}" r="9" fill="#fffbe8" stroke="#e3b04b" stroke-width="2"/>`; }).join('');
      s += '<rect y="404" width="400" height="36" fill="#c99b74"/>';
    } else if (kind === 'wardrobe') {
      s += '<rect width="400" height="440" fill="#ece3d6"/><rect x="20" y="24" width="360" height="360" rx="6" fill="#8a6a50"/><rect x="32" y="36" width="336" height="340" fill="#f7f1e8"/><rect x="32" y="64" width="336" height="5" fill="#b9a58c"/>';
      const hang = (x, k, c) => `<path d="M${x} 66l0-6" stroke="#8a7a5a" stroke-width="2"/><g transform="translate(${x - 24} 64)" style="color:${c}">${I[k].replace(/fill="currentColor"/g, `fill="${c}"`)}</g>`;
      s += `<g transform="scale(1)">${hang(60, 'uniform', extra.uni || '#1f6f8b').replace('translate(36 64)', 'translate(36 64) scale(1.4)')}${hang(340, 'casual', '#f6c453').replace('translate(316 64)', 'translate(316 64) scale(1.4)')}</g>`;
      s += '<rect y="384" width="400" height="56" fill="#cbb08f"/>';
      s += avAt(av, 92, 190, 216);
    } else if (kind === 'brief') {
      s += '<rect width="400" height="440" fill="#dfe8ec"/><rect x="40" y="34" width="320" height="150" rx="8" fill="#14303d"/>';
      s += `<path d="M80 150Q200 40 320 120" stroke="#d16a9f" stroke-width="3" stroke-dasharray="6 6" fill="none"/><circle cx="80" cy="150" r="7" fill="#e3b04b"/><circle cx="320" cy="120" r="7" fill="#fff"/><text x="80" y="174" fill="#fff" font-size="13" font-family="Sora,sans-serif" text-anchor="middle" font-weight="700">SIN</text><text x="320" y="144" fill="#fff" font-size="13" font-family="Sora,sans-serif" text-anchor="middle" font-weight="700">${extra.to || ''}</text><text x="60" y="60" fill="#8fd0de" font-size="14" font-family="Sora,sans-serif" font-weight="700">${extra.code || ''}</text>`;
      s += avAt(av, 100, 150, 200);
      s += '<rect y="380" width="400" height="60" fill="#8a6a50"/><rect y="372" width="400" height="10" fill="#a8835f"/>';
    } else if (kind === 'hotel') {
      s += '<rect width="400" height="440" fill="#efe2cc"/><rect y="330" width="400" height="110" fill="#d8cbb4"/>';
      s += '<g fill="#c9a14a"><rect x="196" y="0" width="8" height="40"/><path d="M160 40h80l-12 30h-56z"/></g><g fill="#fff6d6">' + [170, 190, 210, 230].map(x => `<circle cx="${x}" cy="76" r="5"/>`).join('') + '</g>';
      s += `<rect x="60" y="96" width="280" height="40" rx="4" fill="#2b2f45"/><text x="200" y="122" fill="#e3c27a" font-size="15" font-family="Sora,sans-serif" text-anchor="middle" font-weight="700">${extra.hotel || ''}</text>`;
      s += '<g transform="translate(40 250)"><path d="M-16 90h32l-4-28h-24z" fill="#8a6a50"/><path d="M0 62q-30-50-10-90M0 62q26-40 20-86M0 62q0-50-2-70" stroke="#3f7a3a" stroke-width="6" fill="none"/></g>';
      s += avAt(av, 110, 150, 180);
      s += '<rect x="30" y="330" width="340" height="110" fill="#6b4a32"/><rect x="24" y="322" width="352" height="14" rx="3" fill="#8a6a50"/><circle cx="300" cy="316" r="8" fill="#e3b04b"/><rect x="292" y="316" width="16" height="4" fill="#c9a14a"/>';
    } else if (kind === 'report') {
      s += `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1b3a"/><stop offset="1" stop-color="#2a3f6e"/></linearGradient></defs><rect width="400" height="440" fill="url(#${g})"/>`;
      s += '<g fill="#fff">' + [[30, 30], [90, 60], [160, 24], [250, 50], [330, 30], [370, 80], [60, 110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6"/>`).join('') + '</g>';
      s += '<path d="M220 110l70-6 30-14q10-2 6 6l-16 14 40 4-6 6-50 2-30 20h-12l12-20-40 2z" fill="#cfd8e3"/>';
      s += '<rect y="250" width="400" height="190" fill="#1a2440"/><g fill="#ffd36b">' + Array.from({ length: 10 }, (_, i) => `<circle cx="${20 + i * 40}" cy="262" r="3"/>`).join('') + '</g>';
      s += avAt(av, 100, 150, 200);
      s += '<rect y="400" width="400" height="40" fill="#3a3f52"/>';
    } else if (kind === 'city') {
      s += `<rect width="400" height="440" fill="${extra.ground || '#d9cbb4'}"/>`;
      s += SF.postcard(extra.spot).replace('<svg ', '<svg x="-100" y="0" width="600" height="390" ');
      s += '<rect y="380" width="400" height="60" fill="#cdbb9e"/><path d="M0 380h400" stroke="#b39f80" stroke-width="3"/>';
      s += avAt(av, 120, 210, 184);
    } else if (kind === 'create') {
      s += '<rect width="400" height="440" fill="#f3e6d6"/><circle cx="200" cy="230" r="170" fill="#e9d2c0"/>' + avAt(av, 80, 100, 240) + '<rect y="400" width="400" height="40" fill="#d4ab84"/>';
    }
    return s + '</svg>';
  };
})(window.SF);
