const topics = {
  bitcoin: '226',
  ethereum: '355',
}
export function isSupportedTopic(topic: string): topic is keyof typeof topics {
  return topic in topics
}
export function getTopicId(topic: keyof typeof topics) {
  return topics[topic]
}
