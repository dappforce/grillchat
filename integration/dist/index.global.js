'use strict'
;(() => {
  var p = Object.defineProperty
  var c = Object.getOwnPropertySymbols
  var I = Object.prototype.hasOwnProperty,
    f = Object.prototype.propertyIsEnumerable
  var d = (n, e, t) =>
      e in n
        ? p(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
        : (n[e] = t),
    m = (n, e) => {
      for (var t in e || (e = {})) I.call(e, t) && d(n, t, e[t])
      if (c) for (var t of c(e)) f.call(e, t) && d(n, t, e[t])
      return n
    }
  var h = { spaceId: 'x', targetId: 'opencomm' },
    l = {
      instance: null,
      init(n) {
        var i, a
        let e = m(m({}, h), n),
          t = document.getElementById(e.targetId)
        if (!t) {
          console.error(
            `OpenComm error: Element with id ${e.targetId} not found`
          )
          return
        }
        let o = document.createElement('iframe')
        ;(o.style.border = 'none'),
          (o.style.width = '100%'),
          (o.style.height = '100%')
        let s = `https://grill.chat/${e.spaceId}`
        e.chatRoomId && (s += `/${e.chatRoomId}`)
        let r = new URLSearchParams()
        e.order && r.set('order', e.order.join(',')),
          e.theme && r.set('theme', e.theme),
          (o.src = `${s}?${r.toString()}`),
          e.customizeIframe &&
            ((i = e.customizeIframe) == null || i.call(e, o)),
          (a = this.instance) == null || a.remove(),
          (this.instance = o),
          t.appendChild(o)
      },
    }
  window.opencomm = l
  var u = l
})()
