import { cx } from '@/utils/class-names'
import React, { useEffect, useState } from 'react'
import FieldWrapper from './common/FieldWrapper'

interface TagProps {
  text: string
  remove: (text: string) => void
  disabled?: boolean
  className?: string
}

export interface TagsInputProps {
  name?: string
  placeholder?: string
  value?: string[]
  onChange?: (tags: string[]) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  separators?: string[]
  disableBackspaceRemove?: boolean
  onExisting?: (tag: string) => void
  onRemoved?: (tag: string) => void
  disabled?: boolean
  isEditOnRemove?: boolean
  beforeAddValidate?: (tag: string, existingTags: string[]) => boolean
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  classNames?: {
    input?: string
    tag?: string
  }
  maxTagsCount?: number
}

const defaultSeparators = ['Enter', 'Tab']

const Tag: React.FC<TagProps> = ({ text, remove, disabled, className }) => {
  const handleOnRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    remove(text)
  }

  return (
    <span
      className={`flex h-fit  items-center rounded bg-slate-300 px-2 py-1 ${className}`}
    >
      <span>{text}</span>
      {!disabled && (
        <button
          type='button'
          onClick={handleOnRemove}
          aria-label={`remove ${text}`}
          className='ml-2 cursor-pointer rounded-full border-0 bg-transparent p-0 hover:text-neutral-400 hover:transition-colors'
        >
          &#10005;
        </button>
      )}
    </span>
  )
}

const TagsInput: React.FC<TagsInputProps> = ({
  name,
  placeholder,
  value = [],
  onChange,
  onBlur,
  separators,
  disableBackspaceRemove,
  onExisting,
  onRemoved,
  disabled,
  isEditOnRemove,
  beforeAddValidate,
  onKeyUp,
  classNames,
  maxTagsCount,
}) => {
  const [tags, setTags] = useState<string[]>(value)

  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(tags)) {
      setTags(value || [])
    }
  }, [value])

  useEffect(() => {
    onChange?.(tags)
  }, [tags.length])

  const placeholderText =
    maxTagsCount !== undefined && tags.length >= maxTagsCount ? '' : placeholder

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()

    if (
      !e.currentTarget.value &&
      !disableBackspaceRemove &&
      tags.length &&
      e.key === 'Backspace'
    ) {
      e.currentTarget.value = isEditOnRemove ? `${tags.at(-1)} ` : ''
      setTags(tags.slice(0, -1))
      return
    }

    if (maxTagsCount !== undefined && tags.length >= maxTagsCount) {
      e.preventDefault()
      return
    }

    const text = e.currentTarget.value

    if (text && (separators || defaultSeparators).includes(e.key)) {
      e.preventDefault()
      if (beforeAddValidate && !beforeAddValidate(text, tags)) return

      if (tags.includes(text)) {
        onExisting?.(text)
        return
      }

      setTags([...tags, text])
      e.currentTarget.value = ''
    }
  }

  const onTagRemove = (text: string) => {
    setTags(tags.filter((tag) => tag !== text))
    onRemoved?.(text)
  }

  return (
    <FieldWrapper>
      {(id, commonClassNames) => (
        <div
          aria-labelledby={name}
          className={cx(
            commonClassNames,
            'flex min-h-[42.75px] flex-wrap items-center gap-2 py-1'
          )}
        >
          {tags.map((tag) => (
            <Tag
              key={tag}
              className={classNames?.tag}
              text={tag}
              remove={onTagRemove}
              disabled={disabled}
            />
          ))}

          <input
            className='focus-visible:ring-ring flex-grow bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50'
            type='text'
            name={name}
            placeholder={tags.length ? undefined : placeholderText}
            onKeyDown={handleOnKeyDown}
            onBlur={onBlur}
            disabled={disabled}
            onKeyUp={onKeyUp}
          />
        </div>
      )}
    </FieldWrapper>
  )
}

export { TagsInput }
