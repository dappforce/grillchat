import { truncateAddress } from "@/utils/account"
import AddressAvatar from "./AddressAvatar"
import { CopyTextInline } from "./CopyText"
import { generateRandomName } from "@/utils/random-name"
import useRandomColor from "@/hooks/useRandomColor"
import { cx } from "@/utils/class-names"

type ProfilePreviewProps = {
  address: string
  className?: string
}

const ProfilePreview = ({ address, className }: ProfilePreviewProps) => {
  const senderColor = useRandomColor(address)

  return (
    <div className={cx('flex items-center gap-4', className)}>
      <AddressAvatar address={address} className='h-20 w-20' />
      <div className='flex flex-col'>
        <span className='text-lg' style={{ color: senderColor }}>
          {generateRandomName(address)}
        </span>
        <CopyTextInline
          text={truncateAddress(address)}
          tooltip='Copy my Grill public address'
          textToCopy={address}
          textClassName='font-mono'
        />
      </div>
    </div>
  )
}

export default ProfilePreview
