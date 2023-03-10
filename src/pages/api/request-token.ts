import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { getCaptchaSecret, getServerMnemonic } from '@/utils/env/server'
import { Keyring } from '@polkadot/keyring'
import { waitReady } from '@polkadot/wasm-crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const schema = z.object({
  captchaToken: z.string(),
  address: z.string(),
})

type Data = {
  success: boolean
  message: string
  errors?: any
  data?: string
  hash?: string
}

const VERIFIER = 'https://hcaptcha.com/siteverify'

async function verifyCaptcha(captchaToken: string) {
  const formData = new FormData()
  formData.append('secret', getCaptchaSecret())
  formData.append('response', captchaToken)
  const res = await fetch(VERIFIER, {
    method: 'POST',
    body: formData,
  })
  const jsonRes = await res.json()
  if (!jsonRes.success) throw new Error('Invalid Token')
  return true
}

async function getServerAccount() {
  const mnemonic = getServerMnemonic()
  const keyring = new Keyring()
  await waitReady()
  return keyring.addFromMnemonic(mnemonic, {}, 'sr25519')
}
async function sendToken(address: string) {
  const signer = await getServerAccount()
  if (!signer) throw new Error('Invalid Mnemonic')

  const subsocialApi = await getSubsocialApi()
  const substrateApi = await subsocialApi.substrateApi
  const amount = 0.3 * 10 ** 10
  const tx = await substrateApi.tx.energy
    .generateEnergy(address, amount)
    .signAndSend(signer, { nonce: -1 })

  return tx.hash.toString()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') return res.status(404).end()

  const body = schema.safeParse(req.body)
  if (!body.success) {
    return res.status(400).send({
      success: false,
      message: 'Invalid request body',
      errors: body.error.errors,
    })
  }

  try {
    await verifyCaptcha(body.data.captchaToken)
  } catch (e: any) {
    return res.status(400).send({
      success: false,
      message: 'Captcha failed',
      errors: e.message,
    })
  }

  let hash: string
  try {
    hash = await sendToken(body.data.address)
  } catch (e: any) {
    return res.status(500).send({
      success: false,
      message: 'Failed to send token',
      errors: e.message,
    })
  }

  return res.status(200).send({ success: true, message: 'OK', data: hash })
}
