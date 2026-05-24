const fs = require('fs');
const path = require('path');
const dataFile = path.join(__dirname, '../data/cards.json');
const cardsData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// 第一大类【局势】前 10 张的脱敏安全 Prompt
const safeConcepts = {
  "持久战": "A vintage pencil sketch of farmers working hard to reclaim a barren wasteland, planting seeds for the future.",
  "敌强我弱": "A vintage pencil sketch of a lone, cautious scout observing a massive, imposing stone fortress in the distance from a hidden trench.",
  "战线过长": "A vintage pencil sketch of a chaotic, overloaded telegraph station with too many wires and a nearly burnt-out oil lamp.",
  "无根据地": "A vintage pencil sketch of weary travelers trudging through a harsh, freezing blizzard in the wilderness with no shelter in sight.",
  "星星之火": "A vintage pencil sketch of a few travelers huddled around a tiny, bright campfire in the vast, dark snowy mountains.",
  "战略退却": "A vintage pencil sketch of people carefully moving a heavy, antique mimeograph machine and supplies away from a storm.",
  "战略相持": "A vintage pencil sketch of a tense negotiation table with an unsigned document, two different vintage hats, and an ashtray full of cigarettes.",
  "战略反攻": "A vintage pencil sketch of a person standing on a mountain peak blowing an antique bugle horn, signaling a charge.",
  "孤军深入": "A vintage pencil sketch of a figure in a long traditional gown walking away, disappearing into a dark, rainy alleyway in 1930s Shanghai.",
  "四面受敌": "A hand-drawn vintage tactical map showing a central stronghold surrounded by thick black arrows pointing inward from all directions."
};

const safeStyleSuffix = "A vintage rough pencil sketch from the 1930s. Sepia tone, mimeograph print style, worn paper texture. Monochromatic, high contrast, old historical document aesthetic. No text, no letters. Safe for work.";

cardsData['局势'].cards.forEach(card => {
  if (safeConcepts[card.title]) {
    card.imageConcept = safeConcepts[card.title];
    card.prompt = `${card.imageConcept} ${safeStyleSuffix}`;
  }
});

fs.writeFileSync(dataFile, JSON.stringify(cardsData, null, 2));
console.log('Successfully injected SAFE concepts for the first 10 cards.');
