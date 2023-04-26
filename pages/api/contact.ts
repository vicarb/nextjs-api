import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, MongoClientOptions } from 'mongodb';
import Cors from 'cors';


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

const options: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri, options);

async function connectToDatabase() {
    const uri = process.env.MONGODB_URI as string;
    const client = await MongoClient.connect(uri, options);
    console.log("client", client);
    
    return client.db();
  }

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
    if (req.method === 'POST') {
      // Handle POST request
      const data = JSON.parse(req.body);
      
      const { name, email, message } = data;
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Message:', message);
      const db = await connectToDatabase();
      const collection = db.collection('contact');
      console.log("collection", collection);
      
      await collection.insertOne({ name, email, message });
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).json({ message: 'Message sent successfully!' });
    } else if (req.method === 'GET') {
        try {
          const db = await connectToDatabase();
          const collection = db.collection('contact');
          const data = await collection.find({}).toArray();
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.status(200).json({ data });
        } catch (err) {
          console.log(err);
          res.status(500).json({ error: 'Error fetching contact data.' });
        }
      }
  }

  export default async function(req: NextApiRequest, res: NextApiResponse) {
  // Run the middleware
  await runMiddleware(req, res, corsMiddleware);

  // Rest of the API logic
  handler(req, res);
};
