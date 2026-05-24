# -*- coding: utf-8 -*-
"""v4：去掉处境/行动两字段，每句只配一句白话解读；普适、不假设身份、不照抄原文。
读 data/quotes_pool.json → 写 data/语录卡_v4.json + 语录卡_v4.md
"""
import json, os, urllib.request, time, re
ROOT="/Users/huanghaibin/Workspace/games/wildfire"
KEY=os.environ["DEEPSEEK_API_KEY"]
pool=json.load(open(f"{ROOT}/data/quotes_pool.json",encoding="utf-8"))

system=(
"你为《星火》写卡牌解读。产品：抽三张毛泽东语录卡——【形势】【方针】【行动】，"
"对应‘我处在什么局面 / 该用什么方针 / 该怎么动’。每张卡=一句毛泽东原话，你为它写【一句】现代白话解读。\n"
"【最重要】① 解读是把这句文言或军事原话‘翻译’成今天的大白话道理——不照抄原话字面、不原样复述。"
"② 受众是任何身处竞争或困境的人（可能在创业、求职、读书、做一件难事），你【不知道也不要假设】他的身份与场景："
"绝不出现‘上班/客户/团队/老板/KPI/项目/合同/公司’这类设定；用普适的词：对手、局面、你想做成的事、眼前的难处、你的根基、节奏、主动权。"
"③ 不要把解读写死成某一个具体情节。\n"
"【按卡类定调】形势卡：冷冷点破他可能正处在一个什么样的局面（只点破，不开方案）；"
"方针卡：指出该用什么样的大方向去打；行动卡：点出该采取什么‘神’的动作（讲清动作的实质，而不是把原话再说一遍）。\n"
"【语气】冷静、克制、长期主义的战略参谋。不安慰、不喊口号、不鸡汤。≤30字，一句话。\n"
"【禁用词】命中注定、宇宙、能量、好运、你一定会成功、加油。\n"
"【输出】严格 JSON 数组，元素：{\"id\":原样,\"jiedu\":一句白话解读}。只输出 JSON，不要任何多余文字。"
)
lines=[f'{c["id"]}｜{c["cat"]}｜{c["quote"]}（{c["src"]}）' for c in pool]
user="逐句写解读（保持 id 对应）：\n\n"+"\n".join(lines)

body=json.dumps({"model":"deepseek-chat",
    "messages":[{"role":"system","content":system},{"role":"user","content":user}],
    "max_tokens":8000,"temperature":1.1}).encode()
req=urllib.request.Request("https://api.deepseek.com/chat/completions",data=body,
    headers={"Content-Type":"application/json","Authorization":f"Bearer {KEY}"})
print(f"调用 deepseek-chat 重生成 {len(pool)} 句（单字段·普适）...")
t0=time.time()
j=json.loads(urllib.request.urlopen(req,timeout=600).read())
content=j["choices"][0]["message"]["content"]; u=j.get("usage",{})
m=re.search(r'\[.*\]',content,re.S)
arr=json.loads(m.group(0) if m else content)
by={x["id"]:x.get("jiedu","") for x in arr}
miss=[c["id"] for c in pool if not by.get(c["id"])]
print(f"用时 {time.time()-t0:.0f}s tokens={u.get('total_tokens')} 解读 {len(arr)} 缺:{miss}")

deck=[{**c,"jiedu":by.get(c["id"],"")} for c in pool]
json.dump(deck,open(f"{ROOT}/data/语录卡_v4.json","w",encoding="utf-8"),ensure_ascii=False,indent=2)
md=["# 星火 · 语录卡 v4（单句解读·普适）\n",
    "> 结构：语录原文 + 出处 + 类别。一句白话解读（类别决定它说形势/方针/行动）。不假设用户身份。\n"]
for cat,pre in [("形势","S"),("方针","G"),("行动","A")]:
    items=[d for d in deck if d["cat"]==cat]
    md.append(f"\n## {cat}（{len(items)}）\n")
    for d in items:
        md.append(f"**{d['id']} 「{d['quote']}」** —《{d['src']}》{d['tier']}")
        md.append(f"- {d['jiedu']}\n")
open(f"{ROOT}/语录卡_v4.md","w",encoding="utf-8").write("\n".join(md)+"\n")
print("已写 data/语录卡_v4.json 与 语录卡_v4.md")
for cat in ["形势","方针","行动"]:
    print(f"\n[{cat}] 抽样：")
    for d in [x for x in deck if x['cat']==cat][:3]:
        print(f"  「{d['quote'][:18]}…」→ {d['jiedu']}")
