import { removeDoubleSpaces } from '@/utils/strings'
import { matchSorter } from 'match-sorter'
import { useEffect, useState } from 'react'

export default function useSearch() {
  const [search, setSearch] = useState('')
  const [focusedElementIndex, setFocusedElementIndex] = useState(-1)

  const getSearchResults = <T>(data: T[], searchKeys: string[]) => {
    let searchResults = data
    const processedSearch = removeDoubleSpaces(search)

    if (processedSearch) {
      searchResults = matchSorter(data, processedSearch, {
        keys: searchKeys,
      })
    }

    return {
      searchResults,
      focusedElementIndex: focusedElementIndex % searchResults.length,
    }
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
    getSearchResults,
    focusController: {
      removeFocusedElement,
      onDownClick,
      onUpClick,
    },
  }
}
