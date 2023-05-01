'use strict'
var m = Object.defineProperty
var f = Object.getOwnPropertyDescriptor
var h = Object.getOwnPropertyNames,
  d = Object.getOwnPropertySymbols
var p = Object.prototype.hasOwnProperty,
  g = Object.prototype.propertyIsEnumerable
var l = (n, e, t) =>
    e in n
      ? m(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
      : (n[e] = t),
  i = (n, e) => {
    for (var t in e || (e = {})) p.call(e, t) && l(n, t, e[t])
    if (d) for (var t of d(e)) g.call(e, t) && l(n, t, e[t])
    return n
  }
var u = (n, e) => {
    for (var t in e) m(n, t, { get: e[t], enumerable: !0 })
  },
  C = (n, e, t, o) => {
    if ((e && typeof e == 'object') || typeof e == 'function')
      for (let r of h(e))
        !p.call(n, r) &&
          r !== t &&
          m(n, r, {
            get: () => e[r],
            enumerable: !(o = f(e, r)) || o.enumerable,
          })
    return n
  }
var y = (n) => C(m({}, '__esModule', { value: !0 }), n)
var w = {}
u(w, { default: () => O })
module.exports = y(w)
var E = { spaceId: 'x', targetId: 'opencomm' },
  I = {
    instance: null,
    init(n) {
      var a, c
      let e = i(i({}, E), n),
        t = document.getElementById(e.targetId)
      if (!t) {
        console.error(`OpenComm error: Element with id ${e.targetId} not found`)
        return
      }
      let o = document.createElement('iframe')
      ;(o.style.border = 'none'),
        (o.style.width = '100%'),
        (o.style.height = '100%')
      let r = `https://grill.chat/${e.spaceId}`
      e.chatRoomId && (r += `/${e.chatRoomId}`)
      let s = new URLSearchParams()
      e.order && s.set('order', e.order.join(',')),
        e.theme && s.set('theme', e.theme),
        (o.src = `${r}?${s.toString()}`),
        e.customizeIframe && ((a = e.customizeIframe) == null || a.call(e, o)),
        (c = this.instance) == null || c.remove(),
        (this.instance = o),
        t.appendChild(o)
    },
  }
window.opencomm = I
var O = I
