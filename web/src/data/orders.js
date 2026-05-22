// 今日军令 · daily order pool
// Short imperative sentences in the cold staff-officer voice.
// Sampled randomly for the home-screen footer + when no AI briefing yet.

export const DAILY_ORDERS = [
  '不要在情绪高涨时发动总攻。',
  '活下来，比赢下来更重要。',
  '先看清，再动手。',
  '弯路也是路。',
  '今日不出阵。',
  '保住后方，再求推进。',
  '别在最累时做决定。',
  '小胜不张扬，小败不慌。',
  '阶段不到，不急于摊牌。',
  '能守一日，就不让一寸。',
  '退是为了进。',
  '没把握的仗，不打。',
]

export function randomOrder () {
  return DAILY_ORDERS[Math.floor(Math.random() * DAILY_ORDERS.length)]
}
