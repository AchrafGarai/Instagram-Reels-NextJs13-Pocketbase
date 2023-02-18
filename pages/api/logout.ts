// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import { pb } from 'utils/pocketbase'

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
      pb.authStore.clear()
      res.setHeader('set-cookie', pb.authStore.exportToCookie())
      res.status(200).json({ message: `Logged out successfully` })
    } catch (e) {
      res.status(500).json({ message: `Unable to logout` })
    }
  } else {
    res.status(400).json({ message: `Only POST request is supported` })
  }
}
