import { env } from '@/env.mjs'
import { sendServerEvent } from '@/server/analytics'
import { Frog } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { serveStatic } from 'frog/serve-static'
import { FrameData } from 'frog/types/frame'
import frames from '../sources'
import { FrameDefinition } from './types'

export const FRAME_IMAGE_SIZE = 600

export class FrogFramesManager {
  private promise: Promise<Frog> | null = null
  private static instance: FrogFramesManager
  private frogAppInstance: Frog | null = null
  private frameDefinitions: { [key: string]: FrameDefinition } = {}

  static getInstance(): FrogFramesManager {
    if (!FrogFramesManager.instance) {
      FrogFramesManager.instance = new FrogFramesManager()
    }
    return FrogFramesManager.instance
  }

  constructor() {
    this.importFramesDefinitions()
    this.initFrogApp()
  }

  async getFrogApp(): Promise<Frog> {
    if (this.promise) {
      return await this.promise
    }
    if (this.frogAppInstance) return this.frogAppInstance

    this.importFramesDefinitions()
    this.promise = this.initFrogApp()
    this.frogAppInstance = await this.promise

    return this.frogAppInstance!
  }

  private importFramesDefinitions() {
    Object.keys(frames).forEach((key) => {
      // @ts-ignore
      this.frameDefinitions[key] = frames[key] as FrameDefinition
    })
  }

  initFrames(frog: Frog) {
    for (const frameDefinition in this.frameDefinitions) {
      for (const frame of this.frameDefinitions[frameDefinition].src) {
        frame.handler(frog)
      }
    }
  }

  async initFrogApp() {
    const [fontDataBold, fontDataMedium] = await Promise.all([
      fetch('http://localhost:3000/fonts/OpenSans-Bold.ttf').then((res) =>
        res.arrayBuffer()
      ),
      fetch('http://localhost:3000/fonts/OpenSans-Medium.ttf').then((res) =>
        res.arrayBuffer()
      ),
    ])

    const instance = new Frog({
      assetsPath: '/',
      basePath: '/api/frames',
      browserLocation: 'https://epicapp.net/',
      ...(env.NEYNAR_API_KEY
        ? { hub: neynar({ apiKey: env.NEYNAR_API_KEY || '' }) }
        : {}),
      title: 'Epic Meme2Earn',
      secret: env.FRAMES_SECRET,
      imageAspectRatio: '1:1',
      // imageAspectRatio: '1.91:1',
      imageOptions: {
        fonts: [
          {
            name: 'OpenSans-Medium',
            weight: 500,
            data: fontDataMedium,
          },
          {
            name: 'OpenSans-Bold',
            weight: 700,
            data: fontDataBold,
          },
        ],
        width: FRAME_IMAGE_SIZE,
        height: FRAME_IMAGE_SIZE,
      },
    })

    this.initFrames(instance)

    devtools(instance, { serveStatic })

    return instance
  }

  static sendAnalyticsEventOnFrameAction<
    C extends {
      status: 'initial' | 'redirect' | 'response'
      url: string
      frameData?: FrameData
      buttonValue?: string
    }
  >(frameName: string, contextData: C, customPayload: Record<any, any> = {}) {
    const { buttonValue, status, frameData, url } = contextData

    if (status === 'initial') {
      sendServerEvent('farcaster_frame_initial_open', {
        frameName,
        frameStepId: 1,
        frameUrl: url,
        ...customPayload,
      })
    } else if (status === 'response') {
      sendServerEvent('farcaster_frame_step_open', {
        frameName,
        frameStepId: 1,
        frameUrl: url,
        buttonValue,
        ...(frameData
          ? {
              interactorFid: frameData.fid,
              castHash: frameData.castId.hash,
              castOwnerFid: frameData.castId.fid,
              messageHash: frameData.messageHash,
              timestamp: frameData.timestamp,
            }
          : {}),
        ...customPayload,
      })
    }
  }
}
