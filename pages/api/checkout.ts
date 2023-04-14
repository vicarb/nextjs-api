import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import axios from 'axios';

// Initializing the cors middleware
const corsMiddleware = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { total, sessionId, buyOrder, returnUrl } = req.body;

  const response = await axios.post(
    'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions',
    {
      buy_order: buyOrder,
      session_id: sessionId,
      amount: total,
      return_url: returnUrl,
    },
    {
      headers: {
        'Tbk-Api-Key-Id': process.env.API_KEY_ID,
        'Tbk-Api-Key-Secret': process.env.API_KEY_SECRET,
        'Content-Type': 'application/json',
        'Cookie': 'cookie_webpay3g_certificacion=!08oiwf4Z8wxrKTcUD7R6wO4wxcsBHtvuAf7jPSdXmZ2isn6DXtUWKc+v9oWzKZGTxTpSiB1fv/JPjEA='
      },
    }
  );

  res.status(200).json({ url: response.data.url, token: response.data.token });
}

export default async function(req: NextApiRequest, res: NextApiResponse) {
  // Run the middleware
  await runMiddleware(req, res, corsMiddleware);

  // Rest of the API logic
  handler(req, res);
};