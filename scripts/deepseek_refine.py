# -*- coding: utf-8 -*-
"""deepseek-reasoner 逐张批改 v2 解读：判定 保留/改进，弱的给新版+原因。
读 data/语录卡_v2.json → 写 data/语录卡_v3.json + 语录卡_v3.md（含批注）。
"""
import json, os, urllib.request, time, re
ROOT="/Users/huanghaibin/Workspace/games/wildfire"
KEY=os.environ["DEEPSEEK_API_KEY"]
deck=json.load(open(f"{ROOT}/data/语录卡_v2.json",encoding="utf-8"))

system=(
"你是《星火》产品的资深主笔，正在严格批改下属写的卡牌文案。产品是 AI 战略抽卡：用户抽【形势】【方针】【行动】三张，"
"每张卡本体是一句毛泽东原话，配‘处境’(把原话接到用户当下真实处境)和‘行动’(今天能做的事)。\n"
"【人设】冷静、克制、长期主义的战略参谋。受众在真实竞争里：商业/职场/学习/创业，有真实对手。\n"
"【判定弱的标准】只要满足任一即为‘改进’：① 处境只是把原话翻译/复述一遍，没接到现代具体场景；"
"② 空泛、正确的废话，无对手/无代价/无场景，对号入座不了；③ 行动是‘做X表、检查X程度、规划X、量化X’这类KPI黑话或抽象名词；"
"④ 语义跑偏或读起来别扭。\n"
"【改进的硬标准】处境≤38字：必须点出一个具体的现代竞争场景或对手或代价，有刺、像参谋冷冷点醒你，绝不复述原话、绝不喊口号；"
"行动4到10字：今天/本周能落地的具体动作，是动词开头的真动作，不是名词堆。\n"
"【按卡类】形势=冷冷点破他真实的处境/格局(不给方案)；方针=给打法大方向；行动=给今天能做的具体动作。\n"
"【禁用词】命中注定、宇宙、能量、好运、你一定会成功、加油。\n"
"【输出】严格输出 JSON 数组，元素：{\"id\":原样,\"verdict\":\"保留\"或\"改进\","
"\"chujing\":处境(保留则原样回填,改进则新版),\"xingdong\":行动(同理),\"why\":\"改进时一句话说原版弱在哪;保留则留空\"}。只输出 JSON。"
)

def call(cards):
    lines=[f'{c["id"]}｜{c["cat"]}｜原话:{c["quote"]}（{c["src"]}）｜现处境:{c["chujing"]}｜现行动:{c["xingdong"]}' for c in cards]
    user="逐张批改下面 %d 张（保持id对应，逐条给verdict）：\n\n%s"%(len(cards),"\n".join(lines))
    body=json.dumps({"model":"deepseek-reasoner",
        "messages":[{"role":"system","content":system},{"role":"user","content":user}],
        "max_tokens":16000}).encode()
    req=urllib.request.Request("https://api.deepseek.com/chat/completions",data=body,
        headers={"Content-Type":"application/json","Authorization":f"Bearer {KEY}"})
    j=json.loads(urllib.request.urlopen(req,timeout=900).read())
    c=j["choices"][0]["message"]["content"]
    u=j.get("usage",{})
    m=re.search(r'\[.*\]',c,re.S)
    return json.loads(m.group(0) if m else c), u

# 分块（每块≈18）
batches=[deck[i:i+18] for i in range(0,len(deck),18)]
res={}
for bi,b in enumerate(batches,1):
    print(f"[批 {bi}/{len(batches)}] reasoner 批改 {len(b)} 张 ...")
    t0=time.time()
    try:
        arr,u=call(b)
        for x in arr: res[x["id"]]=x
        改=sum(1 for x in arr if x.get("verdict")=="改进")
        print(f"  完成 {len(arr)} 张, 改进 {改}, 用时 {time.time()-t0:.0f}s, tokens={u.get('total_tokens')}")
    except Exception as e:
        print(f"  失败: {e}")
    time.sleep(1)

out=[]; changed=0
for c in deck:
    r=res.get(c["id"],{})
    v=r.get("verdict","保留")
    new_cj=r.get("chujing") or c["chujing"]
    new_xd=r.get("xingdong") or c["xingdong"]
    if v=="改进" and (new_cj!=c["chujing"] or new_xd!=c["xingdong"]): changed+=1
    out.append({**c,"verdict":v,"old_chujing":c["chujing"],"old_xingdong":c["xingdong"],
                "chujing":new_cj,"xingdong":new_xd,"why":r.get("why","")})
json.dump(out,open(f"{ROOT}/data/语录卡_v3.json","w",encoding="utf-8"),ensure_ascii=False,indent=2)

md=["# 星火 · 语录卡 v3（reasoner 逐张批改）\n",
    f"> 共 {len(out)} 张，改进 {changed} 张。改进项标 🔧 并附‘原→新’与原因。\n"]
for cat in ["形势","方针","行动"]:
    items=[d for d in out if d["cat"]==cat]
    md.append(f"\n## {cat}（{len(items)}）\n")
    for d in items:
        flag="🔧" if d["verdict"]=="改进" and (d["chujing"]!=d["old_chujing"] or d["xingdong"]!=d["old_xingdong"]) else ""
        md.append(f"**{d['id']} 「{d['quote']}」** —《{d['src']}》{d['tier']} {flag}")
        md.append(f"- 处境：{d['chujing']}　｜　行动：{d['xingdong']}")
        if flag:
            md.append(f"  - ↳ 原：{d['old_chujing']}｜{d['old_xingdong']}（{d['why']}）")
        md.append("")
open(f"{ROOT}/语录卡_v3.md","w",encoding="utf-8").write("\n".join(md)+"\n")
print(f"\n总计 {len(out)} 张，改进 {changed} 张 → data/语录卡_v3.json, 语录卡_v3.md")
