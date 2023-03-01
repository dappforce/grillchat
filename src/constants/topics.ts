const topics = {
  bitcoin: '226',
  ethereum: '355',
}
export function getTopicId(topic: keyof typeof topics) {
  return topics[topic] ?? '226'
}
