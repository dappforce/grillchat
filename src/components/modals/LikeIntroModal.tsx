import Diamond from '@/assets/emojis/diamond.png'
import HandPoint from '@/assets/graphics/hand-point.svg'
import LikeButtonImage from '@/assets/graphics/like-button.png'
import { getTokenomicsMetadataQuery } from '@/services/datahub/content-staking/query'
import { useSendEvent } from '@/stores/analytics'
import { LocalStorage } from '@/utils/storage'
import { formatNumber } from '@/utils/strings'
import { PostData } from '@subsocial/api/types'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import SlotCounter from 'react-slot-counter'
import Button from '../Button'
import Card from '../Card'
import ImageChatItem from '../extensions/image/ImageChatItem'
import Modal from './Modal'

const hasOpenedModal = new LocalStorage(() => 'has-opened-like-intro-modal')
const DUMMY_MESSAGES: { message: PostData; superLikeCount: number }[] = [
  {
    message: {
      id: '0x123',
      struct: {
        id: '0x123',
        createdAtBlock: 0,
        createdAtTime: dayjs().subtract(1, 'day').toDate().getTime(),
        createdByAccount: '0x123',
        downvotesCount: 0,
        hidden: false,
        isComment: true,
        isRegularPost: true,
        isSharedPost: false,
        ownerId: '0x123',
        rootPostId: '0x123',
        upvotesCount: 0,
      },
      content: {
        body: '',
        canonical: '',
        image: '',
        isShowMore: false,
        summary: '',
        tags: [],
        title: '',
        extensions: [
          {
            id: 'subsocial-image',
            properties: {
              image:
                'bafybeia2mhukwxqb4gifjs63sgtoc5flcskizemmamwwc3eq6q7ftihlo4',
            },
          },
        ],
      },
    },
    superLikeCount: 52,
  },
  {
    message: {
      id: '0x123',
      struct: {
        id: '0x123',
        createdAtBlock: 0,
        createdAtTime: dayjs().subtract(1, 'day').toDate().getTime(),
        createdByAccount: '0x123',
        downvotesCount: 0,
        hidden: false,
        isComment: true,
        isRegularPost: true,
        isSharedPost: false,
        ownerId: '0x123',
        rootPostId: '0x123',
        upvotesCount: 0,
      },
      content: {
        body: '',
        canonical: '',
        image: '',
        isShowMore: false,
        summary: '',
        tags: [],
        title: '',
        extensions: [
          {
            id: 'subsocial-image',
            properties: {
              image:
                'bafybeie3vdprrn4exypqyb36t3r3ua2jmv2fnh6oy5rh5knwcljij7q4h4',
            },
          },
        ],
      },
    },
    superLikeCount: 30,
  },
]

export default function LikeIntroModal() {
  const [step, setStep] = useState(0)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [hasILiked, setHasILiked] = useState(false)
  const { data: tokenomics } = getTokenomicsMetadataQuery.useQuery(null)

  const sendEvent = useSendEvent()
  const [isOpenModal, setIsOpenModal] = useState(false)
  useEffect(() => {
    const hasVisited = hasOpenedModal.get() === 'true'
    if (!hasVisited) {
      sendEvent('like_intro_modal_opened')
      setIsOpenModal(true)
    }
  }, [sendEvent])

  const splitted = useMemo(
    () => formatNumber(pointsEarned).split(''),
    [pointsEarned]
  )
  const current = DUMMY_MESSAGES[step]

  const pointsPerLike = tokenomics
    ? (tokenomics.likerRewardDistributionPercent / 100) *
      Number(tokenomics.superLikeWeightPoints)
    : 4000

  const isFinished = !current

  return (
    <Modal
      isOpen={isOpenModal}
      closeModal={() => undefined}
      title={
        isFinished ? 'Good job! Keep liking!' : 'Earn Points by liking memes!'
      }
      description={
        isFinished ? null : (
          <span>
            To get your Points for liking a meme, simply tap on{' '}
            <Image
              src={LikeButtonImage}
              alt=''
              className='inline-block h-[22px] w-auto'
            />{' '}
            below the meme.
          </span>
        )
      }
    >
      {isFinished ? (
        <div className='mt-2 flex flex-col gap-6'>
          <Card className='flex flex-col items-center gap-2 text-center'>
            <span className='font-medium text-text-muted'>
              For liking 2 memes you earned:
            </span>
            <div className='flex items-center gap-2.5'>
              <Image src={Diamond} alt='' className='h-11 w-11' />
              <span className='flex items-center text-4xl font-bold'>
                {formatNumber(pointsPerLike * DUMMY_MESSAGES.length)}
              </span>
            </div>
          </Card>
          <Button
            className='w-full'
            size='lg'
            onClick={() => {
              sendEvent('finish_like_intro_modal')
              setIsOpenModal(false)
              hasOpenedModal.set('true')
            }}
          >
            See More Memes
          </Button>
        </div>
      ) : (
        <>
          <div className='relative'>
            <ImageChatItem
              message={current.message}
              chatId='0x123'
              hubId='0x123'
              className='max-w-none'
              bg='background-lighter'
              dummySuperLike={{
                className: 'outline-none',
                disabled: !tokenomics,
                hasILiked,
                superLikeCount: current.superLikeCount + (hasILiked ? 1 : 0),
                onClick: () => {
                  if (hasILiked) return

                  sendEvent('like_intro_modal_meme', { step: step + 1 })
                  setHasILiked(true)
                  setPointsEarned((prev) => prev + pointsPerLike)
                  setTimeout(() => {
                    setStep((prev) => prev + 1)
                    setHasILiked(false)
                  }, 1000)
                },
              }}
            />
            <HandPoint className='pointer-events-none absolute -bottom-5 left-11 animate-pulse' />
          </div>
          <div className='mt-6 flex flex-col items-center gap-2 text-center'>
            <span className='font-medium text-text-muted'>Points earned</span>
            <div className='flex items-center gap-2.5'>
              <Image src={Diamond} alt='' className='h-11 w-11' />
              <span className='flex items-center text-4xl font-bold'>
                <SlotCounter
                  containerClassName='relative -top-1.5'
                  value={splitted}
                  animateOnVisible={false}
                  sequentialAnimationMode
                  startValueOnce
                  startValue={'0'}
                />
              </span>
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
