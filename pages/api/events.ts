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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.writeHead(200, {
    "Connection": "keep-alive",
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
    "Content-Encoding": "none"
  });
  res.flushHeaders()

  await connectMongoClient();

  const database = mongoClient.db('dev');
  const familyCollection = database.collection('Family');

  const familyChangeStream = familyCollection.watch();

  familyChangeStream.on('change', (change: ChangeEvent<any>) => {
    const eventData = JSON.stringify({ type: 'change', data: change });


    // console.log(`eventData: ${eventData}`)
    res.write(`event: message\n`)
    res.write(`data: {"value": ${JSON.stringify(eventData)}}`); // Write SSE formatted event data
    res.write(`\n\n`)
  });

  // Clean up on client disconnect
  req.on('close', () => {
    familyChangeStream.close();
    res.end();
  });

//   return res
}

// pages/api/events.ts

// pages/api/events.ts
// Backend (pages/api/events.ts)
// import { NextApiRequest, NextApiResponse } from 'next';

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   res.writeHead(200, {
//     "Connection": "keep-alive",
//     "Content-Type": "text/event-stream; charset=utf-8",
//     "Cache-Control": "no-cache",
//     "Content-Encoding": "none"
//   });
//   // Simulate sending events every 2 seconds
//   const interval = setInterval(() => {

//     res.write(`event: message\n`)
//     res.write(`data: {"value": ${2}}`);
//     res.write(`\n\n`);
//     console.log("messsage sent")
//   }, 3000);

//   // Clean up on client disconnect
//   req.on('close', () => {
//     clearInterval(interval);
//     res.end();
//   });

// }
