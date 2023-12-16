//@ts-nocheck
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

export default function ShareButtons({ url }: any) {
  const [isUrlCopied, setisUrlCopied] = useState(false)
  const { toast } = useToast()
  // handle copy url
  const copyToClipboard = async (text: any) => {
    try {
      await navigator.clipboard.writeText(text)
      setisUrlCopied(true)
      toast({
        title: 'link copied',
        description: 'Link copied to clipboard',
      })
      console.log('copied')
      setTimeout(() => {
        setisUrlCopied(false)
      }, 2000)
    } catch (err) {
      alert('Failed to copy: ', err)
    }
  }
  return (
    <div>
      <div className='flex gap-2'>
        <TwitterShareButton url={url}>
          <TwitterIcon size={35} round={true} />
        </TwitterShareButton>
        <FacebookShareButton url={url}>
          <FacebookIcon size={35} round={true} />
        </FacebookShareButton>
        <LinkedinShareButton url={url}>
          <LinkedinIcon size={35} round={true} />
        </LinkedinShareButton>
        <PinterestShareButton url={url} media=''>
          <PinterestIcon size={35} round={true} />
        </PinterestShareButton>
        <RedditShareButton url={url}>
          <RedditIcon size={35} round={true} />
        </RedditShareButton>
        <TelegramShareButton url={url}>
          <TelegramIcon size={35} round={true} />
        </TelegramShareButton>

        <WhatsappShareButton url={url}>
          <WhatsappIcon size={35} round={true} />
        </WhatsappShareButton>
      </div>

      <div className='mt-3 flex items-center justify-between rounded-lg border border-gray-200 px-2  py-1 dark:border-gray-700'>
        <p className='text-sm'>{url}</p>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-6 w-6 cursor-pointer'
          onClick={() => copyToClipboard(url)}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184'
          />
        </svg>
      </div>
    </div>
  )
}
