import { useEffect, useState } from 'react'

export default function useSearch() {
  const [search, setSearch] = useState('')
  const [focusedElementIndex, setFocusedElementIndex] = useState(-1)

  const getFocusedElementIndex = (searchResults: unknown[]) => {
    return focusedElementIndex === -1
      ? focusedElementIndex
      : focusedElementIndex % searchResults.length
  }

  const removeFocusedElement = () => {
    setFocusedElementIndex(-1)
  }
  const onDownClick = () => {
    setFocusedElementIndex((prev) => prev + 1)
  }
  const onUpClick = () => {
    setFocusedElementIndex((prev) => prev - 1)
  }

  useEffect(() => {
    setFocusedElementIndex(-1)
  }, [search])

  return {
    search,
    setSearch,
    getFocusedElementIndex,
    focusController: {
      removeFocusedElement,
      onDownClick,
      onUpClick,
    },
  }
}
