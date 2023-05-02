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
        const db = await connectToDatabase();
        console.log(db)
        const products = await db.collection('products').find({}).toArray();
        res.status(200).json({ products });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error connecting to database' });
      }
      break;

    case 'POST':
      try {
        const db = await connectToDatabase();
        const { name, image, price, description, quantity } = req.body;
        const newProduct = { name, image, price, description, quantity: quantity || 0 };
        const result = await db.collection('products').insertOne(newProduct);

        res.status(200).json({ result });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error connecting to database' });
      }
      break;

    case 'PUT':
      try {
        const db = await connectToDatabase();
        const { id, name, image, price, description } = req.body;
        const updatedProduct = { name, image, price, description };
        const result = await db.collection('products').updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedProduct }
        );
        res.status(200).json({ result });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error connecting to database' });
      }
      break;

    case 'DELETE':
      try {
        const db = await connectToDatabase();
        const { id } = req.body;
        const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ result });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error connecting to database' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
