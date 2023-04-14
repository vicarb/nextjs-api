import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cors from 'micro-cors';


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

export default cors({
    origin: '*'
  })(handler);