import { removeDoubleSpaces } from '@/utils/strings'
import { matchSorter } from 'match-sorter'
import { useEffect, useMemo, useState } from 'react'

export default function useSearch<T>(data: T[], searchKeys: string[]) {
  const [search, setSearch] = useState('')

  const searchResults = useMemo(() => {
    let searchResults = data
    const processedSearch = removeDoubleSpaces(search)

    if (processedSearch) {
      searchResults = matchSorter(data, processedSearch, {
        keys: searchKeys,
      })
    }

    return searchResults
  }, [search, data, searchKeys])

  const [focusedElementIndex, setFocusedElementIndex] = useState(-1)
  useEffect(() => {
    setFocusedElementIndex(-1)
  }, [search])
  const removeFocusedElement = () => {
    setFocusedElementIndex(-1)
  }
  const onDownClick = () => {
    setFocusedElementIndex((prev) =>
      Math.min(prev + 1, searchResults.length - 1)
    )
  }
  const onUpClick = () => {
    setFocusedElementIndex((prev) => Math.max(prev - 1, 0))
  }

  return {
    search,
    setSearch,
    searchResults,
    focusController: {
      focusedElementIndex,
      removeFocusedElement,
      onDownClick,
      onUpClick,
    },
  }
}
