# Aisle Service: a Singapore Flight stewardess game

Live a day in the life of a cabin crew member at **Singapore Flight** (a made-up airline). It's a fan-made browser game.

**Play:** https://air-stewardess-game.vercel.app

## Crew Life mode
1. **Create your stewardess**: name badge, skin tone and hair colour.
2. **Vanity mirror**: foundation, eyeshadow, blush, lipstick, hair and accessories, then a grooming check against the airline's guide. Pick a mismatched foundation and the mirror shows it.
3. **Wardrobe and crew bag**: put on the kebaya uniform in your rank colour, add your badge, wings pin, watch and the right shoes, then pack your passport, crew ID and duty kit.
4. **Crew centre briefing**: your supervisor checks your uniform and documents, then asks three safety and service questions.
5. **Fly**: first-person aisle service. Your grooming, kit, quiz score and energy set your starting cabin mood and walking pace.
6. **Hotel lobby**: walk in with your suitcase, ring the bell, hand over your crew ID, pick a room, book a wake-up call and take the lift.
7. **Hotel room**: tap the suitcase to change out of uniform, order room service, nap, look out of the window or head out.
8. **City street**: walk the street of each outstation as the sky turns from day to night. Take a photo at the landmark (a timing mini-game), eat at the local stall or watch a Broadway show, and shop for new makeup. Collect 10 postcards.
9. **Pick-up**: sleep, get your wake-up call (or risk oversleeping), and fly home.
10. **Career**: earn XP from Trainee to Inflight Supervisor, unlocking teal, jade, ruby and plum kebayas.

## Quick flight mode
The arcade version: pick any unlocked route and play it straight away.

## Flight controls
- ▲ ▼ or W / S: walk the aisle
- 1–7: serve an item (or tap it on the trolley)
- Space: warm smile · T: secure trolley · B: seatbelt check · R: restock at the galley · P: pause

## Project layout
It's a static site with no build step.
- `index.html`: page shell
- `css/style.css`: styles
- `js/data.js`: looks, wardrobe, ranks, cities and briefing questions
- `js/art.js`: SVG people (portraits and full-body walkers), icons, postcards and scenes
- `js/flight.js`: the in-flight game (canvas)
- `js/outstation.js`: hotel lobby, room, city street and layover mini-games
- `js/life.js`: Crew Life screens and save data (stored in the browser's localStorage)
