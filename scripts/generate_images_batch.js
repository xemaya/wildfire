const fs = require('fs');
const path = require('path');
const https = require('https');

// ================= 配置区域 =================
// 推荐使用：智谱 AI (CogView-3) —— 目前国内性价比最高
const API_KEY = process.env.API_KEY || '';
const API_URL = 'https://api.cometapi.com/v1/chat/completions';
const MODEL_NAME = 'gemini-3.1-flash-image-preview'; // 中转站模型

// 输出目录
const OUTPUT_DIR = path.join(__dirname, '../assets/images/cards');
// 数据输入
const DATA_FILE = path.join(__dirname, '../data/cards.json');

// 全局风格后缀 (V2 革命时代版)
const STYLE_SUFFIX = "A vintage rough pencil sketch from the 1930s Chinese revolutionary era. Sepia tone, mimeograph print style, worn paper texture. Monochromatic, high contrast, old historical document aesthetic. No text, no letters.";

// ===========================================

// 延时函数，防止触发并发限制
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateImage(prompt, filename) {
    console.log(`\n[生图请求] 开始生成: ${filename}`);
    
    const requestData = JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt }]
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(API_URL, options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', async () => {
                try {
                    const response = JSON.parse(body);
                    if (response.error) {
                        return reject(new Error(response.error.message));
                    }
                    if (response.choices && response.choices.length > 0) {
                        const content = response.choices[0].message.content;
                        // Extract base64 image from markdown ![image](data:image/jpeg;base64,....)
                        const match = content.match(/data:image\/[^;]+;base64,([^\)]+)/);
                        if (match && match[1]) {
                            const base64Data = match[1];
                            const buffer = Buffer.from(base64Data, 'base64');
                            fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
                            console.log(`[成功] 图片已保存至: ${filename}`);
                            resolve(true);
                        } else {
                            reject(new Error("未在返回值中找到 base64 图片数据"));
                        }
                    } else {
                        reject(new Error("未返回有效的 choices 结果"));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(requestData);
        req.end();
    });
}

async function downloadImage(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
                console.log(`[完成] 图片已保存至: ${destPath}`);
            });
        }).on('error', (err) => {
            fs.unlink(destPath, () => {});
            reject(err);
        });
    });
}

async function main() {
    if (API_KEY === 'your_zhipu_api_key_here') {
        console.error("❌ 错误: 请先在代码中替换 API_KEY，或设置 ZHIPU_API_KEY 环境变量！");
        process.exit(1);
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const cardsData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    let allCards = [];
    // Flatten the nested JSON structure
    for (const catKey in cardsData) {
        if (cardsData[catKey] && cardsData[catKey].cards) {
            allCards = allCards.concat(cardsData[catKey].cards);
        }
    }

    console.log(`共读取到 ${allCards.length} 张卡牌数据，准备开始批量生成...`);

    let generatedCount = 0;

    for (let i = 0; i < allCards.length; i++) {
        const card = allCards[i];
        const filename = `bg_${card.title}.png`;
        const destPath = path.join(OUTPUT_DIR, filename);

        if (fs.existsSync(destPath)) {
            console.log(`[跳过] ${filename} 已存在。`);
            continue;
        }

        // 这里需要你提前为每张卡写好一个英文版的 concept (图的立意描述)
        // 假设我们在数据结构里新增了一个字段 "imageConcept"
        // 如果没有，程序会用卡片名作为占位符，但效果会大打折扣！
        const concept = card.imageConcept || `Visual metaphor for ${card.title} in Chinese revolutionary context.`;
        const finalPrompt = `${concept} ${STYLE_SUFFIX}`;

        try {
            await generateImage(finalPrompt, filename);
            generatedCount++;
            // 每次请求后休眠 3 秒，避免触发 API 频控 (429 Error)
            await sleep(3000); 
        } catch (error) {
            generatedCount++; // 失败也计入次数，防止无限重试耗尽 API 额度
            console.error(`[失败] 生成 ${filename} 时发生错误: ${error.message}`);
            // 出错时暂停长一点再继续
            await sleep(10000); 
        }
    }

    console.log("\n✅ 批量生图任务结束！");
}

main();
