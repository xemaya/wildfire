const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/cards.json');
const cardsData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

let md = '# 150张卡牌立意与 Prompt 全量审核\n\n';
md += '> [!NOTE]\n> 以下是所有卡牌的“立意”和最终发送给生图大模型的英文 Prompt，请您审阅。您可以指出哪些类别的立意过于单调或不符合预期。\n\n';

for (const [catName, catData] of Object.entries(cardsData)) {
    md += `## ${catName} (${catData.en})\n\n`;
    catData.cards.forEach(card => {
        md += `### ${card.title}\n`;
        md += `**立意**: ${card.imageConcept || '暂无 (未生成)'}\n\n`;
        md += `**Prompt**: \`${card.prompt || '暂无 (未生成)'}\`\n\n`;
    });
    md += '---\n\n';
}

const outPath = '/Users/huanghaibin/.gemini/antigravity/brain/49cc4305-d03e-4582-8156-97d476ae591a/all_prompts_review.md';
fs.writeFileSync(outPath, md, 'utf8');
console.log('Markdown successfully generated.');
