import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';
import Cors from 'cors';

const uri = "mongodb+srv://myself:lolaso@cluster0.4eiodjx.mongodb.net/products"
const mongoOptions: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function connectToDatabase() {
  const client = await MongoClient.connect(uri, mongoOptions);
  return client.db();
}

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { id } = req.query;
        const db = await connectToDatabase();
        const product = await db.collection('products').findOne({ _id: new ObjectId(String(id)) });
        
        if (product) {
          res.status(200).json(product);
        } else {
          res.status(404).json({ message: 'Product not found' });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error connecting to database' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
