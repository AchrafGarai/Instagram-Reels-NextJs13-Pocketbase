// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { pb } from 'utils/pocketbase'

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body
      await pb.collection('users').authWithPassword(email, password)

      if (pb.authStore.isValid) {
        res.setHeader('set-cookie', pb.authStore.exportToCookie())
        res.status(200).json({ message: `Logged in successfully` })
      } else {
        res.status(400).json({ message: `Unable to login` })
      }
    } catch (e) {
      res.status(500).json({ message: `Unable to login` })
    }
  } else {
    res.status(400).json({ message: `Only POST request is supported` })
  }
}
