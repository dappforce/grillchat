import Button from '@/components/Button'
import { ContentProps } from '../../types'

export default function TelegramNotificationContent({
  ...props
}: ContentProps) {
  return <Button size='lg'>Connect Telegram</Button>
}
