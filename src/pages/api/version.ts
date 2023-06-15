import { NextApiRequest, NextApiResponse } from 'next'

const VERSION = '1'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ version: VERSION })
}
