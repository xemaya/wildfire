const fs = require('fs');
const path = require('path');
const dataFile = path.join(__dirname, '../data/cards.json');
const cardsData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const situationConcepts = {
  "持久战": "A vintage pencil sketch of Red Army farmers working hard to reclaim a barren wasteland in Nanniwan, planting seeds for the future.",
  "敌强我弱": "A vintage pencil sketch of a lone, cautious Red Army guerrilla observing a massive, imposing stone fortress heavily guarded by enemy troops in the distance from a hidden trench.",
  "战线过长": "A vintage pencil sketch of a chaotic, overloaded underground telegraph station with too many wires, scattered maps, and a nearly burnt-out oil lamp, conveying loss of control.",
  "无根据地": "A vintage pencil sketch of weary Red Army soldiers trudging through a harsh, freezing blizzard in the wilderness with no shelter in sight, conveying a sense of being lost without a root.",
  "星星之火": "A vintage pencil sketch of a few weary Red Army soldiers huddled around a tiny, bright campfire in the vast, dark, freezing snowy mountains. Conveying immense hardship but enduring hope.",
  "战略退却": "A vintage pencil sketch of revolutionary cadres carefully moving a heavy, antique mimeograph machine and essential supplies away from a heavy storm or bombardment, organized retreat.",
  "战略相持": "A vintage pencil sketch of a tense negotiation table in a cave dwelling with an unsigned document, two different military hats (one Red Army, one Nationalist), and an ashtray full of cigarettes.",
  "战略反攻": "A vintage pencil sketch of a Red Army soldier standing on a mountain peak blowing a bugle horn, signaling a massive charge down the hill.",
  "孤军深入": "A vintage pencil sketch from behind: an underground intelligence worker wearing a long traditional gown (changshan) walking away, almost disappearing at the far end of a dark, rainy alleyway in old Shanghai, with subtle enemy patrols in the background.",
  "四面受敌": "A hand-drawn vintage military tactical map showing a central stronghold marked with a subtle star, surrounded by four or five thick, distinct black tactical arrows pointing inward from different directions.",
  "丧失主动": "A vintage pencil sketch of a military map being blown away by a chaotic gust of wind, while hands desperately try to grasp it.",
  "战略包围": "A vintage pencil sketch of a thick ring of barbed wire slowly closing in on a small, worn-out straw sandbag bunker.",
  "绝对劣势": "A vintage pencil sketch of a single, shattered sword lying in the mud under the shadows of towering, heavily armed mechanical gears or boots.",
  "局部优势": "A vintage pencil sketch of a tiny, intensely focused beam of sunlight breaking through a massively dark, cloudy sky, illuminating a single small red flag.",
  "游击状态": "A vintage pencil sketch of footprints leading in and out of a dense, foggy bamboo forest, with no permanent camp visible.",
  "消耗战": "A vintage pencil sketch of two heavily worn, deeply dug trenches facing each other closely, with the ground between them reduced to absolute barren craters.",
  "内外交困": "A vintage pencil sketch of a broken-down wooden cart stuck in deep mud (external), with the two mules pulling it actively fighting each other (internal).",
  "青黄不接": "A vintage pencil sketch of an empty grain silo in winter, with only a few seeds left at the bottom, while the new crops outside are still tiny sprouts under the snow.",
  "盲目乐观": "A vintage pencil sketch of a soldier smiling and holding up a small, insignificant captured enemy rifle, completely ignoring a massive enemy shadow falling over him.",
  "盲目悲观": "A vintage pencil sketch of a soldier dropping his rifle and hiding in a dark corner, paralyzed by fear, while a small ray of sunlight tries to reach him.",
  "腹背受敌": "A vintage pencil sketch of a soldier standing on a narrow gorge bridge, facing an oncoming threat, while turning his head back in horror to see flames rising from his own camp.",
  "战略转折": "A vintage pencil sketch of dawn breaking over a mountain peak, where a heavily battle-scarred red flag is finally planted firmly.",
  "弹尽粮绝": "A vintage pencil sketch of a desperate soldier shaking an empty, torn ammunition pouch upside down.",
  "险地求生": "A vintage pencil sketch of soldiers with their backs against a raging, perilous river, fiercely holding their ground against an unseen approaching force.",
  "破局边缘": "A vintage pencil sketch of a massive, solid stone wall with a single, tiny, glowing crack forming in the center."
};

const styleSuffix = "A vintage rough pencil sketch from the 1930s Chinese revolutionary era. Sepia tone, mimeograph print style, worn paper texture. Monochromatic, high contrast, old historical document aesthetic. No text, no letters.";

cardsData['局势'].cards.forEach(card => {
  if (situationConcepts[card.title]) {
    card.imageConcept = situationConcepts[card.title];
    card.prompt = `${card.imageConcept} ${styleSuffix}`;
  }
});

fs.writeFileSync(dataFile, JSON.stringify(cardsData, null, 2));
console.log('Successfully injected revolutionary concepts for the 25 局势 cards.');
