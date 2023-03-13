export function submitClosestForm(element: HTMLElement) {
  const form = element.closest('form')
  if (!form) return

  const dummySubmitBtn = form.ownerDocument.createElement('button')
  dummySubmitBtn.style.display = 'none'
  dummySubmitBtn.type = 'submit'
  form.appendChild(dummySubmitBtn).click()
  form.removeChild(dummySubmitBtn)
}
