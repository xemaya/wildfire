const fs = require('fs');
const path = require('path');
const dataFile = path.join(__dirname, '../data/cards.json');
const cardsData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const actionConcepts = {
  "敌进我退": "A vintage pencil sketch of Red Army soldiers calmly and organizedly retreating into dense fog on a mountain path as massive enemy silhouettes approach from below.",
  "敌驻我扰": "A vintage pencil sketch of a lone guerrilla soldier stealthily throwing a makeshift explosive towards a heavily fortified, sleeping enemy encampment in the dead of night.",
  "敌疲我打": "A vintage pencil sketch of Red Army soldiers bursting out from hidden camouflaged trenches to ambush a completely exhausted, resting enemy column.",
  "敌退我追": "A vintage pencil sketch of Red Army soldiers fiercely charging downhill, aggressively pursuing a disorganized, retreating enemy force.",
  "积极防御": "A vintage pencil sketch of a heavily fortified defensive position, where soldiers are not just hiding, but actively firing artillery back at the attackers.",
  "缩小战线": "A vintage pencil sketch of a commander resolutely using a thick black pencil to cross out multiple far-flung outposts on a large military map.",
  "建立小胜": "A vintage pencil sketch of a tired but smiling soldier holding up a single, highly valuable captured enemy compass or rifle as a trophy.",
  "小规模试探": "A vintage pencil sketch of a single scout carefully tossing a stone or firing a single shot to test the reaction of a massive, dark enemy fortress.",
  "接触群众": "A vintage pencil sketch of a Red Army soldier sitting on a low wooden stool, helping an old peasant grind grain with a traditional stone mill while listening intently.",
  "退步抽身": "A vintage pencil sketch of a soldier decisively cutting a tangled, heavy rope that was dragging him down towards a deep muddy swamp.",
  "稳扎稳打": "A vintage pencil sketch of soldiers painstakingly digging a deep, precise trench line, refusing to rush ahead despite the ongoing battle in the distance.",
  "不打无准备仗": "A vintage pencil sketch of a meticulous quartermaster counting exactly every single bullet and ration by the light of a small oil lamp before a battle.",
  "集中优势": "A vintage pencil sketch of three Red Army soldiers coordinating a simultaneous, concentrated attack on a single, isolated enemy guard.",
  "避免硬拼": "A vintage pencil sketch of a wise commander physically restraining a hot-headed young soldier from charging out of the trench into overwhelming enemy fire.",
  "暂时退却": "A vintage pencil sketch of soldiers packing their gear and stepping backward into the shadows of a forest, yielding the sunny clearing to the enemy for now.",
  "调查走访": "A vintage pencil sketch of a soldier with muddy boots, holding a notebook and walking through a ruined village to inspect the actual damage firsthand.",
  "批评自我": "A vintage pencil sketch of a solemn cadre standing up in a dimly lit meeting room, pointing firmly at his own chest in front of his peers.",
  "精兵简政": "A vintage pencil sketch of an office desk where stacks of useless bureaucratic papers are being swept into a blazing fireplace.",
  "自己动手": "A vintage pencil sketch of soldiers spinning thread and weaving cloth on primitive wooden looms in a cave to survive the economic blockade.",
  "改造思想": "A vintage pencil sketch of a soldier reading a revolutionary book under a dim oil lamp, with an expression of intense realization and unlearning.",
  "诉苦运动": "A vintage pencil sketch of a weeping peasant standing in the center of a crowded village square, pouring out his grievances while soldiers listen with deep empathy.",
  "先发制人": "A vintage pencil sketch of a Red Army soldier launching a surprise attack, throwing a grenade just before the enemy can raise their rifles.",
  "隐蔽待机": "A vintage pencil sketch of soldiers lying perfectly still, completely covered in snow and branches, blending perfectly into the frozen landscape.",
  "重点突破": "A vintage pencil sketch of a heavy wooden battering ram or explosive charge shattering the very center of a massive, ancient city gate.",
  "迂回穿插": "A vintage pencil sketch of a swift unit of soldiers navigating a treacherous, narrow goat path on a cliff edge to bypass the main enemy frontline."
};

const moraleConcepts = {
  "接受拉锯": "A vintage pencil sketch of two hands gripping a thick, frayed rope in a tense, grueling tug-of-war, with neither side giving an inch.",
  "戒骄戒躁": "A vintage pencil sketch of a seasoned commander placing a firm, calming hand on the shoulder of an overly eager, visibly agitated young soldier.",
  "允许疲劳": "A vintage pencil sketch of an exhausted soldier fast asleep against a trench wall, his rifle securely in his arms, finally resting without guilt.",
  "丢掉幻想": "A vintage pencil sketch of a soldier crushing a fragile, beautiful porcelain teacup in his fist, preparing for brutal hand-to-hand combat.",
  "道路曲折": "A vintage pencil sketch of a long, incredibly winding and treacherous mountain road that eventually leads to a bright, sunlit peak in the far distance.",
  "克服恐水": "A vintage pencil sketch of a nervous young soldier being encouraged to step into a rapidly flowing, freezing river by an older comrade holding out a hand.",
  "战略定力": "A vintage pencil sketch of a soldier standing perfectly still like a statue in a raging storm, firmly holding onto a large, heavy flag pole.",
  "排除万难": "A vintage pencil sketch of a team of soldiers stubbornly pushing a massive, stuck wooden cart up a steep, muddy hill in the pouring rain.",
  "警惕糖衣": "A vintage pencil sketch of a stern soldier refusing a lavish, decadent feast offered on a silver platter, opting instead for his simple rations.",
  "抛弃侥幸": "A vintage pencil sketch of a soldier meticulously double-checking the firing mechanism of his rifle, refusing to rely on luck.",
  "拒绝悲观": "A vintage pencil sketch of a soldier looking out of a dark, collapsed cave, focusing intently on a single, tiny patch of starry sky visible through the rubble.",
  "保持愤怒": "A vintage pencil sketch of a soldier with a fiercely determined, furious gaze, tightly gripping his weapon while looking at a burning village in the distance.",
  "承认恐惧": "A vintage pencil sketch of a soldier whose hands are visibly trembling as he loads his rifle, yet he stands bravely at the very front of the trench.",
  "忍辱负重": "A vintage pencil sketch of a soldier silently carrying an incredibly heavy burden of supplies on his back, ignoring the harsh conditions around him.",
  "居安思危": "A vintage pencil sketch of a soldier diligently repairing a leak in a roof and sharpening his knife even during a moment of calm, sunny peace.",
  "破除迷信": "A vintage pencil sketch of a soldier confidently tearing down an imposing, overly elaborate idol or poster that represents false authority.",
  "放下包袱": "A vintage pencil sketch of a weary traveler unbuckling and dropping a massive, heavy, useless trunk from his back, preparing to climb a cliff.",
  "盲目自信": "A vintage pencil sketch of a soldier standing arrogantly and carelessly out in the open, completely unaware of the sniper crosshairs targeting him.",
  "精神懈怠": "A vintage pencil sketch of a guard nodding off to sleep at his post, his rifle slipping from his grasp, while shadows approach the camp.",
  "个人英雄": "A vintage pencil sketch of a lone soldier hopelessly charging an entire enemy battalion by himself, leaving his comrades far behind in the trench.",
  "患得患失": "A vintage pencil sketch of a person paralyzed in indecision, trying to hold onto too many fragile items at once, causing them all to slip.",
  "怨天尤人": "A vintage pencil sketch of a soldier sitting in the mud, helplessly shouting at the stormy sky instead of taking cover or fixing his weapon.",
  "孤芳自赏": "A vintage pencil sketch of a figure standing aloof on an isolated, fragile rock, refusing to join the massive, powerful stream of people marching below.",
  "急功近利": "A vintage pencil sketch of someone greedily digging up a tiny, unripe plant to eat the roots, destroying any chance of a future harvest.",
  "意志衰退": "A vintage pencil sketch of a soldier slowly dropping his head and letting his rifle fall to the ground in a snowy wasteland, giving up the fight."
};

const orgConcepts = {
  "建立根据地": "A vintage pencil sketch of soldiers and peasants working together to build sturdy log cabins and fortify a hidden, secure valley settlement.",
  "兵民为本": "A vintage pencil sketch of a strong, healthy root system of an ancient tree, deeply embedded in rich soil, supporting a massive trunk.",
  "统一思想": "A vintage pencil sketch of many disparate compass needles violently spinning, before finally aligning to point strongly in one single, unified direction.",
  "整顿作风": "A vintage pencil sketch of a strict, rigorous military inspection, with soldiers standing in perfect, disciplined formation in the early morning mist.",
  "培养骨干": "A vintage pencil sketch of an experienced blacksmith carefully teaching a young apprentice how to forge a strong, glowing iron sword.",
  "纪律严明": "A vintage pencil sketch of a soldier firmly refusing a peasant's offer of an apple, pointing to a 'Three Rules of Discipline' patch on his uniform.",
  "控制末端": "A vintage pencil sketch of a meticulous ledger showing extremely precise, down-to-the-last-grain accounting of supplies by a quartermaster.",
  "自力更生": "A vintage pencil sketch of soldiers proudly holding crude but effective weapons and tools they manufactured themselves in a makeshift cave arsenal.",
  "精兵简政": "A vintage pencil sketch of a sleek, unburdened guerrilla unit moving swiftly, leaving behind large piles of useless, heavy bureaucratic baggage.",
  "惩前毖后": "A vintage pencil sketch of a solemn meeting where a mistake is being analyzed on a chalkboard, not to execute the offender, but to heal the unit.",
  "建立后勤": "A vintage pencil sketch of a long, sturdy line of mules and peasants transporting heavy bags of grain across a mountain pass to the front lines.",
  "坚强核心": "A vintage pencil sketch of a solid, unbreakable anvil standing firm amidst a shower of sparks and heavy hammer blows.",
  "群众路线": "A vintage pencil sketch of commanders sitting in a circle on the dirt floor with ordinary peasants, drawing tactical plans in the dust together.",
  "为人民服务": "A vintage pencil sketch of a soldier selflessly carrying an injured peasant on his back through a flood.",
  "破除特权": "A vintage pencil sketch of a high-ranking commander eating the exact same simple bowl of millet as the lowest-ranking common soldier.",
  "公开剖析": "A vintage pencil sketch of a person bravely peeling back bandages to expose a wound to a medic, ready to face the painful treatment.",
  "民主集中": "A vintage pencil sketch of a lively, chaotic discussion in a room, followed by a single, unified, undeniable fist being slammed on the table to make the decision.",
  "瓦解敌军": "A vintage pencil sketch of Red Army soldiers using large megaphones to broadcast messages across the trenches, causing enemy soldiers to drop their weapons.",
  "先锋模范": "A vintage pencil sketch of a squad leader being the absolute first to leap out of the trench into heavy fire, leading by fearless example.",
  "肃清流毒": "A vintage pencil sketch of a surgeon carefully but firmly using a scalpel to remove a toxic, diseased thorn from a healthy limb.",
  "拒绝山头": "A vintage pencil sketch of a sledgehammer smashing down a series of small, isolated walls that were dividing a large, unified courtyard.",
  "拒绝本本": "A vintage pencil sketch of a soldier violently throwing away a clean, pristine textbook and picking up a heavily worn, mud-stained field manual.",
  "建立系统": "A vintage pencil sketch of an intricately designed, perfectly interlocking set of heavy wooden gears, working flawlessly together.",
  "调查报告": "A vintage pencil sketch of a massive, intimidating stack of detailed, handwritten field reports and statistics sitting heavily on a commander's desk.",
  "内外一致": "A vintage pencil sketch of a perfectly clear mirror reflecting a soldier whose outward stance perfectly matches his internal, steadfast expression."
};

const contraConcepts = {
  "主要矛盾": "A vintage pencil sketch of a hunter ignoring a swarm of annoying bees to carefully aim his rifle at the massive, charging bear that poses the real threat.",
  "次要矛盾": "A vintage pencil sketch of a soldier casually swatting away a fly while his eyes remain intensely locked on the enemy trench line.",
  "矛盾转化": "A vintage pencil sketch of a heavy, oppressive enemy tank that has been captured, repainted, and is now being driven by Red Army soldiers against its former owners.",
  "对立统一": "A vintage pencil sketch of the Yin-Yang symbol formed dynamically by the swirling dust of an intense cavalry charge colliding with a solid infantry shield wall.",
  "区分敌我": "A vintage pencil sketch of a sharp, definitive line being drawn in the sand with a bayonet, separating comrades from infiltrators.",
  "量变质变": "A vintage pencil sketch of countless tiny, insignificant drops of water finally breaking through a massive, ancient stone dam in a sudden, catastrophic burst.",
  "内因外因": "A vintage pencil sketch of a strong, healthy seed pushing through hard rock to sprout (internal strength), while rain (external) falls on it.",
  "具体问题": "A vintage pencil sketch of a soldier carefully selecting exactly the right, uniquely shaped key from a large keyring to open a complex lock.",
  "左倾冒进": "A vintage pencil sketch of an overzealous soldier blindly running forward off a steep cliff edge, completely ignoring the lack of a bridge.",
  "右倾保守": "A vintage pencil sketch of a soldier cowering defensively behind a massive wall, missing the clear, wide-open opportunity to attack the exposed enemy.",
  "经验主义": "A vintage pencil sketch of a commander stubbornly trying to use a map from an entirely different province to navigate a new, unfamiliar terrain.",
  "教条主义": "A vintage pencil sketch of a scholar rigidly holding a rulebook in front of his face, completely blind to the actual, dynamic battle happening right in front of him.",
  "主观主义": "A vintage pencil sketch of a person wearing deeply tinted, cracked glasses, looking at a sunny landscape but perceiving only a dark, distorted storm.",
  "形式主义": "A vintage pencil sketch of a beautifully decorated, incredibly intricate, but completely empty and useless wooden box on a battlefield.",
  "官僚主义": "A vintage pencil sketch of a desperate courier with an urgent message being blocked by a smug clerk pointing to a massive pile of required stamped paperwork.",
  "流寇主义": "A vintage pencil sketch of a disorganized band of raiders riding away with looted goods, leaving a burning village behind, with no intention of staying or building.",
  "盲动主义": "A vintage pencil sketch of a soldier firing his machine gun wildly in all directions into the dark fog, wasting ammunition without seeing any target.",
  "妥协主义": "A vintage pencil sketch of a soldier slowly, hesitantly lowering his rifle to surrender to a smiling enemy holding a hidden dagger behind his back.",
  "折中主义": "A vintage pencil sketch of someone trying to build a bridge halfway across a river and stopping, resulting in a useless structure that helps no one.",
  "逃跑主义": "A vintage pencil sketch of a soldier dropping his gear and sprinting away from the frontline in absolute panic, leaving his comrades behind.",
  "机会主义": "A vintage pencil sketch of a person waiting in the shadows for two stags to severely injure each other before stepping out to easily claim the prize.",
  "宗派主义": "A vintage pencil sketch of several small, isolated groups of soldiers sitting in tight circles with their backs to each other, refusing to communicate.",
  "两面派": "A vintage pencil sketch of a figure smiling warmly and shaking hands with a comrade, while his dark shadow on the wall holds a raised knife.",
  "绝对平均": "A vintage pencil sketch of a hard-working soldier and a completely lazy soldier being handed the exact same sized bowl of rice, causing visible resentment.",
  "极端主义": "A vintage pencil sketch of a pendulum swinging violently and uncontrollably to the absolute highest point on one side, threatening to break the entire clock mechanism."
};

const styleSuffix = "A vintage rough pencil sketch from the 1930s Chinese revolutionary era. Sepia tone, mimeograph print style, worn paper texture. Monochromatic, high contrast, old historical document aesthetic. No text, no letters.";

cardsData['行动'].cards.forEach(card => {
  if (actionConcepts[card.title]) {
    card.imageConcept = actionConcepts[card.title];
    card.prompt = `${card.imageConcept} ${styleSuffix}`;
  }
});

cardsData['情绪'].cards.forEach(card => {
  if (moraleConcepts[card.title]) {
    card.imageConcept = moraleConcepts[card.title];
    card.prompt = `${card.imageConcept} ${styleSuffix}`;
  }
});

cardsData['组织'].cards.forEach(card => {
  if (orgConcepts[card.title]) {
    card.imageConcept = orgConcepts[card.title];
    card.prompt = `${card.imageConcept} ${styleSuffix}`;
  }
});

cardsData['矛盾'].cards.forEach(card => {
  if (contraConcepts[card.title]) {
    card.imageConcept = contraConcepts[card.title];
    card.prompt = `${card.imageConcept} ${styleSuffix}`;
  }
});

fs.writeFileSync(dataFile, JSON.stringify(cardsData, null, 2));
console.log('Successfully injected revolutionary concepts for the remaining 100 cards.');
