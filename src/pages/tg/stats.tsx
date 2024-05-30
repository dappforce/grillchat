import StatsPage from '@/modules/telegram/StatsPage'
import { AppCommonProps } from '@/pages/_app'
import { getCommonStaticProps } from '@/utils/page'

export const getStaticProps = getCommonStaticProps<AppCommonProps>(
  () => ({
    head: {
      title: 'EPIC - A Meme-to-Earn Platform',
      description: 'Earn meme coins 💰 by posting and liking memes 🤣',
      disableZoom: true,
    },
  }),
  async () => {
    return {
      props: {},
    }
  }
)

export default StatsPage
