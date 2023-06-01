import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { validateAddress } from '@/utils/account'
import { getCaptchaSecret, getServerMnemonic } from '@/utils/env/server'
import { Keyring } from '@polkadot/keyring'
import { waitReady } from '@polkadot/wasm-crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const bodySchema = z.object({
  captchaToken: z.string(),
  address: z.string(),
})

export type ApiRequestTokenBody = z.infer<typeof bodySchema>
export type ApiRequestTokenResponse = {
  success: boolean
  message: string
  errors?: any
  data?: string
  hash?: string
}

const VERIFIER = 'https://www.google.com/recaptcha/api/siteverify'
const BURN_AMOUNT = 0.5 * 10 ** 10

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiRequestTokenResponse>
) {
  if (req.method !== 'POST') return res.status(404).end()

  const body = bodySchema.safeParse(req.body)
  if (!body.success) {
    return res.status(400).send({
      success: false,
      message: 'Invalid request body',
      errors: body.error.errors,
    })
  }

  const isValidAddress = await validateAddress(body.data.address)
  if (!isValidAddress)
    return res.status(400).send({
      success: false,
      message: 'Invalid address format',
    })

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
    console.error('Failed to send token', e)

    if (typeof e.message === 'string' && e.message.startsWith('1010:')) {
      return res.status(400).send({
        success: false,
        message:
          'The faucet does not have a high enough balance, please contact the developers to refill it',
        errors: e.message,
      })
    }

    return res.status(500).send({
      success: false,
      message: 'Failed to send token',
      errors: e.message,
    })
  }

  return res.status(200).send({ success: true, message: 'OK', data: hash })
}

async function getServerAccount() {
  const mnemonic = getServerMnemonic()
  const keyring = new Keyring()
  await waitReady()
  return keyring.addFromMnemonic(mnemonic, {}, 'sr25519')
}

async function getPaymentFee() {
  const signer = await getServerAccount()
  const subsocialApi = await getSubsocialApi()
  const substrateApi = await subsocialApi.substrateApi
  const paymentFee = await substrateApi.tx.energy
    .generateEnergy(signer.address, BURN_AMOUNT)
    .paymentInfo(signer.address)
  return paymentFee.partialFee.toNumber() + BURN_AMOUNT
}

async function isEnoughBalance() {
  const signer = await getServerAccount()
  const subsocialApi = await getSubsocialApi()
  const substrateApi = await subsocialApi.substrateApi
  const balance = await substrateApi.query.system.account(signer.address)
  const paymentFee = await getPaymentFee()
  return balance.data.free.toNumber() > paymentFee
}

async function verifyCaptcha(captchaToken: string) {
  const formData = new URLSearchParams()
  formData.append('secret', getCaptchaSecret())
  formData.append('response', captchaToken)
  const res = await fetch(VERIFIER, {
    method: 'POST',
    body: formData,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  const jsonRes = await res.json()
  if (!jsonRes.success) throw new Error('Invalid Token')
  return true
}

async function sendToken(address: string) {
  const signer = await getServerAccount()
  if (!signer) throw new Error('Invalid Mnemonic')
  if (!(await isEnoughBalance()))
    throw new Error('Account balance is not enough')

  const subsocialApi = await getSubsocialApi()
  const substrateApi = await subsocialApi.substrateApi
  const tx = await substrateApi.tx.energy
    .generateEnergy(address, BURN_AMOUNT)
    .signAndSend(signer, { nonce: -1 })

  return tx.hash.toString()
}
