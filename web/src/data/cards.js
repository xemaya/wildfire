// 星火 Wildfire — 30 cards · 6 systems × 5
// Source for each desc is locked to a Mao quote; vol = 毛选卷号.

export const SYSTEMS = {
  situation:     { cn: '局势', en: 'Situation',     sym: '局' },
  strategy:      { cn: '战略', en: 'Strategy',      sym: '略' },
  action:        { cn: '行动', en: 'Action',        sym: '行' },
  morale:        { cn: '情绪', en: 'Morale',        sym: '情' },
  organization:  { cn: '组织', en: 'Organization',  sym: '组' },
  contradiction: { cn: '矛盾', en: 'Contradiction', sym: '矛' },
}

export const SYSTEM_KEYS = Object.keys(SYSTEMS)

/** Cards grouped by system — draw picks 3 distinct system keys then 1 card per system. */
export const CARDS_BY_SYSTEM = {
  situation: [
    { id: 'sit-01', title: '持久战',   vol: '卷 二', desc: '我们的战争方针，就是持久战。',                                  action: '不寻速胜' },
    { id: 'sit-02', title: '敌强我弱', vol: '卷 一', desc: '战略上以一当十，战术上以十当一。',                              action: '局部多打少' },
    { id: 'sit-03', title: '战略相持', vol: '卷 二', desc: '我之准备反攻的时期，是敌人最困难、我也最困难的时期。',          action: '守住节奏' },
    { id: 'sit-04', title: '星星之火', vol: '卷 一', desc: '星星之火，可以燎原。',                                          action: '别忽视小机' },
    { id: 'sit-05', title: '不轻不丧', vol: '卷 二', desc: '亡国论是错误的，速胜论也是错误的。',                            action: '不慌不轻敌' },
  ],
  strategy: [
    { id: 'str-01', title: '集中兵力', vol: '卷 四', desc: '集中优势兵力，各个歼灭敌人。',                                  action: '别开多线' },
    { id: 'str-02', title: '没有调查', vol: '卷 一', desc: '没有调查，没有发言权。',                                        action: '先看后动' },
    { id: 'str-03', title: '实事求是', vol: '卷 三', desc: '一切从实际出发，理论联系实际。',                                action: '别空谈' },
    { id: 'str-04', title: '团结一切', vol: '卷 二', desc: '团结一切可以团结的力量。',                                      action: '别单干' },
    { id: 'str-05', title: '群众路线', vol: '卷 三', desc: '从群众中来，到群众中去。',                                      action: '听一线' },
  ],
  action: [
    { id: 'act-01', title: '十六字诀', vol: '卷 一', desc: '敌进我退，敌驻我扰，敌疲我打，敌退我追。',                      action: '顺势而动' },
    { id: 'act-02', title: '保存自己', vol: '卷 一', desc: '保存自己，消灭敌人。',                                          action: '别拼消耗' },
    { id: 'act-03', title: '无备不战', vol: '卷 一', desc: '不打无准备之仗，不打无把握之仗。',                              action: '没准备不动' },
    { id: 'act-04', title: '诱敌深入', vol: '卷 一', desc: '退却中的诱敌深入，是为了便于反攻。',                            action: '让步换主动' },
    { id: 'act-05', title: '积极防御', vol: '卷 一', desc: '积极防御，又叫攻势防御，是为了反攻的防御。',                    action: '守为反' },
  ],
  morale: [
    { id: 'mor-01', title: '谦虚谨慎', vol: '卷 四', desc: '务必使同志们继续地保持谦虚、谨慎、不骄、不躁的作风。',          action: '别飘' },
    { id: 'mor-02', title: '排除万难', vol: '卷 三', desc: '下定决心，不怕牺牲，排除万难，去争取胜利。',                    action: '走过这段' },
    { id: 'mor-03', title: '学会未懂', vol: '卷 三', desc: '我们能够学会我们原来不懂的东西。',                              action: '不会就学' },
    { id: 'mor-04', title: '丢掉幻想', vol: '卷 四', desc: '丢掉幻想，准备斗争。',                                          action: '别等救星' },
    { id: 'mor-05', title: '路途曲折', vol: '卷 三', desc: '前途是光明的，道路是曲折的。',                                  action: '弯路也走完' },
  ],
  organization: [
    { id: 'org-01', title: '根据地',     vol: '卷 二', desc: '没有根据地的游击战争是不能持久的。',                                    action: '先建后方' },
    { id: 'org-02', title: '兵民为本',   vol: '卷 二', desc: '兵民是胜利之本。',                                                      action: '别脱离群众' },
    { id: 'org-03', title: '整顿三风',   vol: '卷 三', desc: '反对主观主义以整顿学风，反对宗派主义以整顿党风，反对党八股以整顿文风。', action: '内部清理' },
    { id: 'org-04', title: '为人民服务', vol: '卷 三', desc: '为人民服务。',                                                          action: '不为己' },
    { id: 'org-05', title: '自己动手',   vol: '题 词', desc: '自己动手，丰衣足食。',                                                  action: '别等外援' },
  ],
  contradiction: [
    { id: 'con-01', title: '主要矛盾', vol: '卷 一', desc: '矛盾着的两方面，必有一方是主要的，他方是次要的。',              action: '抓主放次' },
    { id: 'con-02', title: '对立统一', vol: '卷 一', desc: '矛盾着的对立面又统一，又斗争。',                                action: '别非黑即白' },
    { id: 'con-03', title: '量变质变', vol: '卷 一', desc: '事物的发展是由量变到质变的过程。',                              action: '等待临界' },
    { id: 'con-04', title: '内因外因', vol: '卷 一', desc: '事物发展的根本原因，在于事物内部的矛盾性。',                    action: '别归咎外因' },
    { id: 'con-05', title: '主次转化', vol: '卷 一', desc: '矛盾的主要方面和非主要方面互相转化着。',                        action: '形势会变' },
  ],
}

/** Flat list of all 30 cards, each tagged with its system key. */
export const ALL_CARDS = SYSTEM_KEYS.flatMap(sysKey =>
  CARDS_BY_SYSTEM[sysKey].map(c => ({ ...c, system: sysKey }))
)

/** Shuffle helper (Fisher-Yates, non-crypto). */
function shuffle (arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Draw 3 cards. PRD lock: pick 3 DISTINCT systems, then 1 card from each.
 * Same-system duplicates forbidden. Returns 3 cards in shuffled order.
 */
export function drawThree () {
  const chosenSystems = shuffle(SYSTEM_KEYS).slice(0, 3)
  return chosenSystems.map(sysKey => {
    const pool = CARDS_BY_SYSTEM[sysKey]
    const card = pool[Math.floor(Math.random() * pool.length)]
    return { ...card, system: sysKey }
  })
}
