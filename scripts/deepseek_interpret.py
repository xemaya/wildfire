# -*- coding: utf-8 -*-
"""让 deepseek-chat 为每句毛选原文生成 处境 + 行动（战略参谋语气）。
读 data/quotes_pool.json → 写 data/语录卡_v2.json + 语录卡_v2.md
"""
import json, os, urllib.request, time, re
ROOT="/Users/huanghaibin/Workspace/games/wildfire"
KEY=os.environ["DEEPSEEK_API_KEY"]
pool=json.load(open(f"{ROOT}/data/quotes_pool.json",encoding="utf-8"))

system=(
"你是一款叫《星火》的产品的文案。产品是 AI 战略抽卡：用户抽到三张卡——【形势】【方针】【行动】，"
"对应‘我现在处在什么形势→该用什么指导方针→今天落地做什么’。每张卡的本体是一句毛泽东原话。"
"你的任务：把每句原话翻译成‘现代战略参谋’对当下处境的解读。\n"
"【人设】冷静、克制、长期主义的战略参谋。不安慰、不预测、不喊口号。\n"
"【受众处境】成年人在真实竞争里：商业、职场、学习、创业。竞争是真刀真枪的、有真实对手的，不要洗白成‘对手是你自己’。\n"
"【硬规则】① 不是鸡汤、不是占卜、不是政治宣传。② 必须具体、落地、有刺，不能是‘正确的废话’。"
"③ 禁用词：命中注定、宇宙、能量、好运、你一定会成功、加油。④ 偏好词：战线、节奏、根据地、主动权、风险、推进、消耗、局部。\n"
"【按卡类分工】形势卡=冷冷点破他当下真实的处境/格局(不给方案)；方针卡=给一个打法上的大方向；行动卡=给一个今天就能做的具体动作。\n"
"【输出】严格输出 JSON 数组，每个元素：{\"id\":原样, \"chujing\":一句话≤38字的现代处境解读, \"xingdong\":4到10字的祈使行动}。不要输出任何 JSON 以外的内容。"
)
lines=[f'{c["id"]}｜{c["cat"]}｜{c["quote"]}（{c["src"]}）' for c in pool]
user="逐句解读下面 %d 句（保持 id 对应）：\n\n%s"%(len(pool),"\n".join(lines))

def call(messages,max_tokens=8000):
    body=json.dumps({"model":"deepseek-chat","messages":messages,
                     "max_tokens":max_tokens,"temperature":1.0}).encode()
    req=urllib.request.Request("https://api.deepseek.com/chat/completions",data=body,
        headers={"Content-Type":"application/json","Authorization":f"Bearer {KEY}"})
    return json.loads(urllib.request.urlopen(req,timeout=600).read())

print(f"调用 deepseek-chat 解读 {len(pool)} 句 ...")
t0=time.time()
j=call([{"role":"system","content":system},{"role":"user","content":user}])
content=j["choices"][0]["message"]["content"]
usage=j.get("usage",{})
m=re.search(r'\[.*\]',content,re.S)
arr=json.loads(m.group(0) if m else content)
by={x["id"]:x for x in arr}
miss=[c["id"] for c in pool if c["id"] not in by]
print(f"用时 {time.time()-t0:.0f}s tokens={usage} 解读 {len(arr)}/{len(pool)} 缺:{miss}")

deck=[]
for c in pool:
    d=by.get(c["id"],{})
    deck.append({**c,"chujing":d.get("chujing",""),"xingdong":d.get("xingdong","")})
json.dump(deck,open(f"{ROOT}/data/语录卡_v2.json","w",encoding="utf-8"),ensure_ascii=False,indent=2)

md=["# 星火 · 语录卡 v2（DeepSeek 解读版）\n","> 原文逐字+出处为我所选；处境/行动由 deepseek-chat 解读。三类对应抽三张：形势→方针→行动。\n"]
for cat,pre in [("形势","S"),("方针","G"),("行动","A")]:
    items=[d for d in deck if d["cat"]==cat]
    md.append(f"\n## {cat}（{len(items)}）\n")
    for d in items:
        md.append(f"**{d['id']} 「{d['quote']}」** —《{d['src']}》{d['tier']}")
        md.append(f"- 处境：{d['chujing']}　｜　行动：{d['xingdong']}\n")
open(f"{ROOT}/语录卡_v2.md","w",encoding="utf-8").write("\n".join(md)+"\n")
print("已写 data/语录卡_v2.json 与 语录卡_v2.md")
print("\n抽样预览：")
for cat in ["形势","方针","行动"]:
    d=next(x for x in deck if x["cat"]==cat and x["chujing"])
    print(f"[{cat}] {d['quote']}\n   处境：{d['chujing']}｜行动：{d['xingdong']}")
