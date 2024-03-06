import { cx } from '@/utils/class-names'
import { sectionBg } from './content-staking/utils/SectionWrapper'
import { mutedTextColorStyles } from './content-staking/utils/commonStyles'

export type Column = {
  index: string
  name: string
  align?: 'left' | 'center' | 'right'
}

type TableProps = {
  columns: Column[]
  data: any[]
}

const Table = ({ columns, data }: TableProps) => {
  return (
    <div className={cx('relative overflow-x-auto rounded-2xl', sectionBg)}>
      <table className='w-full text-left'>
        <thead
          className={cx(
            'bg-slate-50 text-base backdrop-blur-xl dark:bg-white/5',
            mutedTextColorStyles
          )}
        >
          <tr>
            {columns.map(({ name, index, align }, i) => (
              <th
                key={index}
                scope='col'
                className={cx(
                  'px-6 py-4 font-normal',
                  `text-${align || 'left'}`
                )}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => {
            return (
              <tr
                key={i}
                className={cx(
                  'border-b border-[#D4E2EF] dark:border-white/20',
                  {
                    ['border-none']: i === data.length - 1,
                  }
                )}
              >
                {columns.map(({ index, align }, j) => {
                  const value = item[index]

                  return (
                    <td
                      key={`${index}-${j}`}
                      className={cx('px-6 py-4', `text-${align || 'left'}`)}
                    >
                      {value}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table
