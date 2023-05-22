/**
 * @jest-environment jsdom
 */
import { describe, expect, test } from '@jest/globals'
import { SocialResource } from '@subsocial/resource-discussions'
import '@testing-library/jest-dom/extend-expect'
import grill, { GrillConfig } from '../index'

describe('Resource Linking Unit', () => {
  test('Grill should init with channel id', () => {
    document.body.innerHTML = `<div id="grill"></div>`

    expect(document.getElementById('grill')?.id).toEqual('grill')

    const configChannel: GrillConfig = {
      widgetElementId: 'grill',
      hub: { id: '1002' },
      channel: {
        type: 'channel',
        id: '2673',
        settings: {
          enableBackButton: false,
          enableLoginButton: false,
          enableInputAutofocus: true,
        },
      },
      theme: 'light',
      onWidgetCreated: (iframe: HTMLIFrameElement) => {
        iframe.classList.add('my-custom-class')
        return iframe
      },
    }

    grill.init(configChannel)

    expect(document.getElementsByTagName('iframe')?.item(0)?.src).toEqual(
      'https://grill.chat/1002/2673?version=0.1&theme=light&enableBackButton=false&enableLoginButton=false&enableInputAutofocus=true'
    )
  })

  test('Grill should innit with resource', () => {
    document.body.innerHTML = `<div id="grill"></div>`

    expect(document.getElementById('grill')?.id).toEqual('grill')

    const configResource: GrillConfig = {
      widgetElementId: 'grill',
      hub: { id: '1002' },
      channel: {
        type: 'resource',
        resource: new SocialResource({
          schema: 'chain',
          chainType: 'substrate',
          chainName: 'xsocial',
          resourceType: 'block',
          resourceValue: {
            blockNumber: '3444000',
          },
        }),
        settings: {
          enableBackButton: false,
          enableLoginButton: false,
          enableInputAutofocus: true,
        },
        metadata: {
          title: 'New awesome discussion',
          body: 'Really awesome topic!',
          image: 'QmcdXcXQnkdLFE8tKveymXBoGRfbTbkqjhSWD5A4mrU4tX',
        },
      },
      theme: 'light',
      onWidgetCreated: (iframe: HTMLIFrameElement) => {
        iframe.classList.add('my-custom-class')
        return iframe
      },
    }

    grill.init(configResource)

    console.log(document.getElementsByTagName('iframe')?.item(0)?.src)

    expect(document.getElementsByTagName('iframe')?.item(0)?.src).toEqual(
      'https://grill.chat/1002/resource' +
        '?version=0.1' +
        '&theme=light&enableBackButton=false' +
        '&enableLoginButton=false' +
        '&resourceId=chain%253A%252F%252FchainType%253Asubstrate%252FchainName%253Axsocial%252FresourceType%253Ablock%252FblockNumber%253A3444000' +
        '&metadata=%257B%2522title%2522%253A%2522New%2520awesome%2520discussion%2522%252C%2522body%2522%253A%2522Really%2520awesome%2520topic%21%2522%252C%2522image%2522%253A%2522QmcdXcXQnkdLFE8tKveymXBoGRfbTbkqjhSWD5A4mrU4tX%2522%257D' +
        '&enableInputAutofocus=true'
    )
  })
})
