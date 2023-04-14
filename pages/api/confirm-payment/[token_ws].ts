import axios from 'axios';

export default async function handler(req, res) {
  const { token_ws } = req.query;
  console.log("Token_WS:", token_ws);

  const url = `https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${token_ws}`;
  console.log("URL***********************>",url);
  
  const tbkApiKey = process.env.API_KEY_ID;
  const tbkApiSecret = process.env.API_KEY_SECRET;

  try {
    const response = await axios.put(url, null, {
      headers: {
        'Tbk-Api-Key-Id': tbkApiKey,
        'Tbk-Api-Key-Secret': tbkApiSecret,
        'Content-Type': 'application/json'
      }
    });

    /* handle the response and send back any necessary data */
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while confirming the payment.' });
  }
}
