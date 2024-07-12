// utils/mongodbEvents.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ChangeEvent } from 'mongodb';

const uri = process.env.DATABASE_URL!;
const options = {};

let mongoClient: MongoClient;

async function connectMongoClient() {
  if (!mongoClient) {
    mongoClient = new MongoClient(uri, options);
    await mongoClient.connect();
  }
}

export async function handleSSE(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Encoding', 'none'); // Set Content-Encoding to none

    try {
      await connectMongoClient();

      const database = mongoClient.db('dev');
      const familyCollection = database.collection('Family');

      const familyChangeStream = familyCollection.watch();

      familyChangeStream.on('change', (change: ChangeEvent<any>) => {
        const eventData = JSON.stringify({ type: 'change', data: change });

        res.write('event: message\n');
        res.write(`data: ${eventData}\n\n`);
      });

      // Clean up on client disconnect
      req.on('close', () => {
        familyChangeStream.close();
        res.end();
      });

    } catch (error) {
      console.error('Error in SSE handler:', error);
      res.status(500).end();
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
