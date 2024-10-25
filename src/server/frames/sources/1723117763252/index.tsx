/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { env } from '@/env.mjs'
import { createFramesLike } from '@/server/datahub-queue/frames'
import { FRAME_IMAGE_SIZE, FrogFramesManager } from '@/server/frames/utils/frog'
import {
  DatahubParams,
  createSignedSocialDataEvent,
  createSocialDataEventPayload,
} from '@/services/datahub/utils'
import { Signer, generateAccount, loginWithSecretKey } from '@/utils/account'
import { formatNumber } from '@/utils/strings'
import {
  IdentityProvider,
  SocialCallDataArgs,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import { Button, Frog } from 'frog'
import urlJoin from 'url-join'
import { getAddressBalance, linkIdentityWithResult } from '../../utils/identity'

const frameName = '1723117763252'
const frameRootPath = `/${frameName}`

const shareLink = `https://warpcast.com/~/compose?text=Step%20by%20step,%20meme%20by%20meme!%20Share,%20laugh,%20and%20track%20your%20progress%20%F0%9F%A4%A3%F0%9F%93%88&embeds%5B%5D=${env.NEXT_PUBLIC_BASE_URL}/api/frames/${frameName}`

const getButtonHref = (path: string) => urlJoin(frameRootPath, path)

function getImageUrl(imageId: number, ext = 'jpg'): string {
  return `${env.NEXT_PUBLIC_BASE_URL}/frames/${frameName}/${imageId}.${ext}`
}

const sessions: Map<number, { parentProxyAddress: string; signer: Signer }> =
  new Map()
async function getSession(
  fid: number
): Promise<{ parentProxyAddress: string; signer: Signer }> {
  if (sessions.has(fid)) {
    return sessions.get(fid)!
  }

  const { secretKey } = await generateAccount()
  const signer = await loginWithSecretKey(secretKey)

  const params: DatahubParams<
    SocialCallDataArgs<'synth_init_linked_identity'>
  > = {
    address: signer.address,
    signer: signer,
    isOffchain: true,
    // need to provide timestamp to not try to get time from api, which can't be done because its on backend
    timestamp: Date.now(),
    args: {
      externalProvider: {
        id: fid.toString(),
        provider: IdentityProvider.FARCASTER,
      },
      synthetic: true,
    },
  }
  const input = await createSocialDataEventPayload(
    socialCallName.synth_init_linked_identity,
    params,
    params.args
  )
  const address = await linkIdentityWithResult(signer.address, input)
  if (!address) return { parentProxyAddress: '', signer }

  sessions.set(fid, { parentProxyAddress: address, signer })
  return { signer, parentProxyAddress: address }
}

async function getSignerAndCreateFramesLike(
  fid: number,
  castData:
    | {
        fid: number
        hash: string
      }
    | undefined,
  previousClickedValue: number
) {
  try {
    const { signer, parentProxyAddress } = await getSession(fid)
    if (!parentProxyAddress) return

    const params: DatahubParams<
      SocialCallDataArgs<'synth_active_staking_create_farcaster_frame_like'>
    > = {
      address: signer.address,
      proxyToAddress: parentProxyAddress,
      signer: signer,
      isOffchain: true,
      timestamp: Date.now(),
      args: {
        frameId: parseInt(frameName),
        frameStepIndex: previousClickedValue,
        actorFid: fid,
        castOwnerFid: castData?.fid ?? 0,
        castHash: castData?.hash ?? '-',
      },
    }
    const input = await createSignedSocialDataEvent(
      'synth_active_staking_create_farcaster_frame_like',
      params,
      params.args
    )
    await createFramesLike(input)
  } catch (err) {
    console.error('Failed to create frames like', err)
  }
}

const memesAmount = 7
const channelLink = 'https://warpcast.com/~/channel/meme2earn'

const frame = {
  name: frameName,
  src: [
    ...Array.from({ length: memesAmount }).map((_, i) => {
      const path = `${frameRootPath}${i > 0 ? `/${i + 1}` : ''}`
      return {
        path,
        handler: (app: Frog) => {
          app.frame(path, async (c) => {
            FrogFramesManager.sendAnalyticsEventOnFrameAction(frameName, c, {
              frameStepId: i + 1,
            })

            const fid = c.frameData?.fid
            const previousClickedValue = c.buttonValue
            if (
              fid &&
              previousClickedValue &&
              parseInt(previousClickedValue) <= memesAmount
            ) {
              getSignerAndCreateFramesLike(
                fid,
                c.frameData?.castId,
                parseInt(previousClickedValue)
              )
            }

            let intents: any[] = [
              <Button
                value={(i + 2).toString()}
                action={getButtonHref(`/${i + 2}`)}
              >
                Next meme ➡️
              </Button>,
            ]
            if (i === 0) {
              intents.unshift(
                <Button
                  value='what-is-epic-from-first-frame'
                  action={getButtonHref('/what-is-epic')}
                >
                  ℹ️ What is EPIC?
                </Button>
              )
            } else if (i === memesAmount - 1) {
              intents = [
                <Button value='my-stats' action={getButtonHref('/my-stats')}>
                  My Stats
                </Button>,
                <Button.Link href={channelLink}>More</Button.Link>,
                <Button.Link href={shareLink}>Share</Button.Link>,
              ]
            } else {
              intents.unshift(
                <Button.Link href={shareLink}>📢 Share memes</Button.Link>
              )
            }

            // first frame needs to be small, so it just shows the image
            if (i === 0) {
              return c.res({
                image: getImageUrl(i + 1),
                intents,
              })
            }
            return c.res({
              image: (
                <div style={{ display: 'flex', position: 'relative' }}>
                  <img
                    src={getImageUrl(i + 1)}
                    alt=''
                    width={FRAME_IMAGE_SIZE}
                    height={FRAME_IMAGE_SIZE}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      objectFit: 'cover',
                      filter: 'blur(30px)',
                    }}
                  />
                  <img
                    src={getImageUrl(i + 1)}
                    alt=''
                    width={FRAME_IMAGE_SIZE}
                    height={FRAME_IMAGE_SIZE}
                    style={{
                      objectFit: 'contain',
                      position: 'relative',
                    }}
                  />
                </div>
              ),
              intents,
            })
          })
        },
      }
    }),
    {
      path: `${frameRootPath}/my-stats`,
      handler: (app: Frog) => {
        app.frame(`${frameRootPath}/my-stats`, async (c) => {
          FrogFramesManager.sendAnalyticsEventOnFrameAction(frameName, c, {
            frameStepId: 'my-stats',
          })

          const fid = c.frameData?.fid
          const previousClickedValue = c.buttonValue
          if (
            fid &&
            previousClickedValue &&
            parseInt(previousClickedValue) <= memesAmount
          ) {
            getSignerAndCreateFramesLike(
              fid,
              c.frameData?.castId,
              parseInt(previousClickedValue)
            )
          }

          let balance = 0
          if (fid) {
            const session = await getSession(fid)
            balance = await getAddressBalance(session.parentProxyAddress)
          }

          return c.res({
            image: (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: FRAME_IMAGE_SIZE,
                  width: FRAME_IMAGE_SIZE,
                  padding: '20px',
                  color: '#075255',
                  textAlign: 'center',
                  background: '#18E6F3',
                  gap: '8px',
                }}
              >
                <img
                  alt=''
                  src={`${env.NEXT_PUBLIC_BASE_URL}/frames/gradient-blue.png`}
                  style={{
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                />
                <img
                  alt=''
                  src={`${env.NEXT_PUBLIC_BASE_URL}/frames/epic-blue.png`}
                  style={{
                    position: 'absolute',
                    top: '32px',
                    left: '32px',
                    width: '120px',
                  }}
                />
                <span
                  style={{
                    fontSize: '32px',
                    fontFamily: 'OpenSans-Medium, sans-serif',
                    fontWeight: 500,
                    position: 'relative',
                  }}
                >
                  Your EPIC points:
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    position: 'relative',
                  }}
                >
                  <img
                    alt=''
                    src={`${env.NEXT_PUBLIC_BASE_URL}/frames/diamond.png`}
                    style={{
                      width: '92px',
                      height: '92px',
                      position: 'relative',
                      top: '2px',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '80px',
                      fontFamily: 'OpenSans-Bold',
                      fontWeight: 700,
                    }}
                  >
                    {formatNumber(balance, { shorten: true })}
                  </span>
                </div>
              </div>
            ),
            intents: [
              <Button
                value={memesAmount.toString()}
                action={getButtonHref(`/${memesAmount}`)}
              >
                ⬅️ Back
              </Button>,
              <Button
                value='what-is-epic-from-my-stats'
                action={getButtonHref('/what-is-epic')}
              >
                ℹ️ What is EPIC?
              </Button>,
            ],
          })
        })
      },
    },

    {
      path: `${frameRootPath}/what-is-epic`,
      handler: (app: Frog) => {
        app.frame(`${frameRootPath}/what-is-epic`, async (c) => {
          FrogFramesManager.sendAnalyticsEventOnFrameAction(frameName, c, {
            frameStepId: 'what-is-epic',
          })

          const fid = c.frameData?.fid
          const previousClickedValue = c.buttonValue
          if (
            fid &&
            previousClickedValue &&
            parseInt(previousClickedValue) <= memesAmount
          ) {
            getSignerAndCreateFramesLike(
              fid,
              c.frameData?.castId,
              parseInt(previousClickedValue)
            )
          }

          return c.res({
            image: (
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#37F561',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '24px',
                  height: FRAME_IMAGE_SIZE,
                  width: FRAME_IMAGE_SIZE,
                  padding: '20px',
                  color: '#043D10',
                  textAlign: 'center',
                }}
              >
                <img
                  alt=''
                  src={`${env.NEXT_PUBLIC_BASE_URL}/frames/gradient-green.png`}
                  style={{
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                />
                <img
                  alt=''
                  src={`${env.NEXT_PUBLIC_BASE_URL}/frames/epic-green.png`}
                  style={{ width: '200px', position: 'relative' }}
                />
                <p
                  style={{
                    fontSize: '32px',
                    fontFamily: 'OpenSans-Medium, sans-serif',
                    fontWeight: 500,
                    position: 'relative',
                  }}
                >
                  EPIC is a platform for gamified content monetization where
                  hundreds of thousands of users earn rewards by liking and
                  posting memes.
                </p>
              </div>
            ),
            intents: [
              <Button
                value={memesAmount.toString()}
                action={getButtonHref(
                  `/${
                    previousClickedValue?.endsWith('from-first-frame')
                      ? ''
                      : 'my-stats'
                  }`
                )}
              >
                ⬅️ Back
              </Button>,
              <Button.Link href={channelLink}>👉 Follow us!</Button.Link>,
            ],
          })
        })
      },
    },
  ],
}
export default frame
