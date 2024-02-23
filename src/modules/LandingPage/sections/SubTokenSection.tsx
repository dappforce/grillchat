import useBreakpointThreshold from '@/hooks/useBreakpointThreshold'
import { cx } from '@/utils/class-names'
import Script from 'next/script'
import { ComponentProps, useEffect, useRef } from 'react'
import Heading from '../common/Heading'

export default function SubTokenSection(props: ComponentProps<'section'>) {
  const elementRef = useRef()
  const mdUp = useBreakpointThreshold('md')

  const handleReady = () => {
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
  }

  useEffect(() => {
    handleReady()
  }, [mdUp])

  return (
    <section {...props} className={cx('mx-auto max-w-6xl', props.className)}>
      <Heading
        className={cx(
          'mb-10 text-2xl font-medium text-[#FEEFFB] sm:font-bold sm:text-white'
        )}
      >
        On Grill you earn in SUB tokens that are convertible and transferable
      </Heading>
      <Script
        onReady={handleReady}
        src='https://widgets.coingecko.com/coingecko-coin-market-ticker-list-widget.js'
      />
      <Script
        onReady={handleReady}
        src='https://widgets.coingecko.com/coingecko-coin-ticker-widget.js'
      />
      <div className='overflow-clip rounded-3xl bg-white/5 px-2 py-2 md:px-6'>
        {mdUp ? (
          // @ts-expect-error - this widget (web component) is not in jsx.element
          <coingecko-coin-market-ticker-list-widget
            onLoad={() => {
              console.log('first')
            }}
            ref={elementRef}
            coin-id='subsocial'
            currency='usd'
            locale='en'
          />
        ) : (
          // @ts-expect-error - this widget (web component) is not in jsx.element
          <coingecko-coin-ticker-widget
            ref={elementRef}
            coin-id='subsocial'
            currency='usd'
            locale='en'
          />
        )}
      </div>
    </section>
  )
}
