const TOPIC_TO_SPACE_ID_MAP: Record<string, string> = {
  x: '1002',
  polka: '1005',
  nft: '1009',
}
const SPACE_ID_TO_TOPIC_MAP = Object.entries(TOPIC_TO_SPACE_ID_MAP).reduce(
  (acc, [topic, roomId]) => {
    acc[roomId] = topic
    return acc
  },
  {} as Record<string, string>
)
export function getTopicFromSpaceId(spaceId: string) {
  return SPACE_ID_TO_TOPIC_MAP[spaceId] ?? ''
}
export function getSpaceIdFromTopic(topic: string) {
  return TOPIC_TO_SPACE_ID_MAP[topic] ?? ''
}

const LINKED_POST_IDS_FOR_SPACE_ID: Record<string, string[]> = {
  '1005': ['754', '2808'],
}
export function getLinkedPostIdsForSpaceId(spaceId: string) {
  return LINKED_POST_IDS_FOR_SPACE_ID[spaceId] ?? []
}
