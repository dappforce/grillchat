export const CHAT_PER_PAGE = 50
export const ESTIMATED_ENERGY_FOR_ONE_TX = 100_000_000

export const TOPIC_TO_ROOM_ID_MAP = {
  subid: '1005',
} satisfies Record<string, string>
export const ROOM_ID_TO_TOPIC_MAP = Object.entries(TOPIC_TO_ROOM_ID_MAP).reduce(
  (acc, [topic, roomId]) => {
    acc[roomId] = topic
    return acc
  },
  {} as Record<string, string>
)
