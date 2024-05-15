import Button from '@/components/Button'
import Card from '@/components/Card'
import PopOver from '@/components/floating/PopOver'
import { useMyMainAddress } from '@/stores/my-account'
import { copyToClipboard } from '@/utils/strings'
import { useState } from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import epicConfig from '../../../../constants/config/epic'

const { tokenSymbol } = epicConfig

const ReferralSection = () => {
  const myAddress = useMyMainAddress()
  const [isCopied, setIsCopied] = useState(false)

  const onCopyClick = (text: string) => {
    copyToClipboard(text)

    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  const referralLink = `https://epic.com?ref=${myAddress}`

  return (
    <Card className='flex flex-col gap-2 bg-background-light'>
      <PopOver
        yOffset={6}
        panelSize='sm'
        placement='top'
        triggerClassName='w-fit'
        triggerOnHover
        trigger={
          <div className='flex items-start gap-2 md:items-center '>
            <span className='font-semibold'>Earn With Friends</span>
            <HiOutlineInformationCircle className='text-text-muted' />
          </div>
        }
      >
        <p>Some text</p>
      </PopOver>
      <p className='text-sm text-text-muted'>
        Earn ${tokenSymbol} when your friends join Epic using your link:
      </p>
      <div className='flex items-center justify-between gap-2 rounded-xl border border-slate-300 bg-slate-50 p-2'>
        <span className='flex-[1] overflow-hidden text-ellipsis whitespace-nowrap'>
          {referralLink}
        </span>
        <Button
          variant='primaryOutline'
          onClick={() => onCopyClick(referralLink)}
          size={'xs'}
          className='!p-0 !px-3 !py-1 leading-none'
        >
          {isCopied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </Card>
  )
}

export default ReferralSection
