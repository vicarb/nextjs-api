import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'
import Cors from 'cors';

const uri = process.env.MONGODB_URI
console.log(uri);

const mongoOptions: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};



const options: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function connectToDatabase() {
  const uri = "mongodb+srv://myself:lolaso@cluster0.4eiodjx.mongodb.net/contact"
  const client = await MongoClient.connect(uri, options);

  return client.db();
}


const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS', 'PUT'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
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
  // Run the cors middleware
  await runMiddleware(req, res, cors);

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Connect to the MongoDB database
        const db = await connectToDatabase();

        // Get the contact collection from the database
        const contacts = await db.collection('contact').find({}).toArray();

        // Return the contacts as JSON data
        res.status(200).json({ contacts });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error connecting to database' });
      }
      break;

    case 'POST':
      try {
        // Connect to the MongoDB database
        const db = await connectToDatabase();


        // Insert the new contact into the database
        const { name, email, message } = req.body;
        const newContact = { name, email, message };
        const result = await db.collection('contact').insertOne(newContact);

        // Return the result as JSON data
        res.status(200).json({ result });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error connecting to database' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
