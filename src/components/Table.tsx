import { cx } from '@/utils/class-names'
import { mutedTextColorStyles } from './content-staking/utils/commonStyles'

export const sectionBg = 'bg-white dark:bg-white/5'

export type Column = {
  index: string
  name?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

type TableProps = {
  columns: Column[]
  data: any[]
  headerClassName?: string
  className?: string
  withDivider?: boolean
  onRowClick?: (item: any) => void
}

const Table = ({
  columns,
  data,
  headerClassName,
  className,
  withDivider = true,
  onRowClick,
}: TableProps) => {
  return (
    <div
      className={cx(
        'relative overflow-x-auto rounded-2xl',
        sectionBg,
        className
      )}
    >
      <table className='w-full text-left'>
        <TableHeader columns={columns} headerClassName={headerClassName} />
        <tbody>
          {data.map((item, i) => {
            return (
              <TableRow
                key={i}
                columns={columns}
                item={item}
                withDivider={withDivider}
                showLastDivider={i === data.length - 1}
                onRowClick={onRowClick}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

type TableColumnsProps = {
  columns: Column[]
  headerClassName?: string
}

export const TableHeader = ({
  columns,
  headerClassName,
}: TableColumnsProps) => {
  return (
    <thead
      className={cx(
        'bg-slate-50 text-base backdrop-blur-xl dark:bg-white/5',
        mutedTextColorStyles,
        headerClassName
      )}
    >
      <tr>
        {columns.map(({ name, index, align, className }) => (
          <th
            key={index}
            scope='col'
            className={cx(
              'px-6 py-4 font-normal',
              `text-${align || 'left'}`,
              className
            )}
          >
            {name}
          </th>
        ))}
      </tr>
    </thead>
  )
}

type TableRowProps = {
  columns: Column[]
  item: any & { className?: string }
  withDivider?: boolean
  showLastDivider?: boolean
  onRowClick?: (item: any) => void
  className?: string
}

export const TableRow = ({
  columns,
  item,
  withDivider,
  showLastDivider,
  onRowClick,
  className,
}: TableRowProps) => {
  return (
    <tr
      className={cx(item?.className, className, {
        ['border-b border-[#D4E2EF] dark:border-white/20']: withDivider,
        ['border-none']: showLastDivider,
        ['cursor-pointer overflow-hidden hover:bg-[#EEF2FF] dark:hover:bg-slate-700']:
          onRowClick,
      })}
      onClick={() => onRowClick?.(item)}
    >
      {columns.map(({ index, align, className }, j) => {
        const value = item[index]

        return (
          <td
            key={`${index}-${j}`}
            className={cx('px-6 py-4', `text-${align || 'left'}`, className)}
          >
            {value}
          </td>
        )
      })}
    </tr>
  )
}

export default Table
