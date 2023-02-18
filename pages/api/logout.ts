// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'
import { pb } from 'utils/pocketbase'
import Cors from 'cors'

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  await runMiddleware(req, res, cors)

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
