// src/app/api/events/route.ts

import mongoClient, { connectMongoClient } from '@/app/libs/mongodb';
import { NextRequest } from 'next/server';


export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const write = (data: string) => {
    writer.write(encoder.encode(data));
  };

  write("event: message\n");
  write("data: Connecting to MongoDB...\n\n");

  await connectMongoClient();

  const database = mongoClient.db('dev');
  const familyCollection = database.collection('Pet');

  const familyChangeStream = familyCollection.watch();

  familyChangeStream.on('change', (change: any) => {
    const eventData = JSON.stringify({ type: 'change', data: change });
    write(`pet: event: message\n`);
    write(`data: ${eventData}\n\n`);
  });

  // Clean up on client disconnect
  req.signal.addEventListener('abort', () => {
    familyChangeStream.close();
    writer.close();
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
