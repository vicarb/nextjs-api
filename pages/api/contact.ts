import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
)  {
    if (req.method === 'POST') {
      // Handle POST request
      const data = JSON.parse(req.body);
      const { name, email, message } = data;
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Message:', message);
      res.status(200).json({ message: 'Message sent successfully!' });
    } else if (req.method === 'GET') {
      // Handle GET request
      res.status(200).json({ message: 'This is the contact form GET endpoint.' });
    } else {
      // Handle other types of requests
      res.status(400).json({ error: 'Unsupported request method.' });
    }
  }