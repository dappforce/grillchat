export function preventWindowUnload() {
  window.onbeforeunload = function (e) {
    e.preventDefault()
    // For IE and Firefox prior to version 4
    if (e) {
      e.returnValue = ''
    }

    // For Safari
    return ''
  }
}

export function allowWindowUnload() {
  window.onbeforeunload = null
}

export function getUrlQuery(queryName: string) {
  const query = window.location.search
  const searchParams = new URLSearchParams(query)
  return searchParams.getAll(queryName)
}
