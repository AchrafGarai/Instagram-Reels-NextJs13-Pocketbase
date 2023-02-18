// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { pb } from 'utils/pocketbase'
import NextCors from 'nextjs-cors'

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // Run the cors middleware
  // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: `${process.env.NEXT_PUBLIC_POCKETBASE}`,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

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
