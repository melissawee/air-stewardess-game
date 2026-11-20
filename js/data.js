/* Crew Life data: looks, wardrobe, bag, ranks, cities, briefing questions */
window.SF = window.SF || {};
(function (SF) {
  SF.SKINS = ['#f7dcc4', '#efc7a4', '#dcaa84', '#c48a62', '#9c6440', '#6e4228'];
  SF.FOUND = [
    { n: 'Porcelain', c: '#f9e0ca' }, { n: 'Ivory', c: '#f0caa8' }, { n: 'Sand', c: '#deae88' },
    { n: 'Honey', c: '#c78e66' }, { n: 'Caramel', c: '#a06845' }, { n: 'Espresso', c: '#71452b' }
  ];
  SF.HAIRC = ['#1b1411', '#3b2618', '#5e3b22', '#8a5a32', '#c2925a'];

  // ok: within the Singapore Flight grooming guide
  SF.HAIR = [
    { id: 'bun', n: 'Neat bun', ok: true }, { id: 'twist', n: 'French twist', ok: true },
    { id: 'chignon', n: 'Low chignon', ok: true }, { id: 'pony', n: 'Ponytail', ok: false },
    { id: 'loose', n: 'Loose and long', ok: false }
  ];
  SF.LIPS = [
    { id: 'none', n: 'Bare', c: null, ok: false }, { id: 'nude', n: 'Nude rose', c: '#c8797a', ok: true },
    { id: 'ruby', n: 'Ruby', c: '#b3132f', ok: true }, { id: 'coral', n: 'Coral', c: '#ef6a5b', ok: true },
    { id: 'berry', n: 'Berry', c: '#8e2347', ok: true, shop: 1 }, { id: 'sakura', n: 'Cherry blossom', c: '#e98fa6', ok: true, shop: 1 },
    { id: 'neon', n: 'Neon lime', c: '#a6f03a', ok: false, shop: 1 }
  ];
  SF.SHADOW = [
    { id: 'none', n: 'None', c: null, ok: true }, { id: 'brown', n: 'Soft brown', c: '#8b5e3c', ok: true },
    { id: 'champ', n: 'Champagne', c: '#e8cfa0', ok: true }, { id: 'uni', n: 'Uniform tone', c: 'uni', ok: true },
    { id: 'gold', n: 'Gold shimmer', c: '#d4a73c', ok: true, shop: 1 }, { id: 'glitter', n: 'Disco glitter', c: '#3a7bff', ok: false, shop: 1 }
  ];
  SF.BLUSH = [
    { id: 'none', n: 'None', c: null, ok: true }, { id: 'peach', n: 'Peach', c: '#f4a07a', ok: true },
    { id: 'rose', n: 'Rose', c: '#e8798f', ok: true }, { id: 'clown', n: 'Very red', c: '#ff2a2a', ok: false }
  ];
  SF.ACC = [
    { id: 'none', n: 'None', ok: true }, { id: 'orchid', n: 'Orchid hairpin', ok: true, shop: 1 },
    { id: 'pearlclip', n: 'Pearl clip', ok: true, shop: 1 }, { id: 'bow', n: 'Giant bow', ok: false, shop: 1 }
  ];
  SF.EAR = [
    { id: 'none', n: 'None', ok: true }, { id: 'studs', n: 'Gold studs', ok: true },
    { id: 'pearls', n: 'Pearls', ok: true, shop: 1 }, { id: 'hoops', n: 'Big hoops', ok: false, shop: 1 }
  ];

  SF.OUTFITS = [
    { id: 'uniform', n: 'Kebaya uniform' }, { id: 'casual', n: 'Sundress' }, { id: 'robe', n: 'Bathrobe' }
  ];
  SF.SHOES = [
    { id: 'pumps', n: 'Uniform pumps', ok: true }, { id: 'sneakers', n: 'Sneakers', ok: false },
    { id: 'stilettos', n: 'Party stilettos', ok: false }, { id: 'slippers', n: 'Bunny slippers', ok: false }
  ];
  SF.BAG = [
    { id: 'passport', n: 'Passport', req: 1 }, { id: 'crewid', n: 'Crew ID', req: 1 },
    { id: 'licence', n: 'Crew licence', req: 1 }, { id: 'torch', n: 'Torch', req: 1 },
    { id: 'manual', n: 'Manual tablet', req: 1 }, { id: 'pouch', n: 'Makeup pouch' },
    { id: 'snacks', n: 'Snacks' }, { id: 'charger', n: 'Phone charger' },
    { id: 'novel', n: 'Novel' }, { id: 'swimsuit', n: 'Swimsuit' }, { id: 'umbrella', n: 'Umbrella' }
  ];
  SF.BAG_MAX = 8;

  SF.RANKS = [
    { n: 'Trainee', xp: 0, uni: 'teal' },
    { n: 'Flight Stewardess', xp: 300, uni: 'teal' },
    { n: 'Leading Stewardess', xp: 1300, uni: 'jade' },
    { n: 'Chief Stewardess', xp: 3200, uni: 'ruby' },
    { n: 'Inflight Supervisor', xp: 6500, uni: 'plum' }
  ];
  SF.UNI = {
    teal: { n: 'Teal', c: '#1f6f8b', a: '#8fd0de', d: '#174f63' },
    jade: { n: 'Jade', c: '#2f8a65', a: '#a6dcc2', d: '#21654a' },
    ruby: { n: 'Ruby', c: '#b02e3c', a: '#f3aab1', d: '#80212c' },
    plum: { n: 'Plum', c: '#6a2c5e', a: '#dcaad0', d: '#4c1f43' }
  };

  SF.SHOP = {
    orchid: { kind: 'acc', n: 'Orchid hairpin', p: 30 }, berry: { kind: 'lips', n: 'Berry lipstick', p: 25 },
    gold: { kind: 'shadow', n: 'Gold shimmer eyeshadow', p: 28 }, neon: { kind: 'lips', n: 'Neon lime lipstick', p: 15 },
    sakura: { kind: 'lips', n: 'Cherry blossom lipstick', p: 30 }, bow: { kind: 'acc', n: 'Giant bow', p: 20 },
    pearlclip: { kind: 'acc', n: 'Pearl hair clip', p: 45 }, pearls: { kind: 'ear', n: 'Pearl earrings', p: 40 },
    glitter: { kind: 'shadow', n: 'Disco glitter eyeshadow', p: 22 }, hoops: { kind: 'ear', n: 'Big gold hoops', p: 30 }
  };

  SF.CITIES = {
    KUL: { city: 'Kuala Lumpur', hotel: 'Seri Bulan Hotel', hi: 'Selamat datang!', hours: 16, sky: ['#ff9a6b', '#5b3a7a'],
      spots: [
        { id: 'kul1', n: 'Twin towers at dusk', h: 3, e: -10, cost: 0, t: 'You watch the city lights flick on from the park below the towers.' },
        { id: 'kul2', n: 'Supper street', h: 2, e: -4, cost: 20, t: 'Char kway teow, satay and sugarcane juice on a buzzing street.' }],
      shop: { n: 'Central market stall', items: ['orchid', 'berry'] } },
    BKK: { city: 'Bangkok', hotel: 'Riverside Lotus Hotel', hi: 'Sawasdee ka!', hours: 20, sky: ['#ffcf6b', '#e0628a'],
      spots: [
        { id: 'bkk1', n: 'Riverside temple', h: 3, e: -12, cost: 5, t: 'Golden spires glow across the river as the boats slide past.' },
        { id: 'bkk2', n: 'Floating market', h: 3, e: -10, cost: 15, t: 'Mango sticky rice handed over from a wobbly wooden boat.' }],
      shop: { n: 'Night market', items: ['gold', 'neon'] } },
    HND: { city: 'Tokyo', hotel: 'Hotel Sakura Gate', hi: 'Irasshaimase!', hours: 26, sky: ['#9fd3ff', '#f7c6d9'],
      spots: [
        { id: 'hnd1', n: 'Mountain day trip', h: 6, e: -20, cost: 40, t: 'A clear day: the snow-capped peak floats above the cherry blossoms.' },
        { id: 'hnd2', n: 'Ramen alley', h: 2, e: -4, cost: 18, t: 'A steaming bowl at a counter seat under paper lanterns.' }],
      shop: { n: 'Beauty floor', items: ['sakura', 'bow'] } },
    LHR: { city: 'London', hotel: 'The Kensington Crown', hi: 'Good evening!', hours: 30, sky: ['#9bb3c9', '#d8dde3'],
      spots: [
        { id: 'lhr1', n: 'Clock tower walk', h: 3, e: -10, cost: 0, t: 'Drizzle, a red bus and the big clock chiming across the river.' },
        { id: 'lhr2', n: 'Afternoon tea', h: 2, e: -2, cost: 35, t: 'Scones, clotted cream and far too many tiny sandwiches.' }],
      shop: { n: 'Department store', items: ['pearlclip', 'pearls'] } },
    JFK: { city: 'New York', hotel: 'Hotel Liberty Park', hi: 'Welcome to New York!', hours: 36, sky: ['#7fb2ff', '#ffb38a'],
      spots: [
        { id: 'jfk1', n: 'Skyline and the park', h: 4, e: -12, cost: 0, t: 'Autumn leaves in the park, towers glinting all around.' },
        { id: 'jfk2', n: 'Broadway show', h: 3, e: -6, cost: 60, t: 'Bright lights, a standing ovation and a song stuck in your head.' }],
      shop: { n: 'Fifth Avenue', items: ['glitter', 'hoops'] } }
  };
  SF.STAMPS = ['kul1', 'kul2', 'bkk1', 'bkk2', 'hnd1', 'hnd2', 'lhr1', 'lhr2', 'jfk1', 'jfk2'];

  SF.QUIZ = [
    { q: 'The seatbelt sign comes on in the middle of meal service. What comes first?', a: ['Secure the trolley and galley', 'Finish serving the row', 'Ask passengers to hold their drinks'], why: 'A loose trolley is dangerous in turbulence, so it is secured first.' },
    { q: 'A passenger with a severe peanut allergy asks for satay. You…', a: ['Explain it comes with peanut sauce and offer another dish', 'Serve it without the sauce', 'Tell them to pick around the peanuts'], why: 'Satay sauce is made with peanuts. Always offer a safe alternative.' },
    { q: 'How should hot drinks be served?', a: ['From the aisle side, onto the tray table', 'Passed across the aisle-seat passenger', 'Poured while the passenger holds the cup'], why: 'Never pass hot drinks across someone’s lap.' },
    { q: 'A passenger is fast asleep when meal service reaches them. You…', a: ['Let them sleep and offer the meal when they wake', 'Wake them gently so they don’t miss out', 'Leave the tray on their lap'], why: 'Let sleepers rest, and note the seat so the meal can be offered later.' },
    { q: 'Before take-off, which check is NOT part of the cabin check?', a: ['Reading lights switched on', 'Tray tables stowed', 'Seatbelts fastened'], why: 'Belts, seat backs, tray tables and blinds get checked. Reading lights don’t.' },
    { q: 'Someone seated in an exit row must be…', a: ['Willing and able to help in an emergency', 'Travelling with a young child', 'A frequent flyer'], why: 'Exit-row passengers may need to open the exit in an emergency.' },
    { q: 'A child is travelling alone. You should…', a: ['Check on them regularly through the flight', 'Seat them in the galley with the crew', 'Wait for them to ask for help'], why: 'Unaccompanied children get regular check-ins from the crew.' },
    { q: 'Where does the trolley belong when it isn’t in use?', a: ['Stowed and locked in the galley', 'Parked in the aisle by row 1', 'Beside the lavatory door'], why: 'An unattended trolley blocks the aisle and can roll.' },
    { q: 'A passenger says they feel faint. Your first step?', a: ['Stay with them and alert a senior crew member', 'Bring them a Singapore Sling', 'Suggest they walk it off in the aisle'], why: 'Stay with the passenger and get help from the senior crew.' }
  ];
})(window.SF);
