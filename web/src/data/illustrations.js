// Card illustration map: card id -> public image path.
// Drop new woodcut files into web/public/images/cards/ and add the id here.
// Cards without an entry render a tasteful kraft placeholder.

export const ILLUSTRATIONS = {
  'sit-01': '/images/cards/sit-01.jpeg', // 持久战
}

export function illustrationFor (cardId) {
  return ILLUSTRATIONS[cardId] || null
}
