const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/cards.json');
const cardsData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const strategyConcepts = {
  "集中兵力": "A massive concentration of Red Army artillery and troops converging on a single, isolated enemy pillbox in a narrow mountain pass.",
  "伤其十指": "A single, deeply and perfectly dug trench, contrasted with several shallow, unfinished, and useless scratches on the ground nearby.",
  "围魏救赵": "A tactical map where instead of attacking a heavily defended fortress, Red Army troops are seen attacking the enemy's undefended supply train in the distance, forcing the fortress troops to come out.",
  "避实击虚": "Red Army soldiers silently slipping through a dense, unguarded bamboo forest, bypassing a heavily fortified concrete enemy checkpoint visible in the distance.",
  "诱敌深入": "A trail of deliberately dropped supplies leading into a steep, narrow, dark canyon where Red Army ambushers are hidden on the cliffs.",
  "统一战线": "A diverse group of people—a Red Army soldier, a student in a uniform, a peasant, and a businessman in a suit—standing together with their hands stacked, forming a united front.",
  "主要矛盾": "A chaotic battlefield with many minor skirmishes, but the focus is on a single, massive, heavily armored enemy train that is the clear core threat.",
  "调查研究": "A Red Army cadre sitting on a small wooden stool in a village, holding a notebook and earnestly listening to a weathered old peasant pointing at a map.",
  "实事求是": "A simple, brutally honest ledger or abacus on a rough wooden table, showing a very small amount of grain, with no sugar-coating.",
  "独立自主": "A solitary Red Army soldier stubbornly forging his own path through deep snow with a machete, refusing to follow the easier, pre-trodden footprints of others.",
  "战略藐视": "A small, defiant Red Army soldier standing on a hill, looking down at a massive, seemingly invincible enemy army in the valley, with a fearless expression.",
  "战术重视": "A close-up of a soldier meticulously and carefully cleaning the tiny, intricate parts of his rifle by the light of a single candle.",
  "保存实力": "Soldiers carefully hiding their heavy weapons and supplies in a deep, dry cave, covering the entrance with brush to avoid detection by passing enemy planes.",
  "坚壁清野": "A scorched-earth village where everything useful has been burned or hidden, leaving nothing but empty, useless husks for the approaching enemy.",
  "各个击破": "Soldiers isolating and capturing small, separated groups of enemies one by one in a labyrinth-like village.",
  "运动战": "A blur of fast-moving soldiers without heavy baggage, quickly traversing a mountain ridge, emphasizing speed and fluidity.",
  "阵地战": "A heavily fortified, deep trench system reinforced with sandbags and logs, with soldiers grimly holding their positions despite heavy bombardment.",
  "游击战": "Shadowy figures emerging from a thick, foggy forest to strike a quick blow before melting back into the trees.",
  "破袭战": "Soldiers dynamically destroying a vital railway line or blowing up a key bridge in the dead of night to disrupt enemy logistics.",
  "歼灭战": "A completely encircled and destroyed enemy camp, with no avenues of escape, emphasizing total elimination.",
  "攻坚战": "Soldiers desperately climbing a steep, heavily fortified city wall under intense fire, representing the hardest possible objective.",
  "政治仗": "A soldier handing out pamphlets and food to starving civilians, winning their hearts and minds rather than just fighting.",
  "兵民是本": "A visual showing the deep roots of a giant tree, with the roots composed of countless ordinary peasants holding up the massive trunk of the army.",
  "底线思维": "A heavily reinforced underground bunker with emergency rations and a final, hidden escape tunnel, prepared for the absolute worst-case scenario.",
  "战略预备": "A hidden, fresh reserve unit of soldiers resting quietly in a dense forest, waiting for the critical moment to be deployed."
};

const styleSuffix = "A vintage rough pencil sketch from the 1930s Chinese revolutionary era. Sepia tone, mimeograph print style, worn paper texture. Monochromatic, high contrast, old historical document aesthetic. No text, no letters.";

cardsData['战略'].cards.forEach(card => {
  if (strategyConcepts[card.title]) {
    card.imageConcept = strategyConcepts[card.title];
    card.prompt = `${card.imageConcept} ${styleSuffix}`;
  }
});

fs.writeFileSync(dataFile, JSON.stringify(cardsData, null, 2));
console.log('Successfully injected concepts for 战略 category.');
