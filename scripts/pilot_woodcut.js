const fs = require('fs');
const path = require('path');
const https = require('https');

// ============================================================
// 语录卡 · 木刻意象打样 (pilot)  —— 方向A：每句配一个呼应其意的抽象木刻
// 先验证 9 张（形势/方针/行动各3）的风格与意象路子，再全量铺 115。
// 用法：node scripts/pilot_woodcut.js       （带锚点做风格参考）
//      REF=0 node scripts/pilot_woodcut.js  （纯文本对照）
// 输出：assets/images/cards/_pilot/*.png
// ============================================================

const API_KEY = process.env.API_KEY || '';
const API_HOST = 'api.cometapi.com';
const API_PATH = '/v1/chat/completions';
const MODEL_NAME = 'gemini-3.1-flash-image-preview';

const USE_REFERENCE = process.env.REF !== '0';
const ANCHOR_PATH = path.join(__dirname, '../web/public/images/style-anchor.jpeg');
const OUTPUT_DIR = path.join(__dirname, '../assets/images/cards/_pilot');

// 套色木刻风格后缀（对齐 style-anchor + PRD 配色）
const WOODCUT_SUFFIX =
  'Bold Chinese revolutionary-era woodcut linocut relief print. Thick hand-carved black ink ' +
  'outlines, flat color fields, dense parallel hatching for shadow. Strictly limited palette: ' +
  'warm kraft ochre paper background, deep ink black, a single rust-red spot accent. High ' +
  'contrast, graphic poster look, single clear focal subject, generous negative space, worn ' +
  'paper texture with deckled torn edges, mimeograph archive feel. Vertical 2:3 portrait ' +
  'composition. No text, no letters, no signature, no modern objects, no gradients, no photorealism.';

// 9 张打样：{id, label(文件名用), quote(给你对照), scene(英文意象)}
const PILOT = [
  // —— 形势 ——
  { id: 'S03', label: '星星之火', quote: '星星之火，可以燎原',
    scene: 'A single small bright campfire flame at the center of vast dark mountain silhouettes ' +
      'at night; far on the horizon a thin sliver of a rising sun breaks through; the flame and ' +
      'the dawn glow are the only rust-red accents.' },
  { id: 'S_maodun', label: '主要矛盾迎刃', quote: '捉住了这个主要矛盾，一切问题就迎刃而解了',
    scene: 'A sharp blade cleaving straight through the center of one big tangled knot of rope, ' +
      'the knot splitting open; the cutting edge glints a single rust-red line.' },
  { id: 'S_diqiang', label: '敌强我弱', quote: '敌强我弱，我有灭亡的危险',
    scene: 'A huge looming black mass of rock and shadow pressing down over one tiny lone spark of ' +
      'light at a cliff edge; overwhelming contrast of scale; the spark is rust-red.' },
  // —— 方针 ——
  { id: 'G02', label: '纸老虎', quote: '一切反动派都是纸老虎',
    scene: 'A huge ferocious tiger that is actually a hollow paper lantern shell, its frame ' +
      'showing through, edges torn and curling, pasted with faint old newsprint; one crack ' +
      'glows rust-red from inside.' },
  { id: 'G01', label: '枪杆子', quote: '枪杆子里面出政权',
    scene: 'A single rifle standing upright, planted firmly into the ground like a boundary ' +
      'stone, a strip of rust-red cloth tied around the barrel; vast kraft-paper negative space.' },
  { id: 'G_baocun', label: '保存消灭', quote: '保存自己消灭敌人的原则，是一切军事原则的根据',
    scene: 'A heavy shield and a sharp spear overlapped into one emblem, shield guarding while ' +
      'spear strikes; the spearhead tipped rust-red.' },
  // —— 行动 ——
  { id: 'A02', label: '断其一指', quote: '伤其十指不如断其一指',
    scene: 'One deep clean groove carved all the way through, beside ten shallow broken useless ' +
      'scratches for contrast; the deep groove bottom shows a rust-red line.' },
  { id: 'A03', label: '梨子滋味', quote: '你要知道梨子的滋味，你就得变革梨子，亲口吃一吃',
    scene: 'A single pear with one bite taken out of it, the cross-section grain clearly carved, ' +
      'resting on a rough wooden table; the bite and core show a touch of rust-red.' },
  { id: 'A_diaocha', label: '没有调查', quote: '没有调查，没有发言权',
    scene: 'A magnifying glass and an open field notebook pressed onto an old map, muddy footprints ' +
      'beside them; one marked point on the map is rust-red.' },
  { id: 'A_yugong', label: '下定决心', quote: '下定决心，不怕牺牲，排除万难，去争取胜利',
    scene: 'A worn mattock struck firmly into the rocky foot of two towering mountains, a faint ' +
      'freshly-dug path already begun up the slope; the blade edge is rust-red.' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function buildContent(prompt) {
  if (!USE_REFERENCE) return prompt;
  const b64 = fs.readFileSync(ANCHOR_PATH).toString('base64');
  return [
    { type: 'text', text:
      'Use the attached image ONLY as a style reference (woodcut technique, palette, paper ' +
      'texture, composition feel). Do NOT copy its subject. New subject: ' + prompt },
    { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${b64}` } },
  ];
}

function generate(prompt, filename) {
  const payload = JSON.stringify({ model: MODEL_NAME, messages: [{ role: 'user', content: buildContent(prompt) }] });
  const options = { hostname: API_HOST, path: API_PATH, method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` } };
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.error) return reject(new Error(json.error.message || JSON.stringify(json.error)));
          const content = json.choices && json.choices[0] && json.choices[0].message.content;
          if (!content) return reject(new Error('no choices: ' + body.slice(0, 300)));
          const dm = content.match(/data:image\/[^;]+;base64,([^)\s"]+)/);
          if (dm) { fs.writeFileSync(filename, Buffer.from(dm[1], 'base64')); return resolve('base64'); }
          const um = content.match(/https?:\/\/[^)\s"]+\.(?:png|jpe?g|webp)/i);
          if (um) { https.get(um[0], (r2) => { const f = fs.createWriteStream(filename); r2.pipe(f); f.on('finish', () => f.close(() => resolve('url'))); }).on('error', reject); return; }
          reject(new Error('no image: ' + content.slice(0, 200)));
        } catch (e) { reject(new Error(e.message + ' | ' + body.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`木刻打样 9 张 · 参考图: ${USE_REFERENCE ? '开' : '关'}`);
  for (const c of PILOT) {
    const out = path.join(OUTPUT_DIR, `${c.id}_${c.label}.png`);
    process.stdout.write(`\n[${c.id}] ${c.quote} ... `);
    try { const how = await generate(`${c.scene} ${WOODCUT_SUFFIX}`, out); console.log(`✓ (${how})`); }
    catch (e) { console.log(`✗ ${e.message}`); }
    await sleep(3000);
  }
  console.log('\n打样结束 → assets/images/cards/_pilot/');
}
main();
