import CoinsImage from '@/assets/graphics/coins.png'
import Button from '@/components/Button'
import FormatBalance from '@/components/FormatBalance'
import { mutedTextColorStyles } from '@/components/content-staking/utils/commonStyles'
import { ZERO } from '@/constants/config'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useMyMainAddress } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { convertToBalanceWithDecimal } from '@subsocial/utils'
import Image from 'next/image'
import { cx } from '../../../utils/class-names'

const IncreaseStakeBanner = () => {
  const myAddress = useMyMainAddress()

  const { data } = getBalancesQuery.useQuery({
    address: myAddress || '',
    chainName: 'subsocial',
  })
  const { decimal } = useGetChainDataByNetwork('subsocial') || {}

  const { freeBalance } = data?.balances['SUB'] || {}

  const balanceValue =
    decimal && freeBalance
      ? convertToBalanceWithDecimal(freeBalance, decimal)
      : ZERO

  const balance = !balanceValue.isZero() ? (
    <>
      <FormatBalance
        value={balanceValue.toString()}
        defaultMaximumFractionDigits={2}
      />{' '}
    </>
  ) : (
    <> </>
  )
  return (
    <div
      className={cx(
        'relative flex h-full w-full flex-col justify-between gap-3 overflow-hidden md:flex-row md:items-center md:gap-2',
        'rounded-2xl border border-[#6366F1]/20 bg-[#EEF2FF] p-4 backdrop-blur-xl dark:border-none dark:bg-[#4F46E5] md:p-6 md:pl-[65px]'
      )}
    >
      <Image
        src={CoinsImage}
        alt=''
        className={cx(
          'md:rotate-y-180 absolute bottom-0 right-0 max-h-[72px] w-full',
          'max-w-[82px] md:bottom-auto md:left-[-26px] md:top-auto '
        )}
      />
      <div className='flex flex-col gap-2'>
        <span className='text-lg font-semibold leading-normal'>
          Increase your daily rewards by locking more SUB
        </span>
        <span className={cx('text-base font-medium', mutedTextColorStyles)}>
          You can lock {balance}more SUB to increase your future rewards
        </span>
      </div>
      <Button
        href='/staking'
        size={isTouchDevice() ? 'sm' : 'md'}
        className='w-fit bg-white text-black'
      >
        Lock SUB
      </Button>
    </div>
  )
}

export default IncreaseStakeBanner
