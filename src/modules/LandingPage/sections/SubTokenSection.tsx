import { cx } from '@/utils/class-names'
import Script from 'next/script'
import { ComponentProps, useRef } from 'react'

export default function SubTokenSection(props: ComponentProps<'section'>) {
  const elementRef = useRef()
  return (
    <section {...props} className={cx('mx-auto max-w-6xl', props.className)}>
      <h3 className='mb-10 text-center text-5xl font-bold'>
        On Grill you earn in SUB tokens that are convertible and transferable
      </h3>
      <Script
        src='https://widgets.coingecko.com/coingecko-coin-market-ticker-list-widget.js'
        onLoad={() => {
          const sheet = new CSSStyleSheet()
          sheet.insertRule(
            `.cg-container { color: white; background: transparent !important; border: none; }`
          )
          sheet.insertRule(`.cg-container a { color: white; }`)
          sheet.insertRule(
            `.cg-center-align { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }`
          )
          // @ts-expect-error - shadowRoot is not in the types
          elementRef.current?.shadowRoot?.adoptedStyleSheets?.push(sheet)
        }}
      ></Script>
      <div className='overflow-clip rounded-3xl bg-white/10 px-6 py-2'>
        {/** @ts-expect-error - this widget (web component) is not in jsx.element */}
        <coingecko-coin-market-ticker-list-widget
          ref={elementRef}
          className='test'
          coin-id='subsocial'
          currency='usd'
          locale='en'
        />
      </div>
    </section>
  )
}
