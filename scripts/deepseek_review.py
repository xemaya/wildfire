# -*- coding: utf-8 -*-
"""Phase 3: 用 deepseek-reasoner 批判性评审 cards_v2.json。
依据 references/核心思想.md，逐项检查：名字毛选正统性 / 立意是否准确有据 /
画面是否落政宣·红色文创·雷同·穿帮 / 是否丑化战士 / 尺度匹配 / 木刻适配。
输出 references/deepseek评审.md。
"""
import json, os, urllib.request, time

ROOT="/Users/huanghaibin/Workspace/games/wildfire"
KEY=os.environ["DEEPSEEK_API_KEY"]
principles=open(f"{ROOT}/references/核心思想.md",encoding="utf-8").read()
data=json.load(open(f"{ROOT}/data/cards_v2.json",encoding="utf-8"))

lines=[]
for cat,cd in data.items():
    lines.append(f"\n## {cat}({cd['en']})")
    for c in cd["cards"]:
        old=f"（原名{c['oldTitle']}）" if c.get("oldTitle") else ""
        lines.append(f"{c['id']} 【{c['title']}】{old} 出处:{c['src']} | 立意:{c['intent']} | 画面:{c['scene']}")
cards_text="\n".join(lines)

system=(
"你是三重身份的严格评审：①毛泽东著作/中共党史研究者；②资深视觉/插画总监（套色木刻版画方向）；"
"③挑剔的产品评审。被评审对象是一款名为《星火》的‘AI战略抽卡’产品的 150 张卡牌——它把毛选战略思想"
"转译为现代处境分析，不是占卜、不是鸡汤、不是政宣。每张卡有：卡名、出处(挂到毛选核心思想)、立意、画面(将用于生图)。\n"
"产品红线：①不得是政宣风/红色文创；②画面美术风格是‘战时参谋部’套色木刻(牛皮纸黄+铁锈红+墨黑)；"
"③困境/负面/认知错误卡不应出现战士的正面英雄形象或狼狈出丑形象，应以物件/地形/态势/符号承载；"
"④卡名必须是毛泽东思想/毛选的正统术语，禁用三十六计、孙子兵法、通用成语；⑤立意必须真实有据。\n"
"请用最挑剔、最具体的眼光评审，宁可严苛。不要逐张夸奖，只聚焦问题。"
)
user=(
"下面是【评审依据：毛选核心思想索引】，所有卡的出处都应能在此找到支撑：\n\n"
f"{principles}\n\n"
"========\n下面是【待评审的 150 张卡】：\n"
f"{cards_text}\n\n"
"========\n请输出评审报告，结构如下（用中文）：\n"
"一、总体判断（3-5句：整体质量、最严重的系统性问题）。\n"
"二、必须修改的卡（按严重度排序的表格：| id | 卡名 | 问题类型 | 具体问题 | 修改建议 |）。"
"问题类型从中选择：[非毛选正统/出处不符][立意不准][画面落政宣或红色文创][画面雷同][画面穿帮或时代错误]"
"[出现/丑化战士违反规则][尺度不匹配][木刻难表现][卡名重复]。只列真正有问题的，按重要性排，尽量找全。\n"
"三、跨卡系统性问题（雷同扎堆、覆盖空白、6 系统划分是否合理、是否有该补的重要毛选概念被漏掉）。\n"
"四、给生图的画面通用建议（针对套色木刻+牛皮纸黄/铁锈红，如何让 150 张既统一又不撞脸）。"
)

body=json.dumps({
 "model":"deepseek-reasoner",
 "messages":[{"role":"system","content":system},{"role":"user","content":user}],
 "max_tokens":16000,"stream":False
}).encode()

req=urllib.request.Request("https://api.deepseek.com/chat/completions",data=body,
   headers={"Content-Type":"application/json","Authorization":f"Bearer {KEY}"})
print("调用 deepseek-reasoner 中（可能需 1-3 分钟）...")
t0=time.time()
resp=urllib.request.urlopen(req,timeout=600).read()
j=json.loads(resp)
msg=j["choices"][0]["message"]
content=msg.get("content","")
reasoning=msg.get("reasoning_content","")
usage=j.get("usage",{})
out=f"# DeepSeek (reasoner) 卡牌评审报告\n\n> 模型: deepseek-reasoner｜耗时 {time.time()-t0:.0f}s｜tokens: {usage}\n\n{content}\n"
open(f"{ROOT}/references/deepseek评审.md","w",encoding="utf-8").write(out)
print(f"完成，用时 {time.time()-t0:.0f}s, tokens={usage}")
print("报告已存 references/deepseek评审.md\n")
print(content[:1200])
