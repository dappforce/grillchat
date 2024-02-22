import { cx } from '@/utils/class-names'
import Script from 'next/script'
import { ComponentProps, useRef } from 'react'
import Heading from '../common/Heading'

export default function SubTokenSection(props: ComponentProps<'section'>) {
  const elementRef = useRef()
  return (
    <section {...props} className={cx('mx-auto max-w-6xl', props.className)}>
      <Heading
        className={cx(
          'mb-10 font-medium text-[#FEEFFB] md:font-bold md:text-white'
        )}
      >
        On Grill you earn in SUB tokens that are convertible and transferable
      </Heading>
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
      <div className='overflow-clip rounded-3xl bg-white/10 px-2 py-2 md:px-6'>
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
